## GOAL

This project aims to demonstrate the implementation of Dynamic Weighted Round Robin.

Round Robin (RR) involves calling servers in a predetermined order. 
The weight assigned to each server influences its call frequency. 
In each round, the RR module sets up a schedule based on the list of servers.

For instance, consider servers A, B, and C with weights 1, 2, and 1, respectively. 
In one round, the sequence of servers called would be A, B, B, C. 
If the weights remain unchanged, the next round will follow the same sequence.

### How would my round robin API handle it if one of the application APIs goes down?

If one of the application APIs goes down, the RoutingAPI application employs a health-check mechanism. 
This mechanism assesses the health of destination servers every 5 seconds (the default time for the AMS health check scheduler). 
If a service is detected as unhealthy during this check, the application marks it as such. 
In the Round Robin (RR) process, any unhealthy service is excluded from selection, ensuring that only healthy services are considered in the rotation.
