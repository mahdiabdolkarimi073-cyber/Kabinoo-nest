"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_handler_1 = require("../../core/request.handler");
const common_1 = require("@nestjs/common");
class AdminInstallmentsHandler extends request_handler_1.default {
    async list(req, res) {
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
                        phone: order.user.phone?.() ?? order.user.phone,
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
exports.default = AdminInstallmentsHandler;
__decorate([
    (0, common_1.All)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminInstallmentsHandler.prototype, "list", null);
//# sourceMappingURL=installments.js.map