import { GetPointsRequest } from "../models/get-points-request.mjs";
import { ApiController } from "../../Common/api-controller.mjs";


export class GetHealthController {
    static handleRequest(req, res) {
        let apiController = new ApiController()

        apiController.onReceivedRequestData = 
        /**
         * @param {*} request 
         */
        (request) => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: "ok"}));
        }

        apiController.handlePostRequest(req, res);
    }

}