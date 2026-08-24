import PrismaFullHandler from "@/core/prisma.handler";

export default class AdminFaqHandler extends PrismaFullHandler {
    getModel() {
        return prisma.faq;
    }

    getName() {
        return "سوال متداول";
    }
}
