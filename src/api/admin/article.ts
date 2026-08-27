import PrismaFullHandler from "@/core/prisma.handler";

export default class AdminArticleHandler extends PrismaFullHandler {
    getModel() {
        return prisma.article;
    }

    getName() {
        return "مقاله";
    }

    isFullAccess() {
        return true;
    }

    async additionalPayload() {
        const user = await this.getUser();
        return {
            authorId: user?.id,
        };
    }

    async GET_findFirst(id: any) {
        const base = await super.GET_findFirst(id);
        if (id) {
            base.include = {
                ...base.include,
                author: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            };
        }
        return base;
    }
}
