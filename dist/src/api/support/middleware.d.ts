import { NestMiddleware } from "@nestjs/common";
import { Response, Request } from 'express';
export default class SupportMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: (error?: any) => void): Promise<void>;
}
