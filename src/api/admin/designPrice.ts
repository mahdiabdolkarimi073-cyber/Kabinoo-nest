import RequestHandler from '@/core/request.handler';

export default class DesignPriceHandler extends RequestHandler {
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
