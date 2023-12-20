import http from 'http';
import url from 'url';
import { routes } from './routes/index.mjs';

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const routeHandler = routes[parsedUrl.pathname];

  if (routeHandler) {
    routeHandler(req, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});

const port = process.argv[2] || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});