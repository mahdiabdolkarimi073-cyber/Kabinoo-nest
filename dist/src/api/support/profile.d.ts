import RequestHandler from "../../core/request.handler";
import { Request, Response } from "express";
export default class SupportProfileHandler extends RequestHandler {
    GET(): Promise<{
        id: string;
        name: string;
        phone: string;
        email: string;
        nationalCode: string;
        isSupport: boolean;
        isAdmin: boolean;
    }>;
    PUT(): Promise<void>;
    changePassword(req: Request, res: Response): Promise<void>;
}
