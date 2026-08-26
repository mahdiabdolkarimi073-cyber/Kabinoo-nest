import RequestHandler from "@/core/request.handler";
import { All, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";

export default class AdminInstallmentsHandler extends RequestHandler {

    @All()
    async list(@Req() req: Request, @Res() res: Response) {
        return this.splitInstance(async function () {
            const now = new Date();

            const orders = await prisma.order.findMany({
                where: { paymentMethod: "INSTALLMENT" },
                include: {
                    user: { select: { id: true, name: true, phone: true } },
                    checks: {
                        select: {
                            id: true,
                            amount: true,
                            checkId: true,
                            start_at: true,
                            expire_at: true,
                            status: true,
                            adminNote: true,
                            image: true,
                        },
                    },
                    payment: { select: { id: true, paid_at: true, price: true } },
                },
                orderBy: { created_at: "desc" },
            });

            const result = orders.map((order) => {
                const checks = order.checks || [];
                const pendingChecks = checks.filter((c) => c.status === "PENDING");
                const lateChecks = pendingChecks.filter((c) => new Date(c.expire_at) < now);
                const totalChecksAmount = checks.reduce((sum, c) => sum + (c.amount || 0), 0);
                const paidChecksAmount = checks
                    .filter((c) => c.status === "APPROVED" || c.status === "PAID")
                    .reduce((sum, c) => sum + (c.amount || 0), 0);

                return {
                    id: order.id,
                    code: order.code,
                    created_at: order.created_at,
                    status: order.status,
                    finalPrice: order.finalPrice,
                    totalPrice: order.totalPrice,
                    paymentMethod: order.paymentMethod,
                    user: order.user ? {
                        ...order.user,
                        phone: (order.user as any).phone?.() ?? order.user.phone,
                    } : null,
                    checksCount: checks.length,
                    pendingCount: pendingChecks.length,
                    lateCount: lateChecks.length,
                    totalChecksAmount,
                    paidChecksAmount,
                    checks,
                };
            });

            return result;
        }, req, res);
    }
}
