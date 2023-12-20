export class Timer {
    constructor() {
    }

    start() {
        this.startTime = process.hrtime();
    }
  
    stop() {
      const endTime = process.hrtime(this.startTime);
      return endTime[0] * 1000 + endTime[1] / 1000000; // in milliseconds
    }
  }