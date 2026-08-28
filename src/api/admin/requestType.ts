import PrismaFullHandler from "@/core/prisma.handler";

export default class RequestTypeHandler extends PrismaFullHandler {
    getModel() {
        return prisma.requestType;
    }

    getName() {
        return "نوع درخواست طراحی"
    }
}
