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
}
