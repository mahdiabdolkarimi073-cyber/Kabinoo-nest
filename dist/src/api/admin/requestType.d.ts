import PrismaFullHandler from "../../core/prisma.handler";
export default class RequestTypeHandler extends PrismaFullHandler {
    getModel(): any;
    getName(): string;
}
