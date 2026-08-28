import { Get, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import PrismaLimitHandler from "@/core/prisma.limited.handler";

export default class PublicCatalogHandler extends PrismaLimitHandler {
    getModel() {
        return prisma.catalog;
    }

    getName(): string {
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

    @Get(":slug")
    async bySlug(@Req() req: Request, @Res() res: Response) {
        this.splitInstance(async function () {
            const slug = this.params.slug;
            if (!slug) this.throw("کاتالوگ یافت نشد");
            const catalog = await prisma.catalog.findFirst({
                where: { slug, enabled: true },
            });
            if (!catalog) this.throw("کاتالوگ یافت نشد");
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
