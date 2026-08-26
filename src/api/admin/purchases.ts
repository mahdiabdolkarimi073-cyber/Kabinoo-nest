import RequestHandler from "@/core/request.handler";
import { All, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";

export default class AdminPurchasesHandler extends RequestHandler {

    @All()
    async list(@Req() req: Request, @Res() res: Response) {
        return this.splitInstance(async function () {
            const page = Number(this.query._page) || 1;
            const take = Number(this.query._take) || 20;
            const skip = (page - 1) * take;

            const where: any = {};
            const productId = this.query.productId;
            if (productId) where.productId = productId;

            const [items, total] = await Promise.all([
                prisma.orderProduct.findMany({
                    where,
                    include: {
                        order: {
                            select: {
                                id: true,
                                code: true,
                                created_at: true,
                                status: true,
                                finalPrice: true,
                                user: { select: { id: true, name: true, phone: true } },
                            },
                        },
                        product: {
                            select: { id: true, name: true, price: true, finalPrice: true, images: true },
                        },
                        custom: {
                            select: { id: true, name: true, price: true, image: true },
                        },
                    },
                    orderBy: { order: { created_at: "desc" } },
                    skip,
                    take,
                }),
                prisma.orderProduct.count({ where }),
            ]);

            const result = items.map((item) => ({
                ...item,
                order: item.order ? {
                    ...item.order,
                    user: item.order.user ? {
                        ...item.order.user,
                        phone: (item.order.user as any).phone?.() ?? item.order.user.phone,
                    } : null,
                } : null,
            }));

            return { data: result, total, page, take };
        }, req, res);
    }
}
