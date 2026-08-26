import RequestHandler from "@/core/request.handler";
import { All, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { sendRawSMS } from "@/utils/sms";

export default class AdminSmsHandler extends RequestHandler {

    @All()
    async send(@Req() req: Request, @Res() res: Response) {
        return this.splitInstance(async function () {
            const userId = this.json.userId;
            const message = this.json.message;

            if (!userId) this.throw("کاربر را انتخاب کنید");
            if (!message || !message.trim()) this.throw("متن پیام را وارد کنید");

            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: { id: true, name: true, phone: true },
            });

            if (!user) this.throw("کاربر یافت نشد");

            const phone = user.phone;
            if (typeof phone === 'function') this.throw("شماره تلفن کاربر معتبر نیست");

            const ok = await sendRawSMS(phone as string, message.trim());
            if (!ok) this.throw("ارسال پیامک ناموفق بود");

            return { success: true, message: "پیامک ارسال شد" };
        }, req, res);
    }
}
