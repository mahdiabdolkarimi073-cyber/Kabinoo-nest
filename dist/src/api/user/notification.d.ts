import RequestHandler from "../../core/request.handler";
export default class UserNotificationHandler extends RequestHandler {
    GET(): Promise<{
        id: string;
        userId: string;
        created_at: Date;
        title: string;
        content: string;
        read: boolean;
    } | {
        id: string;
        userId: string;
        created_at: Date;
        title: string;
        content: string;
        read: boolean;
    }[]>;
    PUT(): Promise<{
        id: string;
        userId: string;
        created_at: Date;
        title: string;
        content: string;
        read: boolean;
    }>;
    DELETE(): Promise<void>;
}
