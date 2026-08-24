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
        return prisma.catalog.findMany({
            where: { enabled: true },
            orderBy: { sortOrder: "asc" },
        });
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
            return catalog;
        }, req, res);
    }
}
