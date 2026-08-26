import RequestHandler from "../../core/request.handler";
import { Request, Response } from "express";
export default class AdminSmsHandler extends RequestHandler {
    send(req: Request, res: Response): Promise<any>;
}
