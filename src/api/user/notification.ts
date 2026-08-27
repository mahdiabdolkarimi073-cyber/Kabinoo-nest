import RequestHandler from "@/core/request.handler";

export default class UserNotificationHandler extends RequestHandler {

    async GET() {
        const user = await this.getUser(true);
        const id = this.get("id");

        if (id) {
            return await prisma.userNotification.findFirst({
                where: {
                    id: id as string,
                    userId: user.id,
                },
            }) || this.throw("اطلاعیه یافت نشد");
        }

        return await prisma.userNotification.findMany({
            where: {
                userId: user.id,
            },
            orderBy: {
                created_at: "desc",
            },
        });
    }

    async PUT() {
        const user = await this.getUser(true);
        const id = this.get("id", "شناسه اطلاعیه وارد نشده است");

        const existing = await prisma.userNotification.findFirst({
            where: {
                id: id as string,
                userId: user.id,
            },
        });
        if (!existing) this.throw("اطلاعیه یافت نشد");

        return await prisma.userNotification.update({
            where: { id: id as string },
            data: { read: true },
        });
    }

    async DELETE() {
        const user = await this.getUser(true);
        const id = this.get("id", "شناسه اطلاعیه وارد نشده است");

        const existing = await prisma.userNotification.findFirst({
            where: {
                id: id as string,
                userId: user.id,
            },
        });
        if (!existing) this.throw("اطلاعیه یافت نشد");

        await prisma.userNotification.delete({
            where: { id: id as string },
        });

        return this.msg("اطلاعیه حذف شد");
    }
}
