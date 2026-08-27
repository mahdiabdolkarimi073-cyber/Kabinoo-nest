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
class AdminContractFileHandler extends prisma_handler_1.default {
    getModel() {
        return prisma.userFile;
    }
    getName() {
        return "فایل کاربر";
    }
    async upload(body, req, res) {
        return this.splitInstance(async function () {
            const _file = body?.['file']?.[0] || this.throw("فایل ارسال نشده است");
            const name = _file.originalname;
            const buffer = _file.buffer;
            const file = new File([buffer], name);
            const title = this.get("title", "عنوان فایل وارد نشده است");
            const description = this.get("description") || "";
            const userId = this.get("userId", "کاربر را انتخاب کنید");
            const fileName = `userfile-${Date.now()}.$EX`;
            const filePath = await (0, upload_1.updateFile)(file, "unknown", fileName);
            const userFile = await prisma.userFile.create({
                data: {
                    title,
                    description,
                    file: filePath,
                    fileName: name,
                    userId,
                },
            });
            await prisma.userNotification.create({
                data: {
                    title: "فایل جدید",
                    content: `فایل "${title}" برای شما ارسال شد.`,
                    userId,
                },
            });
            return userFile;
        }, req, res);
    }
    async PUT() {
        const id = this.getTargetId();
        if (!id)
            this.need("id", "شناسه فایل وارد نشده است");
        const existing = await prisma.userFile.findUnique({ where: { id: id } });
        if (!existing)
            this.throw("فایل یافت نشد");
        const data = {};
        const title = this.get("title");
        const description = this.get("description");
        if (title)
            data.title = title;
        if (description !== undefined)
            data.description = description;
        if (!Object.keys(data).length)
            this.throw("محتوایی برای ویرایش ارسال نشده است");
        return await prisma.userFile.update({
            where: { id: id },
            data,
        });
    }
    filter(obj) {
        return obj;
    }
}
exports.default = AdminContractFileHandler;
__decorate([
    (0, common_1.Post)("upload"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'file', maxCount: 1 }
    ])),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminContractFileHandler.prototype, "upload", null);
//# sourceMappingURL=contractFile.js.map