import { PrismaType } from "@/core/db";
import PrismaFullHandler from "@/core/prisma.handler";

export default class ContractManagerUsersHandler extends PrismaFullHandler {

    getModel() {
        return prisma.user;
    }

    getName() {
        return "کاربر";
    }

    async PUT() {
        const id = this.getTargetId();
        if (!id) this.need("id", "شناسه کاربر وارد نشده است");

        const existing = await prisma.user.findUnique({ where: { id: id as string } });
        if (!existing) this.throw("کاربر یافت نشد");

        const data: any = {};
        const name = this.get("name");
        const email = this.get("email");
        const nationalCode = this.get("nationalCode");

        if (name) data.name = name;
        if (email !== undefined) data.email = email;
        if (nationalCode !== undefined) data.nationalCode = nationalCode;

        if (!Object.keys(data).length) this.throw("محتوایی برای ویرایش ارسال نشده است");

        return await prisma.user.update({
            where: { id: id as string },
            data,
        });
    }

    filter(obj: PrismaType<'user'>) {
        obj.phone = obj.phone() as any;
        return obj;
    }
}
