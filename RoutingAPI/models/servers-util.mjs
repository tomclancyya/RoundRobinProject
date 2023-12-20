import { ServerItem } from "./server-item.mjs";
import { config } from '../config/config.mjs';

export class ServersUtil {
    /**
     * 
     * @param {config} config 
     * @returns 
     */
    static getServersFromCmdParameters(config) {
        const commandLineServers = process.argv.slice(2);
        let servers = commandLineServers.map((server) => {
            let serverInfo = server.split(':')
            let serverItem = new ServerItem(config.maxLogResponseTime)
            serverItem.hostName = serverInfo[0]
            serverItem.port = serverInfo[1]
            return serverItem
        })        
        if (servers.length == 0)
            throw "please set servers for routing, for example 127.0.0.1:3000"

        return servers;
    }
}