import PrismaLimitHandler from "../../core/prisma.limited.handler";
export default class RequestTypeHandler extends PrismaLimitHandler {
    getModel(): any;
    getName(): string;
    enableQueryFilter(): boolean;
}
