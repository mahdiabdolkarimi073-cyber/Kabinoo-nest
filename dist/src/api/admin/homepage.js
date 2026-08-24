"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_handler_1 = require("../../core/prisma.handler");
const homepage_1 = require("../public/homepage");
class HomepageHandler extends prisma_handler_1.default {
    getModel() {
        return prisma.homepageContent;
    }
    getName() {
        return "محتوای صفحه اصلی";
    }
    async GET(id = this.getTargetId()) {
        await (0, homepage_1.ensureHomepageDefaults)();
        return super.GET(id);
    }
}
exports.default = HomepageHandler;
//# sourceMappingURL=homepage.js.map