import PrismaFullHandler from "@/core/prisma.handler";

export default class PublicFaqHandler extends PrismaFullHandler {
    getModel() {
        return prisma.faq;
    }

    getName() {
        return "سوال متداول";
    }

    async POST() {
        return this.methodDeny();
    }

    async PUT() {
        return this.methodDeny();
    }

    async DELETE() {
        return this.methodDeny();
    }
}
