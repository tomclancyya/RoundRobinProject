export class ApiResponse {
    constructor(status, data) {
      this.status = status;
      this.data = data;
    }
  
    toJSON() {
      return JSON.stringify({
        status: this.status,
        data: this.data,
      });
    }
}