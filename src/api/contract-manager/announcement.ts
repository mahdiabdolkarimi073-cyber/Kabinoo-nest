import PrismaFullHandler from "@/core/prisma.handler";

export default class ContractManagerAnnouncementHandler extends PrismaFullHandler {

    getModel() {
        return prisma.announcement;
    }

    getName() {
        return "اعلان";
    }

    async additionalPayload() {
        const user = await this.getUser();
        return {
            authorId: user?.id,
        };
    }

    canCreate() {
        return true;
    }

    canEdit() {
        return true;
    }
}
