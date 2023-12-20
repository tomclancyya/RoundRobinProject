import http from 'http';
import { ProxyController } from './controllers/proxy-controller.mjs';
import { DynamicWeightedRoundRobinBalancer } from './models/round-robin-balancer.mjs';
import { Timer } from '../Common/timer.mjs';
import { HealthChecker } from './models/health-checker.mjs';
import { ServersUtil } from './models/servers-util.mjs';
import { config } from './config/config.mjs';

// Port for the routing server
const port = 8080;  
// timer as separated class will help to mock tests
let timer = new Timer()

// Create an HTTP routing server
const server = http.createServer((clientReq, clientRes) => {
    ProxyController.handleRequest(clientReq, clientRes, timer, balancer);  
});

// Listen for incoming client requests on the specified port
server.listen(port, () => {
    // TODO: add rate limiter
    console.log(`Proxy server is listening on port ${port}`);
});

// Read servers from command line arguments and create round robin balancer
let servers = ServersUtil.getServersFromCmdParameters(config)
let balancer = new DynamicWeightedRoundRobinBalancer(servers)

// health check for servers
let healthChecker = new HealthChecker(servers)
setInterval(() => {
    healthChecker.performHealthCheck();
  }, config.healthCheckInterval * 1000);
