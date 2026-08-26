"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_handler_1 = require("../../core/prisma.handler");
class ContractManagerRequestHandler extends prisma_handler_1.default {
    getModel() {
        return prisma.designRequest;
    }
    getName() {
        return "درخواست طراحی";
    }
    async PUT() {
        const id = this.getTargetId();
        if (!id)
            this.need("id", "شناسه درخواست وارد نشده است");
        const existing = await prisma.designRequest.findUnique({ where: { id: id } });
        if (!existing)
            this.throw("درخواست یافت نشد");
        const data = {};
        const status = this.get("status");
        const answer = this.get("answer");
        if (status)
            data.status = status;
        if (answer !== undefined)
            data.answer = answer;
        if (!Object.keys(data).length)
            this.throw("محتوایی برای ویرایش ارسال نشده است");
        return await prisma.designRequest.update({
            where: { id: id },
            data,
        });
    }
    filter(obj) {
        if (obj?.user?.phone) {
            obj.user.phone = obj.user.phone();
        }
        return obj;
    }
}
exports.default = ContractManagerRequestHandler;
//# sourceMappingURL=request.js.map