import PrismaFullHandler from "@/core/prisma.handler";

export default class ContractManagerRequestHandler extends PrismaFullHandler {
    getModel() {
        return prisma.designRequest;
    }

    getName() {
        return "درخواست طراحی";
    }

    async PUT() {
        const id = this.getTargetId();
        if (!id) this.need("id", "شناسه درخواست وارد نشده است");

        const existing = await prisma.designRequest.findUnique({ where: { id: id as string } });
        if (!existing) this.throw("درخواست یافت نشد");

        const data: any = {};
        const status = this.get("status");
        const answer = this.get("answer");

        if (status) data.status = status;
        if (answer !== undefined) data.answer = answer;

        if (!Object.keys(data).length) this.throw("محتوایی برای ویرایش ارسال نشده است");

        return await prisma.designRequest.update({
            where: { id: id as string },
            data,
        });
    }

    filter(obj: any) {
        if (obj?.user?.phone) {
            obj.user.phone = obj.user.phone() as any;
        }
        return obj;
    }
}
