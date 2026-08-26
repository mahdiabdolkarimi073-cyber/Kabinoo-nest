import RequestHandler from "@/core/request.handler";
import { All, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";

export default class AdminStatsHandler extends RequestHandler {

    @All()
    async stats(@Req() req: Request, @Res() res: Response) {
        return this.splitInstance(async function () {
            const now = new Date();
            const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const startOfYear = new Date(now.getFullYear(), 0, 1);

            const [
                totalUsers,
                totalAuthors,
                totalShopManagers,
                totalContractManagers,
                totalSupport,
                totalAdmins,
                totalOrders,
                todayOrders,
                monthOrders,
                yearOrders,
                totalProducts,
                totalContracts,
                activeContracts,
                installmentOrders,
                totalPayments,
                monthPayments,
                yearPayments,
                todayPayments,
                totalChecks,
                pendingChecks,
                lateChecks,
                approvedChecks,
                rejectedChecks,
            ] = await Promise.all([
                prisma.user.count(),
                prisma.user.count({ where: { isAuthor: true } }),
                prisma.user.count({ where: { isShopManager: true } }),
                prisma.user.count({ where: { isContractManager: true } }),
                prisma.user.count({ where: { isSupport: true } }),
                prisma.user.count({ where: { isAdmin: true } }),
                prisma.order.count(),
                prisma.order.count({ where: { created_at: { gte: startOfToday } } }),
                prisma.order.count({ where: { created_at: { gte: startOfMonth } } }),
                prisma.order.count({ where: { created_at: { gte: startOfYear } } }),
                prisma.product.count(),
                prisma.contract.count(),
                prisma.contract.count({ where: { status: "ACTIVE" } }),
                prisma.order.count({ where: { paymentMethod: "INSTALLMENT" } }),
                prisma.payment.aggregate({ _sum: { price: true }, where: { paid_at: { not: null } } }),
                prisma.payment.aggregate({ _sum: { price: true }, where: { paid_at: { gte: startOfMonth } } }),
                prisma.payment.aggregate({ _sum: { price: true }, where: { paid_at: { gte: startOfYear } } }),
                prisma.payment.aggregate({ _sum: { price: true }, where: { paid_at: { gte: startOfToday } } }),
                prisma.paymentCheck.count(),
                prisma.paymentCheck.count({ where: { status: "PENDING" } }),
                prisma.paymentCheck.count({ where: { status: "PENDING", expire_at: { lt: now } } }),
                prisma.paymentCheck.count({ where: { status: "APPROVED" } }),
                prisma.paymentCheck.count({ where: { status: "REJECTED" } }),
            ]);

            const monthNames = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];

            const last6MonthsStart = new Date(now.getFullYear(), now.getMonth() - 5, 1);

            const monthlyOrders = await prisma.order.groupBy({
                by: ["created_at"],
                where: { created_at: { gte: last6MonthsStart } },
                _count: { _all: true },
                _sum: { finalPrice: true },
            });

            const monthlyPayments = await prisma.payment.findMany({
                where: { paid_at: { gte: last6MonthsStart } },
                select: { price: true, paid_at: true },
            });

            const monthlyData: { month: string; orders: number; revenue: number }[] = [];
            for (let i = 5; i >= 0; i--) {
                const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
                const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
                const monthIndex = monthStart.getMonth();
                const ordersInMonth = monthlyOrders.filter(
                    (o) => new Date(o.created_at) >= monthStart && new Date(o.created_at) < monthEnd,
                );
                const orderCount = ordersInMonth.reduce((sum, o) => sum + (o._count?._all || 0), 0);
                const revenue = monthlyPayments
                    .filter((p) => p.paid_at && new Date(p.paid_at) >= monthStart && new Date(p.paid_at) < monthEnd)
                    .reduce((sum, p) => sum + (p.price || 0), 0);
                monthlyData.push({
                    month: monthNames[monthIndex],
                    orders: orderCount,
                    revenue,
                });
            }

            const installmentsByMonth: { month: string; count: number; amount: number }[] = [];
            const allChecks = await prisma.paymentCheck.findMany({
                select: { amount: true, start_at: true, expire_at: true, status: true },
                where: { start_at: { gte: last6MonthsStart } },
            });
            for (let i = 5; i >= 0; i--) {
                const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
                const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
                const monthIndex = monthStart.getMonth();
                const checksInMonth = allChecks.filter(
                    (c) => new Date(c.start_at) >= monthStart && new Date(c.start_at) < monthEnd,
                );
                installmentsByMonth.push({
                    month: monthNames[monthIndex],
                    count: checksInMonth.length,
                    amount: checksInMonth.reduce((sum, c) => sum + (c.amount || 0), 0),
                });
            }

            const lateInstallments = await prisma.paymentCheck.findMany({
                where: { status: "PENDING", expire_at: { lt: now } },
                include: {
                    order: { select: { code: true, user: { select: { name: true, phone: true } } } },
                },
                orderBy: { expire_at: "asc" },
                take: 20,
            });

            const lateInstallmentsFiltered = lateInstallments.map((c) => ({
                ...c,
                order: c.order ? {
                    ...c.order,
                    user: c.order.user ? { ...c.order.user, phone: (c.order.user as any).phone?.() ?? c.order.user.phone } : null,
                } : null,
            }));

            return {
                users: {
                    total: totalUsers,
                    authors: totalAuthors,
                    shopManagers: totalShopManagers,
                    contractManagers: totalContractManagers,
                    support: totalSupport,
                    admins: totalAdmins,
                },
                orders: {
                    total: totalOrders,
                    today: todayOrders,
                    month: monthOrders,
                    year: yearOrders,
                },
                sales: {
                    total: totalPayments._sum.price || 0,
                    today: todayPayments._sum.price || 0,
                    month: monthPayments._sum.price || 0,
                    year: yearPayments._sum.price || 0,
                },
                contracts: {
                    total: totalContracts,
                    active: activeContracts,
                    installmentOrders,
                },
                checks: {
                    total: totalChecks,
                    pending: pendingChecks,
                    late: lateChecks,
                    approved: approvedChecks,
                    rejected: rejectedChecks,
                },
                products: {
                    total: totalProducts,
                },
                monthly: monthlyData,
                installmentsByMonth,
                lateInstallments: lateInstallmentsFiltered,
            };
        }, req, res);
    }
}
