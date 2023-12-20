const pm2 = require('pm2');

const numberOfServices = process.argv[2] || 1;

const startPortSimpleAPI = 3000;

const portsSimpleAPI = [];

// create ports like [3000,3001,3002,3003] etc
for (let i = 0; i < numberOfServices; i++) {
  const value = startPortSimpleAPI + i;
  portsSimpleAPI.push(value.toString());
}

let serverList = portsSimpleAPI.map((port) => {
  return `127.0.0.1:${port}`
})

// Start multiple Node.js services
function startServices() {

  // run simple api
  for (let i = 0; i < numberOfServices; i++) {
    const appName = `service-${portsSimpleAPI[i]}`;

    // Define the configuration for each service
    const appConfig = {
      script: '../SimpleAPI/app.mjs',
      name: appName,
      exec_mode: 'cluster',
      instances: 1, // Number of instances (processes) per service,
      args: [portsSimpleAPI[i]],
    };

    // Start the service
    pm2.start(appConfig, (err, apps) => {
      if (err) {
        console.error(`Error starting ${appName}:`, err);
      } else {
        console.log(`${appName} started successfully`);
      }
    });
  }

  // start routing api
  const appName = `routingAPI-8080`;

  // Define the configuration for each service
  const appConfig = {
    script: '../RoutingAPI/app.mjs', // Update with the path to your Node.js application
    name: appName,
    exec_mode: 'cluster', // Run in cluster mode
    instances: 1, // Number of instances (processes) per service,
    args: serverList,
  };

  // Start the service
  pm2.start(appConfig, (err, apps) => {
    if (err) {
      console.error(`Error starting ${appName}:`, err);
    } else {
      console.log(`${appName} started successfully`);
    }
  });
}

// Connect to the PM2 daemon
pm2.connect((err) => {
  
  if (err) {
    console.error('Error connecting to PM2:', err);
    process.exit(2);
  }

  // Start the services
  startServices();

  //pm2.disconnect()
});
// node run-clister.js 3
//./node_modules/pm2/bin/pm2 list
//./node_modules/pm2/bin/pm2 stop all
//./node_modules/pm2/bin/pm2 delete all
//./node_modules/pm2/bin/pm2 delete service-3000
//./node_modules/pm2/bin/pm2 delete routingAPI-8080
//./node_modules/pm2/bin/pm2 monit