import { GetPointsRequest } from "../models/get-points-request.mjs";
import { ApiController } from "../../Common/api-controller.mjs";


export class GetPointsController {
    static handleRequest(req, res) {
        let apiController = new ApiController()

        apiController.onReceivedRequestData = 
        /**
         * @param {GetPointsRequest} request 
         */
        (request) => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(request));
        }

        apiController.handlePostRequest(req, res);
    }

}