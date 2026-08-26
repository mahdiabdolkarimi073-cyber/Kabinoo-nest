import RequestHandler from "@/core/request.handler";
import { All, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";

export default class AdminPaymentsHandler extends RequestHandler {

    @All()
    async list(@Req() req: Request, @Res() res: Response) {
        return this.splitInstance(async function () {
            const page = Number(this.params._page) || 1;
            const take = Number(this.params._take) || 20;
            const skip = (page - 1) * take;

            const where: any = {};
            const status = this.params.status;
            if (status === "PAID") {
                where.paid_at = { not: null };
            } else if (status === "PENDING") {
                where.paid_at = null;
            }

            const [payments, total] = await Promise.all([
                prisma.payment.findMany({
                    where,
                    include: {
                        user: { select: { id: true, name: true, phone: true } },
                        orders: { select: { id: true, code: true, finalPrice: true, status: true } },
                    },
                    orderBy: { created_at: "desc" },
                    skip,
                    take,
                }),
                prisma.payment.count({ where }),
            ]);

            const result = payments.map((p) => ({
                ...p,
                user: p.user ? {
                    ...p.user,
                    phone: (p.user as any).phone?.() ?? p.user.phone,
                } : null,
            }));

            return { data: result, total, page, take };
        }, req, res);
    }
}
