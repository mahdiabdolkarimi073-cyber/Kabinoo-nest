import { Request, Response } from 'express';
import RequestHandler from "../../core/request.handler";
export default class CatalogZipHandler extends RequestHandler {
    upload(body: any, req: Request, res: Response): Promise<any>;
    DELETE(): Promise<void>;
}
