import { Post, Req, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import PrismaFullHandler from '@/core/prisma.handler';
import { updateFile } from '@/api/user/upload';

export default class AdminContractFileHandler extends PrismaFullHandler {

    getModel() {
        return prisma.userFile;
    }

    getName() {
        return "فایل کاربر";
    }

    @Post("upload")
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'file', maxCount: 1 }
    ]))
    async upload(@UploadedFiles() body: any, @Req() req: any, @Res() res: Response) {
        return this.splitInstance(async function () {
            const _file = body?.['file']?.[0] || this.throw("فایل ارسال نشده است");
            const name = _file.originalname;
            const buffer = _file.buffer as Buffer;
            const file = new File([buffer as any], name);

            const title = this.get("title", "عنوان فایل وارد نشده است");
            const description = this.get("description") || "";
            const userId = this.get("userId", "کاربر را انتخاب کنید");

            const fileName = `userfile-${Date.now()}.$EX`;
            const filePath = await updateFile(file, "unknown", fileName);

            const userFile = await prisma.userFile.create({
                data: {
                    title,
                    description,
                    file: filePath,
                    fileName: name,
                    userId,
                },
            });

            await prisma.userNotification.create({
                data: {
                    title: "فایل جدید",
                    content: `فایل "${title}" برای شما ارسال شد.`,
                    userId,
                },
            });

            return userFile;
        }, req, res);
    }

    async PUT() {
        const id = this.getTargetId();
        if (!id) this.need("id", "شناسه فایل وارد نشده است");

        const existing = await prisma.userFile.findUnique({ where: { id: id as string } });
        if (!existing) this.throw("فایل یافت نشد");

        const data: any = {};
        const title = this.get("title");
        const description = this.get("description");

        if (title) data.title = title;
        if (description !== undefined) data.description = description;

        if (!Object.keys(data).length) this.throw("محتوایی برای ویرایش ارسال نشده است");

        return await prisma.userFile.update({
            where: { id: id as string },
            data,
        });
    }

    filter(obj: any) {
        return obj;
    }
}
