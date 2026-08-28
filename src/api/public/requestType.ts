import PrismaLimitHandler from "@/core/prisma.limited.handler";

export default class RequestTypeHandler extends PrismaLimitHandler {
    getModel() {
        return prisma.requestType;
    }

    getName() {
        return "نوع درخواست طراحی"
    }

    enableQueryFilter() {
        return true;
    }
}
