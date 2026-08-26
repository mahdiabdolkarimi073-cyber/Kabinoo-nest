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
class AdminPurchasesHandler extends request_handler_1.default {
    async list(req, res) {
        return this.splitInstance(async function () {
            const page = Number(this.params._page) || 1;
            const take = Number(this.params._take) || 20;
            const skip = (page - 1) * take;
            const where = {};
            const productId = this.params.productId;
            if (productId)
                where.productId = productId;
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
                        phone: item.order.user.phone?.() ?? item.order.user.phone,
                    } : null,
                } : null,
            }));
            return { data: result, total, page, take };
        }, req, res);
    }
}
exports.default = AdminPurchasesHandler;
__decorate([
    (0, common_1.All)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminPurchasesHandler.prototype, "list", null);
//# sourceMappingURL=purchases.js.map