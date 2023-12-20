import url from 'url';
import http from 'http';
import { Timer } from '../../Common/timer.mjs';
import { DynamicWeightedRoundRobinBalancer } from '../models/round-robin-balancer.mjs';

export class ProxyController {
    /**
     * 
     * @param {*} clientReq 
     * @param {*} clientRes 
     * @param {Timer} timer 
     * @param {DynamicWeightedRoundRobinBalancer} balancer
     */
    static handleRequest(clientReq, clientRes, timer, balancer) {
        const { method, headers, url: reqUrl } = clientReq;
        const targetUrl = url.parse(reqUrl);
      
        console.log(`${method} ${reqUrl}`);

        let selectedServer = balancer.getNextServer()

        targetUrl.host = selectedServer.hostName;
        targetUrl.port = selectedServer.port;
      
        const options = {
          host: targetUrl.hostname,
          port: targetUrl.port,
          path: targetUrl.path,
          method: method,
          headers: headers
        };
      
        timer.start()

        const targetReq = http.request(options, (targetRes) => {
          let responseTime = timer.stop()
            
          //add response time, it will help calculate server weight for round robin
          selectedServer.addResponseTime(responseTime)

          console.log(`Received response from ${targetUrl.host}:${targetUrl.port}`);

          // add additional info for testing purposes
          targetRes.headers["routed-to-server-id"] = targetUrl.port
          targetRes.headers["servers-info"] = balancer.getInfo()
      
          clientRes.writeHead(targetRes.statusCode, targetRes.headers);
          targetRes.pipe(clientRes, {
            end: true
          });
        });
      
        clientReq.pipe(targetReq, {
          end: true
        });
      
        targetReq.on('error', (err) => {
          console.error(`Error with target request: ${err.message}`);
          clientRes.writeHead(500, { 'Content-Type': 'text/plain' });
          clientRes.end('Internal Server Error');
        });
      
        // End the client response when the target request ends
        targetReq.on('close', () => {
          clientRes.end();
        });
    }
}