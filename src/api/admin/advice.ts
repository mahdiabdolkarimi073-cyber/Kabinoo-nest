import PrismaFullHandler from "@/core/prisma.handler";

export default class AdminAdviceHandler extends PrismaFullHandler {
    getModel() {
        return prisma.userAdvice;
    }

    getName() {
        return "درخواست تماس تلفنی"
    }
    
}