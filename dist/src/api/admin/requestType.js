"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_handler_1 = require("../../core/prisma.handler");
class RequestTypeHandler extends prisma_handler_1.default {
    getModel() {
        return prisma.requestType;
    }
    getName() {
        return "نوع درخواست طراحی";
    }
}
exports.default = RequestTypeHandler;
//# sourceMappingURL=requestType.js.map