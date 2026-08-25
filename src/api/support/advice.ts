import PrismaFullHandler from "@/core/prisma.handler";

export default class SupportAdviceHandler extends PrismaFullHandler {
    getModel() {
        return prisma.userAdvice;
    }

    getName() {
        return "درخواست تماس تلفنی"
    }
}
