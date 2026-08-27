"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_handler_1 = require("../../core/prisma.handler");
class AdminCounselingHandler extends prisma_handler_1.default {
    getModel() {
        return prisma.userCounseling;
    }
    getName() {
        return "درخواست مشاوره";
    }
    async GET_findFirst(id) {
        const base = await super.GET_findFirst(id);
        if (id) {
            base.include = {
                ...base.include,
                user: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                    },
                },
            };
        }
        return base;
    }
    async PUT() {
        const id = this.getTargetId();
        if (!id)
            this.need("id", "شناسه درخواست وارد نشده است");
        const existing = await prisma.userCounseling.findUnique({ where: { id: id } });
        if (!existing)
            this.throw("درخواست یافت نشد");
        const data = {};
        const status = this.get("status");
        if (status)
            data.status = status;
        if (!Object.keys(data).length)
            this.throw("محتوایی برای ویرایش ارسال نشده است");
        return await prisma.userCounseling.update({
            where: { id: id },
            data,
        });
    }
}
exports.default = AdminCounselingHandler;
//# sourceMappingURL=counseling.js.map