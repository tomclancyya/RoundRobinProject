import { done, isEqual } from "../../Common/tests/test-assertion.mjs";
import { DynamicWeightedRoundRobinBalancer } from "../models/round-robin-balancer.mjs";
import { ServerItem } from "../models/server-item.mjs";

export const RoundRobinTest = [ 
    "Round Robin test should",
    [
        "should call only 1 server", () => {
            let servers = [{ port: 1 }].map((s) => Object.assign(new ServerItem(3), s))
            let balancer = new DynamicWeightedRoundRobinBalancer(servers, {minWeight: 1, maxWeight: 5})

            // first round
            isEqual(balancer.getNextServer().port, 1)

            // second round
            isEqual(balancer.getNextServer().port, 1)
            return done();
        },

        "should catch exception if 0 servers avaliable", () => {
            let servers = []
            let balancer = new DynamicWeightedRoundRobinBalancer(servers, {minWeight: 1, maxWeight: 5})

            try {
                // first round
                balancer.getNextServer()
            } catch (error) {
                return done();
            }
        },

        "return servers in round robin basic, servers 1,2,3 should be called in order: 1,2,3", () => {
            let servers = [{ port: 1 }, { port: 2 }, { port: 3 }].map((s) => Object.assign(new ServerItem(3), s))
            let balancer = new DynamicWeightedRoundRobinBalancer(servers, {minWeight: 1, maxWeight: 5})

            // first round
            isEqual(balancer.getNextServer().port, 1)
            isEqual(balancer.getNextServer().port, 2)
            isEqual(balancer.getNextServer().port, 3)

            // second round
            isEqual(balancer.getNextServer().port, 1)
            isEqual(balancer.getNextServer().port, 2)
            isEqual(balancer.getNextServer().port, 3)
            return done();
        },

        "return call servers in order 1,1,2,3,3 because server 2 is little slower than other servers", () => {
            /**
             * @type {ServerItem[]]}
             */
            let servers = [{ port: 1 }, { port: 2 }, { port: 3 }].map((s) => Object.assign(new ServerItem(3), s))
            let balancer = new DynamicWeightedRoundRobinBalancer(servers, {minWeight: 1, maxWeight: 5})
            servers[0].addResponseTime(0.1)
            servers[1].addResponseTime(0.15)
            servers[2].addResponseTime(0.1)

            // first round
            isEqual(balancer.getNextServer().port, 1)
            isEqual(balancer.getNextServer().port, 1)
            isEqual(balancer.getNextServer().port, 2)
            isEqual(balancer.getNextServer().port, 3)
            isEqual(balancer.getNextServer().port, 3)
            return done();
        },

        "return call servers in order 1,1,1,1,1,2,3,3,3,3,3 because server 2 is much slower than other servers", () => {
            /**
             * @type {ServerItem[]]}
             */
            let servers = [{ port: 1 }, { port: 2 }, { port: 3 }].map((s) => Object.assign(new ServerItem(3), s))
            let balancer = new DynamicWeightedRoundRobinBalancer(servers, {minWeight: 1, maxWeight: 5})
            servers[0].addResponseTime(0.1)
            servers[1].addResponseTime(1)
            servers[2].addResponseTime(0.1)

            // first round
            isEqual(balancer.getNextServer().port, 1)
            isEqual(balancer.getNextServer().port, 1)
            isEqual(balancer.getNextServer().port, 1)
            isEqual(balancer.getNextServer().port, 1)
            isEqual(balancer.getNextServer().port, 1)
            isEqual(balancer.getNextServer().port, 2)
            isEqual(balancer.getNextServer().port, 3)
            isEqual(balancer.getNextServer().port, 3)
            isEqual(balancer.getNextServer().port, 3)
            isEqual(balancer.getNextServer().port, 3)
            isEqual(balancer.getNextServer().port, 3)
            return done();
        },

        "should call server #2 at 1th and 3rd round only, because at second round it not healthy", () => {
            /**
             * @type {ServerItem[]]}
             */
            let servers = [{ port: 1 }, { port: 2 }, { port: 3 }].map((s) => Object.assign(new ServerItem(3), s))
            let balancer = new DynamicWeightedRoundRobinBalancer(servers, {minWeight: 1, maxWeight: 5})

            // first round
            isEqual(balancer.getNextServer().port, 1)
            isEqual(balancer.getNextServer().port, 2)
            isEqual(balancer.getNextServer().port, 3)

            // second round
            servers[1].isHealthy = false
            isEqual(balancer.getNextServer().port, 1)
            isEqual(balancer.getNextServer().port, 3)

            // third round
            isEqual(balancer.getNextServer().port, 1)
            servers[1].isHealthy = true
            isEqual(balancer.getNextServer().port, 2)
            isEqual(balancer.getNextServer().port, 3)
            return done();
        },

        "should call 2 server less at first round because of slow resp time, \n" +             
        "        and equal distribution calls at the second round due to resp time is same as other servers", () => {
            
            /**
             * @type {ServerItem[]]}
             */
            let servers = [{ port: 1 }, { port: 2 }, { port: 3 }].map((s) => Object.assign(new ServerItem(3), s))
            let balancer = new DynamicWeightedRoundRobinBalancer(servers, {minWeight: 1, maxWeight: 5})
            servers[0].addResponseTime(0.1)
            servers[1].addResponseTime(0.15)
            servers[2].addResponseTime(0.1)

            // first round
            isEqual(balancer.getNextServer().port, 1)
            isEqual(balancer.getNextServer().port, 1)
            isEqual(balancer.getNextServer().port, 2)
            isEqual(balancer.getNextServer().port, 3)
            isEqual(balancer.getNextServer().port, 3)
            
            servers[1].addResponseTime(0.1)
            servers[1].addResponseTime(0.1)
            servers[1].addResponseTime(0.1)

            // second round
            isEqual(balancer.getNextServer().port, 1)
            isEqual(balancer.getNextServer().port, 2)
            isEqual(balancer.getNextServer().port, 3)
            return done();
        },
    ]
]