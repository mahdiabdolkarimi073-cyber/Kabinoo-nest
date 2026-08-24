"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_handler_1 = require("../../core/prisma.handler");
class CommentHandler extends prisma_handler_1.default {
    getModel() {
        return prisma.productComment;
    }
    getName() {
        return "نظر";
    }
}
exports.default = CommentHandler;
//# sourceMappingURL=comment.js.map