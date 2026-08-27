import PrismaFullHandler from "@/core/prisma.handler";

export default class PublicCounselingHandler extends PrismaFullHandler {
    getModel() {
        return prisma.userCounseling;
    }

    async additionalPayload() {
        if (this.get('phone') && isNaN(+this.get('phone'))) return this.throw("شماره تلفن معتبر نیست");
        const user = await this.getUser();
        return {
            userId: user?.id,
        }
    }

    getName() {
        return "درخواست مشاوره"
    }

    async DELETE() {
        return this.methodDeny();
    }

    async GET() {
        return this.msg("");
    }

    async PUT() {
        return this.methodDeny();
    }
}
