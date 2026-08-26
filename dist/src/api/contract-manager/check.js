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
Object.defineProperty(exports, "__esModule", { value: true });
const request_handler_1 = require("../../core/request.handler");
const common_1 = require("@nestjs/common");
const sms_1 = require("../../utils/sms");
class ContractManagerCheckHandler extends request_handler_1.default {
    async update() {
        const id = Number(this.json.id);
        const status = this.json.status === "APPROVED" || this.json.status === "REJECTED"
            ? this.json.status
            : this.throw("وضعیت چک نامعتبر است");
        const check = await prisma.paymentCheck.findUnique({
            where: { id },
            include: { order: { select: { userId: true, code: true } } },
        });
        if (!check)
            this.throw("چک یافت نشد");
        await prisma.paymentCheck.update({
            where: { id },
            data: {
                status,
                adminNote: typeof this.json.adminNote === "string" ? this.json.adminNote.trim() || null : undefined,
            },
        });
        if (check.order?.userId) {
            await (0, sms_1.notifyUserSMS)(check.order.userId, 'order-status', [
                { name: 'code', value: String(check.order.code) },
                { name: 'status', value: status === "APPROVED" ? "تایید چک" : "رد چک" },
            ]);
        }
        return this.msg(status === "APPROVED" ? "چک تایید شد" : "چک رد شد");
    }
}
exports.default = ContractManagerCheckHandler;
__decorate([
    (0, common_1.Put)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ContractManagerCheckHandler.prototype, "update", null);
//# sourceMappingURL=check.js.map