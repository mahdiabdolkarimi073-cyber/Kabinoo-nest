import PrismaFullHandler from "@/core/prisma.handler";
import { PrismaType } from "@/core/db";
import { hashPassword } from "@/utils/password";
import { finalizeUserPhone } from "@api/auth/index";

export default class AdminAuthorHandler extends PrismaFullHandler {
    getModel() {
        return prisma.user;
    }

    getName() {
        return "نویسنده";
    }

    enableQueryFilter() {
        return true;
    }

    async GET_findFirst(id: any) {
        const base = await super.GET_findFirst(id);
        if (id) {
            base.where = {
                ...base.where,
                isAuthor: true,
            };
        } else {
            base.where = {
                ...base.where,
                isAuthor: true,
            };
        }
        return base;
    }

    filter(obj: PrismaType<'user'>) {
        return {
            id: obj.id,
            name: obj.name,
            email: obj.email,
            nationalCode: obj.nationalCode,
            phone: obj.phone,
            joined_at: obj.joined_at,
            isAdmin: obj.isAdmin,
            isAuthor: obj.isAuthor,
        };
    }

    async beforeCreate(fields: any) {
        return {
            ...fields,
            phone: finalizeUserPhone(fields.phone),
            password: await hashPassword(fields.password),
            isAuthor: true,
        };
    }

    async beforeEdit(fields: any) {
        const filtered = { ...fields };
        delete filtered.password;
        delete filtered.token;
        delete filtered.isAdmin;
        return filtered;
    }
}
