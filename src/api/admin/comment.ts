import PrismaFullHandler from "@/core/prisma.handler";

export default class CommentHandler extends PrismaFullHandler {
    getModel() {
        return prisma.productComment;
    }

    getName(): string {
        return "نظر";
    }
}
