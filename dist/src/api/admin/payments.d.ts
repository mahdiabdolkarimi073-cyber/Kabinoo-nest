import RequestHandler from "../../core/request.handler";
import { Request, Response } from "express";
export default class AdminPaymentsHandler extends RequestHandler {
    list(req: Request, res: Response): Promise<any>;
}
