"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const fs = require("fs");
const path = require("node:path");
const process = require("node:process");
const unzipper = require("unzipper");
const AdmZip = require('adm-zip');
const request_handler_1 = require("../../core/request.handler");
const string_1 = require("../../utils/string");
const upload_1 = require("../user/upload");
const CATALOG_DIR = 'catalogs';
function getCatalogBasePath() {
    return path.join(process.cwd(), upload_1.UPLOAD_DIR, CATALOG_DIR);
}
function findEntryFileInList(fileNames) {
    const htmlFiles = fileNames.filter(name => !name.endsWith('/') && name.toLowerCase().endsWith('.html'));
    if (htmlFiles.length === 0)
        return null;
    const priorities = ['index.html', 'main.html', 'start.html', 'default.html', 'book.html', 'catalog.html'];
    for (const priority of priorities) {
        const match = htmlFiles.find(e => e.toLowerCase().endsWith('/' + priority) || e.toLowerCase() === priority);
        if (match)
            return match;
    }
    const rootHtml = htmlFiles.find(e => !e.includes('/'));
    if (rootHtml)
        return rootHtml;
    return htmlFiles[0];
}
async function extractWithUnzipper(buffer, destDir) {
    const directory = await unzipper.Open.buffer(buffer);
    const fileNames = [];
    for (const file of directory.files) {
        if (file.type === 'Directory')
            continue;
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
class CatalogZipHandler extends request_handler_1.default {
    async upload(body, req, res) {
        this.res = res;
        this.request = req;
        return this.splitInstance(async function () {
            const _file = body?.['file']?.[0];
            if (!_file)
                this.need('file', 'فایل زیپ');
            const title = this.get('title', 'عنوان کاتالوگ');
            const slug = this.get('slug', 'نام انگلیسی در آدرس');
            const description = this.get('description') || '';
            const existing = await prisma.catalog.findUnique({ where: { slug } });
            if (existing)
                this.throw({ code: 400, message: 'این نام انگلیسی قبلا استفاده شده است' });
            let buffer;
            if (_file.buffer) {
                buffer = _file.buffer;
            }
            else if (_file.path) {
                buffer = fs.readFileSync(_file.path);
            }
            else {
                this.throw({ code: 400, message: 'فایل دریافت نشد' });
            }
            if (buffer.length < 4 || buffer[0] !== 0x50 || buffer[1] !== 0x4b) {
                this.throw({ code: 400, message: 'فایل انتخاب شده یک فایل زیپ نیست' });
            }
            const catalogId = (0, string_1.generateRandomString)(12);
            const catalogDir = path.join(getCatalogBasePath(), catalogId);
            if (!fs.existsSync(getCatalogBasePath())) {
                fs.mkdirSync(getCatalogBasePath(), { recursive: true });
            }
            fs.mkdirSync(catalogDir, { recursive: true });
            let entryFile = null;
            let extracted = false;
            let extractError = '';
            try {
                const fileNames = await extractWithUnzipper(buffer, catalogDir);
                entryFile = findEntryFileInList(fileNames);
                extracted = true;
            }
            catch (unzipErr) {
                extractError = `unzipper: ${unzipErr?.message || unzipErr}`;
                this.debug('unzipper failed, trying AdmZip', unzipErr);
            }
            if (!extracted) {
                try {
                    const zip = new AdmZip(buffer);
                    const entries = zip.getEntries();
                    for (const entry of entries) {
                        if (entry.isDirectory)
                            continue;
                        const targetPath = path.join(catalogDir, entry.entryName);
                        const targetDir = path.dirname(targetPath);
                        if (!fs.existsSync(targetDir)) {
                            fs.mkdirSync(targetDir, { recursive: true });
                        }
                        fs.writeFileSync(targetPath, entry.getData());
                    }
                    entryFile = findEntryFileInList(entries.map((e) => e.entryName));
                    extracted = true;
                }
                catch (admErr) {
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
                const coverBuffer = (_cover.buffer || (_cover.path ? fs.readFileSync(_cover.path) : null));
                const coverExt = _cover.originalname.split('.').pop() || 'jpg';
                const coverName = `${(0, string_1.generateRandomString)(10)}.${coverExt}`;
                const coverPath = path.join(getCatalogBasePath(), coverName);
                fs.writeFileSync(coverPath, coverBuffer);
                coverImage = `${upload_1.UPLOAD_DIR}/${CATALOG_DIR}/${coverName}`.replace(upload_1.UPLOAD_DIR, '/public/file').replaceAll('\\', '/');
            }
            const zipApiPath = `${upload_1.UPLOAD_DIR}/${CATALOG_DIR}/${catalogId}`.replaceAll('\\', '/');
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
        if (!catalog)
            this.throw({ code: 404, message: 'کاتالوگ یافت نشد' });
        if (catalog.zipPath) {
            const dirPath = path.join(process.cwd(), catalog.zipPath.replace('/public/file', upload_1.UPLOAD_DIR));
            if (fs.existsSync(dirPath)) {
                fs.rmSync(dirPath, { recursive: true, force: true });
            }
            if (catalog.coverImage) {
                const coverPath = path.join(process.cwd(), catalog.coverImage.replace('/public/file', upload_1.UPLOAD_DIR));
                if (fs.existsSync(coverPath)) {
                    fs.unlinkSync(coverPath);
                }
            }
        }
        await prisma.catalog.delete({ where: { id } });
        return this.msg('کاتالوگ با موفقیت حذف شد');
    }
}
exports.default = CatalogZipHandler;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'file', maxCount: 1 },
        { name: 'cover', maxCount: 1 },
    ])),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], CatalogZipHandler.prototype, "upload", null);
//# sourceMappingURL=catalogZip.js.map