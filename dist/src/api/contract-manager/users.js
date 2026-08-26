"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_handler_1 = require("../../core/prisma.handler");
class ContractManagerUsersHandler extends prisma_handler_1.default {
    getModel() {
        return prisma.user;
    }
    getName() {
        return "کاربر";
    }
    async PUT() {
        const id = this.getTargetId();
        if (!id)
            this.need("id", "شناسه کاربر وارد نشده است");
        const existing = await prisma.user.findUnique({ where: { id: id } });
        if (!existing)
            this.throw("کاربر یافت نشد");
        const data = {};
        const name = this.get("name");
        const email = this.get("email");
        const nationalCode = this.get("nationalCode");
        if (name)
            data.name = name;
        if (email !== undefined)
            data.email = email;
        if (nationalCode !== undefined)
            data.nationalCode = nationalCode;
        if (!Object.keys(data).length)
            this.throw("محتوایی برای ویرایش ارسال نشده است");
        return await prisma.user.update({
            where: { id: id },
            data,
        });
    }
    filter(obj) {
        obj.phone = obj.phone();
        return obj;
    }
}
exports.default = ContractManagerUsersHandler;
//# sourceMappingURL=users.js.map