import PrismaFullHandler from "@/core/prisma.handler";

export default class SupportCommentHandler extends PrismaFullHandler {
    getModel() {
        return prisma.productComment;
    }

    getName(): string {
        return "نظر";
    }
}
