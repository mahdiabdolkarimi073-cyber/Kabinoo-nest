"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request_handler_1 = require("@/core/request.handler");
class DesignPriceHandler extends request_handler_1.default {
    async GET() {
        let settings = await prisma.designPriceSetting.findUnique({
            where: { id: 1 },
        });
        if (!settings) {
            settings = await prisma.designPriceSetting.create({
                data: { id: 1 },
            });
        }
        return settings;
    }
    async PUT() {
        const data = {
            baseMultiplier: Number(this.json.baseMultiplier),
            installationCost: Number(this.json.installationCost),
            designFee: Number(this.json.designFee),
            defaultDiscount: Number(this.json.defaultDiscount),
            minPrice: Number(this.json.minPrice),
        };
        const settings = await prisma.designPriceSetting.upsert({
            where: { id: 1 },
            create: { id: 1, ...data },
            update: data,
        });
        return this.msg('قیمت‌های طراحی با موفقیت ذخیره شدند');
    }
}
exports.default = DesignPriceHandler;
//# sourceMappingURL=designPrice.js.map