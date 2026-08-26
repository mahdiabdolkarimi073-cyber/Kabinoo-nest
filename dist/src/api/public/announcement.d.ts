import RequestHandler from "../../core/request.handler";
export default class PublicAnnouncementHandler extends RequestHandler {
    GET(): Promise<{
        title: string;
        content: string;
        id: string;
        created_at: Date;
        updated_at: Date;
        authorId: string;
    }[]>;
}
