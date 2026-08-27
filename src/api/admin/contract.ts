import { Post, Req, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import PrismaFullHandler from '@/core/prisma.handler';
import { updateFile } from '@/api/user/upload';
import { notifyUserSMS } from '@/utils/sms';

export default class AdminContractHandler extends PrismaFullHandler {

    getModel() {
        return prisma.contract;
    }

    getName() {
        return "قرارداد";
    }

    @Post("upload")
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'file', maxCount: 1 },
        { name: 'designFile', maxCount: 1 },
    ]))
    async upload(@UploadedFiles() body: any, @Req() req: any, @Res() res: Response) {
        return this.splitInstance(async function () {
            const _file = body?.['file']?.[0] || this.throw("فایل قرارداد ارسال نشده است");
            const name = _file.originalname;
            const buffer = _file.buffer as Buffer;
            const file = new File([buffer as any], name);

            const title = this.get("title", "عنوان قرارداد وارد نشده است");
            const description = this.get("description") || "";
            const userId = this.get("userId") || null;
            const expire_at = this.get("expire_at") || null;
            const status = this.get("status") || "DRAFT";
            const finalPrice = +this.get("finalPrice") || 0;

            const fileName = `contract-${Date.now()}.$EX`;
            const filePath = await updateFile(file, "unknown", fileName);

            let designFilePath = "";
            const _designFile = body?.['designFile']?.[0];
            if (_designFile) {
                const designBuffer = _designFile.buffer as Buffer;
                const designFileObj = new File([designBuffer as any], _designFile.originalname);
                const designFileName = `contract-design-${Date.now()}.$EX`;
                designFilePath = await updateFile(designFileObj, "unknown", designFileName);
            }

            const contract = await prisma.contract.create({
                data: {
                    title,
                    description,
                    file: filePath,
                    designFile: designFilePath,
                    finalPrice,
                    userId: userId || null,
                    expire_at: expire_at ? new Date(expire_at) : null,
                    status: status as any,
                },
            });

            if (userId) {
                await notifyUserSMS(userId, 'contract-uploaded', [
                    { name: 'title', value: title },
                ]);
            }

            return contract;
        }, req, res);
    }

    @Post("upload-design")
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'designFile', maxCount: 1 }
    ]))
    async uploadDesign(@UploadedFiles() body: any, @Req() req: any, @Res() res: Response) {
        return this.splitInstance(async function () {
            const id = this.get("id", "شناسه قرارداد وارد نشده است");
            const _file = body?.['designFile']?.[0] || this.throw("فایل طراحی ارسال نشده است");

            const existing = await prisma.contract.findUnique({ where: { id: id as string } });
            if (!existing) this.throw("قرارداد یافت نشد");

            const buffer = _file.buffer as Buffer;
            const file = new File([buffer as any], _file.originalname);
            const fileName = `contract-design-${Date.now()}.$EX`;
            const filePath = await updateFile(file, existing.designFile || "unknown", fileName);

            await prisma.contract.update({
                where: { id: id as string },
                data: { designFile: filePath },
            });

            if (existing.userId) {
                await notifyUserSMS(existing.userId, 'contract-uploaded', [
                    { name: 'title', value: existing.title },
                ]);
            }

            return this.msg("فایل طراحی با موفقیت آپلود شد");
        }, req, res);
    }

    async PUT() {
        const id = this.getTargetId();
        if (!id) this.need("id", "شناسه قرارداد وارد نشده است");

        const existing = await prisma.contract.findUnique({ where: { id: id as string } });
        if (!existing) this.throw("قرارداد یافت نشد");

        const data: any = {};
        const title = this.get("title");
        const description = this.get("description");
        const status = this.get("status");
        const expire_at = this.get("expire_at");
        const userId = this.get("userId");
        const finalPrice = this.get("finalPrice");

        if (title) data.title = title;
        if (description !== undefined) data.description = description;
        if (status) data.status = status;
        if (expire_at) data.expire_at = new Date(expire_at);
        if (userId !== undefined) data.userId = userId || null;
        if (finalPrice !== undefined) data.finalPrice = +finalPrice;

        if (!Object.keys(data).length) this.throw("محتوایی برای ویرایش ارسال نشده است");

        return await prisma.contract.update({
            where: { id: id as string },
            data,
        });
    }

    filter(obj: any) {
        if (obj?.user?.phone) {
            obj.user.phone = obj.user.phone() as any;
        }
        return obj;
    }
}
