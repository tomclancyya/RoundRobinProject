import { ServerItem } from "./server-item.mjs";
import { config } from '../config/config.mjs';

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

    minWeight = null
    maxWeight = null

    /**
     * 
     * @param {[ServerItem]} servers   
     * @param {config} config
     */
    constructor(servers, config) {        
      this.servers = servers;
      this.minWeight = config.minWeight;
      this.maxWeight = config.maxWeight;
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

      if (this.getHealthyServersFromQueue().length == 0)
        throw "cannot find avaliable servers"

      return this.getHealthyServersFromQueue()[this.currentServerIndex]
    }

    getInfo() {
      return this.servers.map((server) => {
        return server.port + ' w:' + server.weight + ' rt:' + server.getAverageResponseTime().toFixed(2)
      })
    }
  }