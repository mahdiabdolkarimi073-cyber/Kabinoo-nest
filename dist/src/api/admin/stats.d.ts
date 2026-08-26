import RequestHandler from "../../core/request.handler";
import { Request, Response } from "express";
export default class AdminStatsHandler extends RequestHandler {
    stats(req: Request, res: Response): Promise<any>;
}
