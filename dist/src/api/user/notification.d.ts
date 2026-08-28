import RequestHandler from "../../core/request.handler";
export default class UserNotificationHandler extends RequestHandler {
    GET(): Promise<{
        title: string;
        content: string;
        id: string;
        userId: string;
        created_at: Date;
        read: boolean;
    } | {
        title: string;
        content: string;
        id: string;
        userId: string;
        created_at: Date;
        read: boolean;
    }[]>;
    PUT(): Promise<{
        title: string;
        content: string;
        id: string;
        userId: string;
        created_at: Date;
        read: boolean;
    }>;
    DELETE(): Promise<void>;
}
