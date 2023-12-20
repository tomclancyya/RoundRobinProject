import { ApiResponse } from '../SimpleAPI/models/api-response.mjs';

export class ApiController {

  /**
   * 
   * @param {Object} data 
   */
  onReceivedRequestData = (data) => {
      
  }

  handlePostRequest(req, res) {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const requestData = JSON.parse(body);
        this.onReceivedRequestData(requestData);
      } catch (error) {
        console.error(error)
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON payload' + error }));
      }
    });
  }
}
