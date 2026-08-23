import PrismaFullHandler from "@/core/prisma.handler";
import { ensureHomepageDefaults } from "@/api/public/homepage";

export default class HomepageHandler extends PrismaFullHandler {
    getModel() {
        return prisma.homepageContent;
    }

    getName() {
        return "محتوای صفحه اصلی";
    }

    async GET(id = this.getTargetId()) {
        await ensureHomepageDefaults();
        return super.GET(id);
    }
}
