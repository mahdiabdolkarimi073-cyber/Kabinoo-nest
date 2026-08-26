import RequestHandler from "@/core/request.handler";

export default class PublicAnnouncementHandler extends RequestHandler {
    async GET() {
        return prisma.announcement.findMany({
            orderBy: { created_at: "desc" },
        });
    }
}
