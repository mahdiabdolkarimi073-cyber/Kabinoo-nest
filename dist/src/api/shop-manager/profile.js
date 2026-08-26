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
const password_1 = require("../../utils/password");
const common_1 = require("@nestjs/common");
class ShopManagerProfileHandler extends request_handler_1.default {
    async GET() {
        const user = await this.getUser();
        if (!user)
            this.throw({ code: 401, message: "باید وارد شوید" });
        return {
            id: user.id,
            name: user.name,
            phone: user.phone(),
            email: user.email,
            nationalCode: user.nationalCode,
            isShopManager: user.isShopManager,
            isAdmin: user.isAdmin,
        };
    }
    async PUT() {
        const user = await this.getUser();
        if (!user)
            this.throw({ code: 401, message: "باید وارد شوید" });
        const name = this.get("name");
        const email = this.get("email");
        const nationalCode = this.get("nationalCode");
        const data = {};
        if (name)
            data.name = name;
        if (email !== undefined)
            data.email = email;
        if (nationalCode !== undefined)
            data.nationalCode = nationalCode;
        await prisma.user.update({
            where: { id: user.id },
            data,
        });
        return this.msg("اطلاعات با موفقیت ویرایش شد");
    }
    async changePassword(req, res) {
        this.splitInstance(async function () {
            const user = await this.getUser();
            const verify = await (0, password_1.verifyPassword)(this.get("current", "پسورد فعلی وارد نشده"), user.password());
            if (!verify)
                this.throw("رمزعبور فعلی اشتباه است");
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    password: await (0, password_1.hashPassword)(this.get("new", "رمزعبور جدید وارد نشده")),
                },
            });
            return this.msg("رمز عبور تغییر کرد");
        }, req, res);
    }
}
exports.default = ShopManagerProfileHandler;
__decorate([
    (0, common_1.Post)("password"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ShopManagerProfileHandler.prototype, "changePassword", null);
//# sourceMappingURL=profile.js.map