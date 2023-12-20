// max qeueue of request in server
export const config = {
    // check health of servers every {healthCheckInterval} seconds
    healthCheckInterval: 5,

    // how many response time logs should store for every server
    maxLogResponseTime: 3,

    // RR settings, more weight == more calls for server per round
    minWeight: 1,
    maxWeight: 3
}