"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getValidOffCode = getValidOffCode;
exports.calculateDiscount = calculateDiscount;
const request_handler_1 = require("../../core/request.handler");
const built_in_1 = require("../../utils/built-in");
class OffCodeHandler extends request_handler_1.default {
    async GET() {
        const user = await this.getUser(true);
        const code = this.params['code'] || this.need("code", "کد تخفیف وارد نشده");
        return getValidOffCode(user.id, code);
    }
}
exports.default = OffCodeHandler;
async function getValidOffCode(userId, code, paymentMethod) {
    const offCode = await prisma.offCode.findUnique({
        where: {
            id: code
        }
    }) || (0, built_in_1.Throw)("کد تخفیف یافت نشد");
    if (offCode.userId && offCode.userId !== userId)
        (0, built_in_1.Throw)("کد تخفیف متعلق به شما نیست");
    if (offCode.maxUsage && offCode.used >= offCode.maxUsage)
        (0, built_in_1.Throw)("نمیتوانید از این کد تخفیف استفاده کنید");
    if (offCode.cashOnly && paymentMethod === "INSTALLMENT") {
        (0, built_in_1.Throw)("این کد تخفیف فقط برای پرداخت نقدی (آنلاین) قابل استفاده است");
    }
    return offCode;
}
function calculateDiscount(totalPrice, offCode) {
    if (!offCode)
        return 0;
    if (offCode.type === "FIXED") {
        return Math.min(offCode.amount, totalPrice);
    }
    return totalPrice / 100 * (offCode.percent || 0);
}
//# sourceMappingURL=offCode.js.map