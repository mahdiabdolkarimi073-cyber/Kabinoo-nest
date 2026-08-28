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
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const prisma_handler_1 = require("../../core/prisma.handler");
const upload_1 = require("../user/upload");
const sms_1 = require("../../utils/sms");
class AdminContractHandler extends prisma_handler_1.default {
    getModel() {
        return prisma.contract;
    }
    getName() {
        return "قرارداد";
    }
    async upload(body, req, res) {
        return this.splitInstance(async function () {
            const _file = body?.['file']?.[0] || this.throw("فایل قرارداد ارسال نشده است");
            const name = _file.originalname;
            const buffer = _file.buffer;
            const file = new File([buffer], name);
            const title = this.get("title", "عنوان قرارداد وارد نشده است");
            const description = this.get("description") || "";
            const userId = this.get("userId") || null;
            const expire_at = this.get("expire_at") || null;
            const status = this.get("status") || "DRAFT";
            const finalPrice = +this.get("finalPrice") || 0;
            const fileName = `contract-${Date.now()}.$EX`;
            const filePath = await (0, upload_1.updateFile)(file, "unknown", fileName);
            let designFilePath = "";
            const _designFile = body?.['designFile']?.[0];
            if (_designFile) {
                const designBuffer = _designFile.buffer;
                const designFileObj = new File([designBuffer], _designFile.originalname);
                const designFileName = `contract-design-${Date.now()}.$EX`;
                designFilePath = await (0, upload_1.updateFile)(designFileObj, "unknown", designFileName);
            }
            const contract = await prisma.contract.create({
                data: {
                    title,
                    description,
                    file: filePath,
                    designFile: designFilePath,
                    finalPrice,
                    userId: userId || null,
                    expire_at: expire_at ? new Date(expire_at) : null,
                    status: status,
                },
            });
            if (userId) {
                await (0, sms_1.notifyUserSMS)(userId, 'contract-uploaded', [
                    { name: 'title', value: title },
                ]);
            }
            return contract;
        }, req, res);
    }
    async uploadDesign(body, req, res) {
        return this.splitInstance(async function () {
            const id = this.get("id", "شناسه قرارداد وارد نشده است");
            const _file = body?.['designFile']?.[0] || this.throw("فایل طراحی ارسال نشده است");
            const existing = await prisma.contract.findUnique({ where: { id: id } });
            if (!existing)
                this.throw("قرارداد یافت نشد");
            const buffer = _file.buffer;
            const file = new File([buffer], _file.originalname);
            const fileName = `contract-design-${Date.now()}.$EX`;
            const filePath = await (0, upload_1.updateFile)(file, existing.designFile || "unknown", fileName);
            await prisma.contract.update({
                where: { id: id },
                data: { designFile: filePath },
            });
            if (existing.userId) {
                await (0, sms_1.notifyUserSMS)(existing.userId, 'contract-uploaded', [
                    { name: 'title', value: existing.title },
                ]);
            }
            return this.msg("فایل طراحی با موفقیت آپلود شد");
        }, req, res);
    }
    async PUT() {
        const id = this.getTargetId();
        if (!id)
            this.need("id", "شناسه قرارداد وارد نشده است");
        const existing = await prisma.contract.findUnique({ where: { id: id } });
        if (!existing)
            this.throw("قرارداد یافت نشد");
        const data = {};
        const title = this.get("title");
        const description = this.get("description");
        const status = this.get("status");
        const expire_at = this.get("expire_at");
        const userId = this.get("userId");
        const finalPrice = this.get("finalPrice");
        if (title)
            data.title = title;
        if (description !== undefined)
            data.description = description;
        if (status)
            data.status = status;
        if (expire_at)
            data.expire_at = new Date(expire_at);
        if (userId !== undefined)
            data.userId = userId || null;
        if (finalPrice !== undefined)
            data.finalPrice = +finalPrice;
        if (!Object.keys(data).length)
            this.throw("محتوایی برای ویرایش ارسال نشده است");
        return await prisma.contract.update({
            where: { id: id },
            data,
        });
    }
    filter(obj) {
        if (obj?.user?.phone) {
            obj.user.phone = obj.user.phone();
        }
        return obj;
    }
}
exports.default = AdminContractHandler;
__decorate([
    (0, common_1.Post)("upload"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'file', maxCount: 1 },
        { name: 'designFile', maxCount: 1 },
    ])),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminContractHandler.prototype, "upload", null);
__decorate([
    (0, common_1.Post)("upload-design"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'designFile', maxCount: 1 }
    ])),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminContractHandler.prototype, "uploadDesign", null);
//# sourceMappingURL=contract.js.map