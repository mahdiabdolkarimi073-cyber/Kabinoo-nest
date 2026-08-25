import RequestHandler from "@/core/request.handler";
import { hashPassword, verifyPassword } from "@/utils/password";
import { Post, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";

export default class SupportProfileHandler extends RequestHandler {

    async GET() {
        const user = await this.getUser();
        if (!user) this.throw({ code: 401, message: "باید وارد شوید" });
        return {
            id: user.id,
            name: user.name,
            phone: user.phone(),
            email: user.email,
            nationalCode: user.nationalCode,
            isSupport: user.isSupport,
            isAdmin: user.isAdmin,
        };
    }

    async PUT() {
        const user = await this.getUser();
        if (!user) this.throw({ code: 401, message: "باید وارد شوید" });

        const name = this.get("name");
        const email = this.get("email");
        const nationalCode = this.get("nationalCode");

        const data: any = {};
        if (name) data.name = name;
        if (email !== undefined) data.email = email;
        if (nationalCode !== undefined) data.nationalCode = nationalCode;

        await prisma.user.update({
            where: { id: user.id },
            data,
        });

        return this.msg("اطلاعات با موفقیت ویرایش شد");
    }

    @Post("password")
    async changePassword(@Req() req: Request, @Res() res: Response) {
        this.splitInstance(async function () {
            const user = await this.getUser();

            const verify = await verifyPassword(this.get("current", "پسورد فعلی وارد نشده"), user.password());
            if (!verify) this.throw("رمزعبور فعلی اشتباه است");

            await prisma.user.update({
                where: { id: user.id },
                data: {
                    password: await hashPassword(this.get("new", "رمزعبور جدید وارد نشده")),
                },
            });
            return this.msg("رمز عبور تغییر کرد");
        }, req, res);
    }
}
