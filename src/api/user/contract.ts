import PrismaLimitHandler from '@/core/prisma.limited.handler';

export default class UserContractHandler extends PrismaLimitHandler {

    async additionalPayload(): Promise<Record<any, any>> {
        return {
            userId: (await this.getUser()).id
        }
    }

    getModel() {
        return prisma.contract;
    }

    getName() {
        return "قرارداد";
    }

    async GET() {
        const user = await this.getUser(true);
        const id = this.getTargetId();

        if (id) {
            return await prisma.contract.findFirst({
                where: {
                    id: id as string,
                    userId: user.id,
                },
            }) || this.throw("قرارداد یافت نشد");
        }

        return await prisma.contract.findMany({
            where: {
                userId: user.id,
            },
            orderBy: {
                created_at: "desc",
            },
        });
    }
}
