import PrismaFullHandler from "@/core/prisma.handler";

export default class SupportChatHandler extends PrismaFullHandler {

    getModel() {
        return prisma.userChat;
    }

    getName() {
        return "مشاوره آنلاین"
    }
}
