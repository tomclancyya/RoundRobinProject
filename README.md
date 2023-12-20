## GOAL

This project aims to demonstrate the implementation of Dynamic Weighted Round Robin.

Round Robin (RR) involves calling servers in a predetermined order. 
The weight assigned to each server influences its call frequency. 
In each round, the RR module sets up a schedule based on the list of servers.

For instance, consider servers A, B, and C with weights 1, 2, and 1, respectively. 
In one round, the sequence of servers called would be A, B, B, C. 
If the weights remain unchanged, the next round will follow the same sequence.

### How would round robin API handle it if one of the application APIs goes down?

If one of the application APIs goes down, the RoutingAPI application employs a health-check mechanism. 
This mechanism assesses the health of destination servers every 5 seconds (the default time for the AMS health check scheduler). 
If a service is detected as unhealthy during this check, the application marks it as such. 
In the Round Robin (RR) process, any unhealthy service is excluded from selection, ensuring that only healthy services are considered in the rotation.

### How would round robin API handle it if one of the application APIs starts to go slowly?
If one of the application APIs experiences a slowdown, the RoutingAPI application employs a response time tracking mechanism. 
Specifically, it stores the last three response times for each destination service. 
During the creation of the Round Robin (RR) schedule, the application calculates the average response time for each service. The calculated average response times are then used to determine weights through interpolation.

As an example, suppose Server A has a response time of 1 second, and Server B has a response time of 2 seconds. 
In this case, Server A would be assigned a weight of 2, and Server B would be assigned a weight of 1. 
The weight signifies the number of calls allocated to each service in every RR round, with higher weights indicating a more frequent selection in the rotation.

### Testing the Application

To test this application, there are functional tests available with various scenarios, including:

- A scenario where a service experiences a slowdown.
- A scenario where a service becomes unhealthy.
- A scenario illustrating the order of services for the Round Robin (RR).

These tests are located in the file:

`RoutingAPI/tests/round-robin-balancer-test.mjs`

Additionally, there are tools for manual testing of the Round Robin, which may be automated in the future. The tool is located here:

`MeshTool/run-cluster.js`

The MeshTool facilitates the running of multiple SimpleApi instances and a single RoutingAPI instance. It wires the ports of SimpleApi to the server list of RoutingAPI. Calls can be made using tools like Postman with the following request:

```plaintext
POST http://127.0.0.1:8080/api/get-points 
{"game":"Mobile Legends", "gamerID":"GYUTDTE", "points":20}
```

In the response, headers contain valuable debug information, such as:

```plaintext
routed-to-server-id: 3002
servers-info: 3000 w:1 rt:13.52
servers-info: 3001 w:2 rt:6.60
```

Where `routed-to-server-id` describes the port handling the request, and `servers-info` includes information about the port, its weight (`w`), and response time (`rt`).

