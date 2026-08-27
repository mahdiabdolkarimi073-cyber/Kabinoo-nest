import PrismaFullHandler from "@/core/prisma.handler";

export default class AdminUsersHandler extends PrismaFullHandler {

    getModel() {
        return prisma.user;
    }

    getName() {
        return "کاربر "
    }

}