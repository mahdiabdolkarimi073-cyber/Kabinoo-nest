import PrismaFullHandler from "@/core/prisma.handler";

export default class AdminNotificationHandler extends PrismaFullHandler {
    getModel() {
        return prisma.userNotification;
    }

    getName() {
        return "اطلاعیه";
    }

    isFullAccess() {
        return true;
    }

    async additionalPayload() {
        return {};
    }

    filter(obj: any) {
        return obj;
    }
}
