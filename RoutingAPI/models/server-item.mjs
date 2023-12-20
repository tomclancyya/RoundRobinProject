export class ServerItem {
    hostName = "localhost"
    port = null
    /**
     * @type {number}
     */
    responseTimeList = []
    averageResponseTime = 0
    weight = 1
    isHealthy = true

    constructor(maxLogResponseTime){
        this.maxLogResponseTime = maxLogResponseTime
    }

    getAddress(){
        return `${this.hostName}:${this.port}`
    }

    addResponseTime(responseTime) {
        this.responseTimeList.push(responseTime)
        if (this.responseTimeList.length > this.maxLogResponseTime)
            this.responseTimeList.shift()
    }

    getAverageResponseTime() {
        if (this.responseTimeList.length === 0) {
          return 0;
        }
      
        const sum = this.responseTimeList.reduce((acc, value) => acc + value, 0);
        return sum / this.responseTimeList.length;
    }
}