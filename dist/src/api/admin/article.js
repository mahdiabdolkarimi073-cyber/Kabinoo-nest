"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_handler_1 = require("../../core/prisma.handler");
class AdminArticleHandler extends prisma_handler_1.default {
    getModel() {
        return prisma.article;
    }
    getName() {
        return "مقاله";
    }
    isFullAccess() {
        return true;
    }
    async additionalPayload() {
        const user = await this.getUser();
        return {
            authorId: user?.id,
        };
    }
    async GET_findFirst(id) {
        const base = await super.GET_findFirst(id);
        if (id) {
            base.include = {
                ...base.include,
                author: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            };
        }
        return base;
    }
}
exports.default = AdminArticleHandler;
//# sourceMappingURL=article.js.map