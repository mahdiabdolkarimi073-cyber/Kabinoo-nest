import PrismaFullHandler from "@/core/prisma.handler";

export default class UserCardItem extends PrismaFullHandler {

    getModel() {
        return prisma.cartItem;
    }

    getName() {
        return "محصول سبد خرید"
    }

    async additionalPayload() {
        return {
            userId: (await this.getUser(true)).id
        }
    }

    async beforeCreate(fields: any) {
        const quantity = Number(fields.quantity || 1);
        if (!Number.isInteger(quantity) || quantity < 1) this.need('quantity', 'تعداد باید حداقل یک باشد');
        return {
            ...fields,
            quantity,
        };
    }

    async POST() {
        const user = await this.getUser(true);
        const productId = this.json?.productId;
        const customDesignId = this.json?.customDesignId;
        const quantity = Number(this.json?.quantity || 1);
        const existing = await prisma.cartItem.findFirst({
            where: {
                userId: user.id,
                ...(productId ? { productId } : { customDesignId }),
            },
        });

        if (existing) {
            if (!Number.isInteger(quantity) || quantity < 1) this.need('quantity', 'تعداد باید حداقل یک باشد');
            await prisma.cartItem.update({
                where: { id: existing.id },
                data: { quantity: existing.quantity + quantity },
            });
            this.json.id = existing.id;
            return this.GET();
        }

        return super.POST();
    }

}