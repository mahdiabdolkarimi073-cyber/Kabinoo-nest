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
const Payment_1 = require("../../core/payment/Payment");
const sms_1 = require("../../utils/sms");
class UserCheckHandler extends request_handler_1.default {
    async pay(req, res) {
        return this.splitInstance(async function () {
            const user = await this.getUser(true);
            const checkId = Number(this.get("id") || this.json["id"]) || this.throw("شناسه چک وارد نشده است");
            const check = await prisma.paymentCheck.findUnique({
                where: { id: checkId },
                include: { order: true },
            }) || this.throw("چک یافت نشد");
            if (check.order.userId !== user.id)
                this.throw("این چک متعلق به شما نیست");
            if (check.status === "PAID")
                this.throw("این چک قبلا پرداخت شده است");
            if (check.status === "REJECTED")
                this.throw("این چک رد شده است");
            const payment = await prisma.payment.create({
                data: {
                    price: check.amount,
                    userId: user.id,
                    redirect: "/user/order/" + check.order.id,
                },
            });
            const link = await (0, Payment_1.getPaymentLink)(payment);
            (0, Payment_1.onPaymentSuccessful)(payment, async () => {
                await prisma.paymentCheck.update({
                    where: { id: checkId },
                    data: {
                        status: "PAID",
                        paymentId: payment.id,
                    },
                });
                await (0, sms_1.notifyUserSMS)(user.id, 'check-paid', [
                    { name: 'code', value: String(check.order.code) },
                    { name: 'price', value: check.amount.toLocaleString('fa') },
                ]);
            });
            return { link, payment };
        }, req, res);
    }
}
exports.default = UserCheckHandler;
__decorate([
    (0, common_1.Post)("pay"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserCheckHandler.prototype, "pay", null);
//# sourceMappingURL=check.js.map