import RequestHandler from "../../core/request.handler";
export declare const homepageDefaults: {
    key: string;
    title: string;
    subtitle: string;
    description: string;
    image: string;
    buttonLabel: string;
    buttonHref: string;
    sortOrder: number;
}[];
export declare function ensureHomepageDefaults(): Promise<void>;
export default class HomepageHandler extends RequestHandler {
    GET(): Promise<{
        key: string;
        id: number;
        sortOrder: number;
        description: string;
        title: string;
        image: string;
        updatedAt: Date;
        subtitle: string;
        buttonLabel: string;
        buttonHref: string;
        enabled: boolean;
    }[]>;
}
