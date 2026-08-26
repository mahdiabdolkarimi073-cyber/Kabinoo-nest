import PrismaFullHandler from "@/core/prisma.handler";

export default class AdminCheckListHandler extends PrismaFullHandler {

    getModel() {
        return prisma.paymentCheck;
    }

    getName() {
        return "چک";
    }

    enablePagination() {
        return true;
    }

    async GET_findFirst(id: any) {
        const base = await super.GET_findFirst(id);
        if (!id) {
            base.include = {
                ...base.include,
                order: {
                    select: {
                        id: true,
                        code: true,
                        userId: true,
                        user: { select: { id: true, name: true, phone: true } },
                    },
                },
            };
        }
        return base;
    }

    filter(obj: any) {
        if (obj?.order?.user?.phone) {
            obj.order.user.phone = obj.order.user.phone() as any;
        }
        return obj;
    }
}
