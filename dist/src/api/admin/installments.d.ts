import RequestHandler from "../../core/request.handler";
import { Request, Response } from "express";
export default class AdminInstallmentsHandler extends RequestHandler {
    list(req: Request, res: Response): Promise<any>;
}
