"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_limited_handler_1 = require("../../core/prisma.limited.handler");
class RequestTypeHandler extends prisma_limited_handler_1.default {
    getModel() {
        return prisma.requestType;
    }
    getName() {
        return "نوع درخواست طراحی";
    }
    enableQueryFilter() {
        return true;
    }
}
exports.default = RequestTypeHandler;
//# sourceMappingURL=requestType.js.map