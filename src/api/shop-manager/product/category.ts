import PrismaFullHandler from "@/core/prisma.handler";

export default class ShopManagerCategoryHandler extends PrismaFullHandler {
    getModel() {
        return prisma.category;
    }

    getName(): string {
        return "دسته بندی";
    }
}
