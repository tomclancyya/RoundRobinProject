import url from 'url';
import http from 'http';
import { Timer } from '../../Common/timer.mjs';
import { DynamicWeightedRoundRobinBalancer } from '../models/round-robin-balancer.mjs';
const targetHost = '127.0.0.1';  // Target server to redirect requests to

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
      
        // Log the request
        console.log(`${method} ${reqUrl}`);

        let selectedServer = balancer.getNextServer()
      
        // Modify the target URL to point to the desired server
        targetUrl.host = selectedServer.hostName;
        targetUrl.port = selectedServer.port;
      
        // Create options for the target server request
        const options = {
          host: targetUrl.hostname,
          port: targetUrl.port,
          path: targetUrl.path,
          method: method,
          headers: headers
        };
      
        timer.start()
        // Create a new request to the target server
        const targetReq = http.request(options, (targetRes) => {
            let responseTime = timer.stop()
            
            //add average response time, it will help calculate server weight
           selectedServer.addResponseTime(responseTime)

          // Log the response
          console.log(`Received response from ${targetHost}:${targetUrl.port}`);

          // mark server which processed the request
          targetRes.headers["routed-to-server-id"] = targetUrl.port
          targetRes.headers["servers-info"] = balancer.getInfo()
      
          // Copy the headers from the target server response to the client response
          clientRes.writeHead(targetRes.statusCode, targetRes.headers);
      
          // Pipe the data from the target server response to the client response
          targetRes.pipe(clientRes, {
            end: true
          });
        });
      
        // Pipe the client request to the target server request
        clientReq.pipe(targetReq, {
          end: true
        });
      
        // Handle errors
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