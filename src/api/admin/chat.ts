import PrismaFullHandler from "@/core/prisma.handler";

export default class AdminChatHandler extends PrismaFullHandler {

    getModel() {
        return prisma.userChat;
    }

    getName() {
        return "مشاوره آنلاین"
    }
}