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
}
exports.default = DesignPriceHandler;
//# sourceMappingURL=designPrice.js.map