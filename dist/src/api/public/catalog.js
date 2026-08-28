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
const prisma_limited_handler_1 = require("../../core/prisma.limited.handler");
class PublicCatalogHandler extends prisma_limited_handler_1.default {
    getModel() {
        return prisma.catalog;
    }
    getName() {
        return "کاتالوگ";
    }
    async GET() {
        const catalogs = await prisma.catalog.findMany({
            where: { enabled: true },
            orderBy: { sortOrder: "asc" },
        });
        return catalogs.map(c => ({
            id: c.id,
            title: c.title,
            slug: c.slug,
            description: c.description,
            coverImage: c.coverImage,
            pages: c.pages,
            zipPath: c.zipPath,
            entryFile: c.entryFile,
        }));
    }
    async bySlug(req, res) {
        this.splitInstance(async function () {
            const slug = this.params.slug;
            if (!slug)
                this.throw("کاتالوگ یافت نشد");
            const catalog = await prisma.catalog.findFirst({
                where: { slug, enabled: true },
            });
            if (!catalog)
                this.throw("کاتالوگ یافت نشد");
            return {
                id: catalog.id,
                title: catalog.title,
                slug: catalog.slug,
                description: catalog.description,
                coverImage: catalog.coverImage,
                pages: catalog.pages,
                zipPath: catalog.zipPath,
                entryFile: catalog.entryFile,
            };
        }, req, res);
    }
}
exports.default = PublicCatalogHandler;
__decorate([
    (0, common_1.Get)(":slug"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PublicCatalogHandler.prototype, "bySlug", null);
//# sourceMappingURL=catalog.js.map