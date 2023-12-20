import http from 'http';
import { ServerItem } from './server-item.mjs';

export class HealthChecker {
  /**
   * 
   * @param {ServerItem[]} servers 
   */
  constructor(servers) {
    this.servers = servers;
  }

  performHealthCheck() {
    for (const server of this.servers) {
      try {
        console.log(`health check for ${server.getAddress()}`)
        const url = new URL(`http://${server.getAddress()}/api/get-health`);
        let jsonData = JSON.stringify({})
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(jsonData)
          },
          body: jsonData,
        };

        const req = http.request(url, options, (res) => {
          let data = '';

          // A chunk of data has been received.
          res.on('data', (chunk) => {
            data += chunk;
          });

          // The whole response has been received.
          res.on('end', () => {
            try {
              const responseData = JSON.parse(data);
              server.isHealthy = responseData.status === 'ok';
            } catch (error) {
              console.error(`${server.getAddress()} has error \n ${error}` )
              server.isHealthy = false;
            }
          });
        });

        req.on('error', (error) => {
          server.isHealthy = false;
          console.error(`${server.getAddress()} has error \n ${error}` )
        });

        req.write(jsonData);

      } catch (error) {
        server.isHealthy = false;
        console.error(`${server.getAddress()} has error \n ${error}` )
      }
    }
  }
}