import PrismaFullHandler from "@/core/prisma.handler";

export default class ShopManagerProductHandler extends PrismaFullHandler {
    getModel() {
        return prisma.product;
    }

    getName(): string {
        return "محصول";
    }
}
