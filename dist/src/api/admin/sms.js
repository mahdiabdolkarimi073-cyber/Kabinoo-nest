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
const sms_1 = require("../../utils/sms");
class AdminSmsHandler extends request_handler_1.default {
    async send(req, res) {
        return this.splitInstance(async function () {
            const userId = this.json.userId;
            const message = this.json.message;
            if (!userId)
                this.throw("کاربر را انتخاب کنید");
            if (!message || !message.trim())
                this.throw("متن پیام را وارد کنید");
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: { id: true, name: true, phone: true },
            });
            if (!user)
                this.throw("کاربر یافت نشد");
            const phone = typeof user.phone === 'function' ? user.phone() : user.phone;
            if (!phone || typeof phone !== 'string')
                this.throw("شماره تلفن کاربر معتبر نیست");
            const ok = await (0, sms_1.sendRawSMS)(phone, message.trim());
            if (!ok)
                this.throw("ارسال پیامک ناموفق بود");
            return { success: true, message: "پیامک ارسال شد" };
        }, req, res);
    }
}
exports.default = AdminSmsHandler;
__decorate([
    (0, common_1.All)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminSmsHandler.prototype, "send", null);
//# sourceMappingURL=sms.js.map