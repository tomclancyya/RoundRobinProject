import { ServerItem } from "./server-item.mjs";

export class DynamicWeightedRoundRobinBalancer {

    /**
     * @type {[ServerItem]}
     */
    servers = []
    /**
     * @type {[ServerItem]}
     */
    roundRobinServersQueue = []
    currentServerIndex = 0

    minWeight = 1
    maxWeight = 5

    /**
     * 
     * @param {[ServerItem]} servers   
     */
    constructor(servers) {
        
      this.servers = servers;
    }

    /**
     * 
     * @param {[ServerItem]} servers 
     * @returns {[ServerItem]}
     */
    createServersQueueBasedOnWeight(servers) {

        let listOfAverageRespTime = this.servers.map((server) => {
            return server.getAverageResponseTime()
        })

        const maxRespTime = Math.max(...listOfAverageRespTime);

        const minRespTime = Math.min(...listOfAverageRespTime);

        function interpolate(minOutput, maxOutput, minInput, maxInput, value) {
          let deltaInput = maxInput - minInput
          if (deltaInput == 0)
            return minOutput;
          else
            return maxOutput - (minOutput + (maxOutput - minOutput) * ((value - minInput) / (maxInput - minInput))) + 1;
        }

        return servers.map((server, index) => {
            let weight = Math.round(interpolate(this.minWeight, this.maxWeight, 0, maxRespTime, server.getAverageResponseTime()))
            server.weight = weight
            return Array(weight).fill(server)
        }).flat()
    }

    getHealthyServersFromQueue() {
      return this.roundRobinServersQueue.filter(server => {
        return server.isHealthy == true
      })
    }

    //TODO: add healthy filter
    /**
     * 
     * @returns {ServerItem}
     */
    getNextServer() {

        if (this.currentServerIndex + 1 >= this.getHealthyServersFromQueue().length) {            
            this.roundRobinServersQueue = this.createServersQueueBasedOnWeight(this.servers)
            this.currentServerIndex = 0
        } else {
            this.currentServerIndex++;
        }

        return this.getHealthyServersFromQueue()[this.currentServerIndex]
    }

    getInfo() {
      return this.servers.map((server) => {
        return server.port + ' w:' + server.weight + ' rt:' + server.getAverageResponseTime().toFixed(2)
      })
    }
  
    updateWeights(server, responseTime) {
      // Update the weight based on the server's response time
      // Adjust this logic based on your specific requirements
      const maxWeight = 10; // Maximum allowed weight to prevent unbounded growth
  
      // Proportional adjustment based on response time
      const adjustmentFactor = 1 / (responseTime + 1);
      this.weights[server] = Math.min(maxWeight, this.weights[server] * adjustmentFactor);
    }
  }