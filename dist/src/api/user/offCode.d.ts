import RequestHandler from "../../core/request.handler";
export default class OffCodeHandler extends RequestHandler {
    GET(): Promise<{
        type: import(".prisma/client").$Enums.OffCodeType;
        id: string;
        userId: string | null;
        percent: number;
        amount: number;
        cashOnly: boolean;
        used: number;
        maxUsage: number | null;
    }>;
}
export declare function getValidOffCode(userId: string, code: string, paymentMethod?: string): Promise<{
    type: import(".prisma/client").$Enums.OffCodeType;
    id: string;
    userId: string | null;
    percent: number;
    amount: number;
    cashOnly: boolean;
    used: number;
    maxUsage: number | null;
}>;
export declare function calculateDiscount(totalPrice: number, offCode: any): number;
