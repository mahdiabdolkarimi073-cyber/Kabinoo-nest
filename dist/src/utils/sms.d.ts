type SmsTemplate = 'order-created' | 'payment-success' | 'order-status' | 'check-due' | 'check-paid' | 'contract-uploaded';
export declare function sendSMS(phone: string | number, template: SmsTemplate, parameters: {
    name: string;
    value: string;
}[]): Promise<boolean>;
export declare function notifyUserSMS(userId: string, template: SmsTemplate, parameters: {
    name: string;
    value: string;
}[]): Promise<boolean>;
export {};
