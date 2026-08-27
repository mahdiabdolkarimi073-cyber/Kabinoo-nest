import PrismaFullHandler from "@/core/prisma.handler";

export default class AdminCounselingHandler extends PrismaFullHandler {
    getModel() {
        return prisma.userCounseling;
    }

    getName() {
        return "درخواست مشاوره";
    }

    async GET_findFirst(id: any) {
        const base = await super.GET_findFirst(id);
        if (id) {
            base.include = {
                ...base.include,
                user: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                    },
                },
            };
        }
        return base;
    }

    async PUT() {
        const id = this.getTargetId();
        if (!id) this.need("id", "شناسه درخواست وارد نشده است");

        const existing = await prisma.userCounseling.findUnique({ where: { id: id as string } });
        if (!existing) this.throw("درخواست یافت نشد");

        const data: any = {};
        const status = this.get("status");
        if (status) data.status = status;

        if (!Object.keys(data).length) this.throw("محتوایی برای ویرایش ارسال نشده است");

        return await prisma.userCounseling.update({
            where: { id: id as string },
            data,
        });
    }
}
