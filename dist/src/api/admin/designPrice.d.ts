import RequestHandler from "../../core/request.handler";
export default class DesignPriceHandler extends RequestHandler {
    GET(): Promise<{
        id: number;
        updatedAt: Date;
        baseMultiplier: number;
        installationCost: number;
        designFee: number;
        defaultDiscount: number;
        minPrice: number;
    }>;
    PUT(): Promise<void>;
}
