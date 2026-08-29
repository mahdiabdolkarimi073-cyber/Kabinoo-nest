import { Post, Req, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'node:path';
import * as process from 'node:process';
import * as unzipper from 'unzipper';
const AdmZip = require('adm-zip');
import RequestHandler from '@/core/request.handler';
import { generateRandomString } from '@/utils/string';
import { UPLOAD_DIR } from '../user/upload';

const CATALOG_DIR = 'catalogs';

function getCatalogBasePath(): string {
    return path.join(process.cwd(), UPLOAD_DIR, CATALOG_DIR);
}

function findEntryFileInList(fileNames: string[]): string | null {
    const htmlFiles = fileNames.filter(name =>
        !name.endsWith('/') && name.toLowerCase().endsWith('.html')
    );

    if (htmlFiles.length === 0) return null;

    const priorities = ['index.html', 'main.html', 'start.html', 'default.html', 'book.html', 'catalog.html'];

    for (const priority of priorities) {
        const match = htmlFiles.find(
            e => e.toLowerCase().endsWith('/' + priority) || e.toLowerCase() === priority
        );
        if (match) return match;
    }

    const rootHtml = htmlFiles.find(e => !e.includes('/'));
    if (rootHtml) return rootHtml;

    return htmlFiles[0];
}

async function extractWithUnzipper(buffer: Buffer, destDir: string): Promise<string[]> {
    const directory = await unzipper.Open.buffer(buffer);
    const fileNames: string[] = [];

    for (const file of directory.files) {
        if (file.type === 'Directory') continue;
        const targetPath = path.join(destDir, file.path);
        const targetDir = path.dirname(targetPath);
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }
        const content = await file.buffer();
        fs.writeFileSync(targetPath, content);
        fileNames.push(file.path);
    }

    return fileNames;
}

export default class CatalogZipHandler extends RequestHandler {

    @Post()
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'file', maxCount: 1 },
        { name: 'cover', maxCount: 1 },
    ]))
    async upload(@UploadedFiles() body: any, @Req() req: Request, @Res() res: Response) {
        this.res = res;
        this.request = req;
        return this.splitInstance(async function () {
            const _file = body?.['file']?.[0];
            if (!_file) this.need('file', 'فایل زیپ');

            const title = this.get('title', 'عنوان کاتالوگ');
            const slug = this.get('slug', 'نام انگلیسی در آدرس');
            const description = this.get('description') || '';

            const existing = await prisma.catalog.findUnique({ where: { slug } });
            if (existing) this.throw({ code: 400, message: 'این نام انگلیسی قبلا استفاده شده است' });

            let buffer: Buffer;
            if (_file.buffer) {
                buffer = _file.buffer as Buffer;
            } else if (_file.path) {
                buffer = fs.readFileSync(_file.path);
            } else {
                this.throw({ code: 400, message: 'فایل دریافت نشد' });
            }

            if (buffer.length < 4 || buffer[0] !== 0x50 || buffer[1] !== 0x4b) {
                this.throw({ code: 400, message: 'فایل انتخاب شده یک فایل زیپ نیست' });
            }

            const catalogId = generateRandomString(12);
            const catalogDir = path.join(getCatalogBasePath(), catalogId);

            if (!fs.existsSync(getCatalogBasePath())) {
                fs.mkdirSync(getCatalogBasePath(), { recursive: true });
            }
            fs.mkdirSync(catalogDir, { recursive: true });

            let entryFile: string | null = null;
            let extracted = false;
            let extractError = '';

            // Primary: unzipper (pure Node.js, handles ZIP64)
            try {
                const fileNames = await extractWithUnzipper(buffer, catalogDir);
                entryFile = findEntryFileInList(fileNames);
                extracted = true;
            } catch (unzipErr: any) {
                extractError = `unzipper: ${unzipErr?.message || unzipErr}`;
                this.debug('unzipper failed, trying AdmZip', unzipErr);
            }

            // Fallback: AdmZip
            if (!extracted) {
                try {
                    const zip = new AdmZip(buffer);
                    const entries = zip.getEntries();
                    for (const entry of entries) {
                        if (entry.isDirectory) continue;
                        const targetPath = path.join(catalogDir, entry.entryName);
                        const targetDir = path.dirname(targetPath);
                        if (!fs.existsSync(targetDir)) {
                            fs.mkdirSync(targetDir, { recursive: true });
                        }
                        fs.writeFileSync(targetPath, entry.getData());
                    }
                    entryFile = findEntryFileInList(entries.map((e: any) => e.entryName));
                    extracted = true;
                } catch (admErr: any) {
                    extractError += ` | adm-zip: ${admErr?.message || admErr}`;
                    this.debug('AdmZip also failed', admErr);
                }
            }

            if (!extracted) {
                this.throw({ code: 400, message: `فایل زیپ معتبر نیست. ${extractError}` });
            }

            if (!entryFile) {
                this.throw({ code: 400, message: 'فایل HTML داخل زیپ یافت نشد' });
            }

            let coverImage = '';
            const _cover = body?.['cover']?.[0];
            if (_cover) {
                const coverBuffer = (_cover.buffer || (_cover.path ? fs.readFileSync(_cover.path) : null)) as Buffer;
                const coverExt = _cover.originalname.split('.').pop() || 'jpg';
                const coverName = `${generateRandomString(10)}.${coverExt}`;
                const coverPath = path.join(getCatalogBasePath(), coverName);
                fs.writeFileSync(coverPath, coverBuffer);
                coverImage = `${UPLOAD_DIR}/${CATALOG_DIR}/${coverName}`.replace(UPLOAD_DIR, '/public/file').replaceAll('\\', '/');
            }

            const zipApiPath = `${UPLOAD_DIR}/${CATALOG_DIR}/${catalogId}`.replaceAll('\\', '/');

            const catalog = await prisma.catalog.create({
                data: {
                    title,
                    slug,
                    description,
                    coverImage,
                    pages: [],
                    zipPath: zipApiPath,
                    entryFile,
                    enabled: true,
                    sortOrder: 0,
                },
            });

            return catalog;
        }, req, res);
    }

    async DELETE() {
        const id = this.get("id", "شناسه کاتالوگ وارد نشده است");

        const catalog = await prisma.catalog.findUnique({ where: { id } });
        if (!catalog) this.throw({ code: 404, message: 'کاتالوگ یافت نشد' });

        if (catalog.zipPath) {
            const dirPath = path.join(process.cwd(), catalog.zipPath.replace('/public/file', UPLOAD_DIR));
            if (fs.existsSync(dirPath)) {
                fs.rmSync(dirPath, { recursive: true, force: true });
            }
            if (catalog.coverImage) {
                const coverPath = path.join(process.cwd(), catalog.coverImage.replace('/public/file', UPLOAD_DIR));
                if (fs.existsSync(coverPath)) {
                    fs.unlinkSync(coverPath);
                }
            }
        }

        await prisma.catalog.delete({ where: { id } });
        return this.msg('کاتالوگ با موفقیت حذف شد');
    }
}
