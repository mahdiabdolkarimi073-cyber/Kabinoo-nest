import PrismaLimitHandler from '@/core/prisma.limited.handler';

export default class UserContractFileHandler extends PrismaLimitHandler {

    getModel() {
        return prisma.userFile;
    }

    getName() {
        return "فایل";
    }

    async GET() {
        const user = await this.getUser(true);
        const id = this.getTargetId();

        if (id) {
            return await prisma.userFile.findFirst({
                where: {
                    id: id as string,
                    userId: user.id,
                },
            }) || this.throw("فایل یافت نشد");
        }

        return await prisma.userFile.findMany({
            where: {
                userId: user.id,
            },
            orderBy: {
                created_at: "desc",
            },
        });
    }
}
