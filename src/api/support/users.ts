import PrismaFullHandler from "@/core/prisma.handler";

export default class SupportUsersHandler extends PrismaFullHandler {

    getModel() {
        return prisma.user;
    }

    getName() {
        return "کاربر "
    }

    async beforeEdit(fields: any) {
        delete fields.isAdmin;
        delete fields.isShopManager;
        delete fields.isSupport;
        delete fields.isAuthor;
        delete fields.refCode;
        delete fields.token;
        return fields;
    }
}
