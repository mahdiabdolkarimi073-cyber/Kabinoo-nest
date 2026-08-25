import { PrismaType } from "@/core/db";
import PrismaFullHandler from "@/core/prisma.handler";

export default class SupportUsersHandler extends PrismaFullHandler {

    getModel() {
        return prisma.user;
    }

    getName() {
        return "کاربر "
    }

    filter(obj: PrismaType<'user'>) {
        obj.phone = obj.phone() as any;
        return obj;
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
