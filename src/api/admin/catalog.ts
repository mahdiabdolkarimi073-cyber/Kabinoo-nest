import PrismaFullHandler from "@/core/prisma.handler";

export default class CatalogHandler extends PrismaFullHandler {
    getModel() {
        return prisma.catalog;
    }

    getName(): string {
        return "کاتالوگ";
    }
}
