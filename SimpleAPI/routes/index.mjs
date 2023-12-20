import { GetHealthController } from '../controllers/get-health-controller.mjs';
import { GetPointsController } from '../controllers/get-points-controller.mjs';

export const routes = {
  '/api/get-points':  GetPointsController.handleRequest,
  '/api/get-health':  GetHealthController.handleRequest,
};
