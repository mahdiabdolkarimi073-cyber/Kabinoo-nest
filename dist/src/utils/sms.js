"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSMS = sendSMS;
exports.sendRawSMS = sendRawSMS;
exports.notifyUserSMS = notifyUserSMS;
const global_1 = require("../global");
const TEMPLATE_IDS = {
    'order-created': 335621,
    'payment-success': 335621,
    'order-status': 335621,
    'check-due': 335621,
    'check-paid': 335621,
    'contract-uploaded': 335621,
};
async function sendSMS(phone, template, parameters) {
    const apiKey = process.env['SMSIR_TOKEN'];
    if (!apiKey) {
        console.warn('SMSIR_TOKEN not set, skipping SMS');
        return false;
    }
    const finalPhone = String(phone).replace(/^0/, '').replace(/^\+98/, '').replace(/^98/, '');
    if (global_1.VARS.isDev) {
        console.log(`[DEV SMS] To: ${finalPhone}, Template: ${template}, Params:`, parameters);
        return true;
    }
    try {
        const res = await fetch('https://api.sms.ir/v1/send/verify', {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                'X-API-KEY': apiKey,
            },
            body: JSON.stringify({
                mobile: finalPhone,
                templateId: process.env[`SMSIR_${template.toUpperCase().replace(/-/g, '_')}_TEMPLATE`] || TEMPLATE_IDS[template],
                parameters,
            }),
        });
        if (!res.ok) {
            const errorText = await res.text();
            console.error(`SMS send failed: ${res.status} ${errorText}`);
            return false;
        }
        console.log(`SMS sent to ${finalPhone}, template: ${template}`);
        return true;
    }
    catch (e) {
        console.error('SMS send error:', e);
        return false;
    }
}
async function sendRawSMS(phone, message) {
    const apiKey = process.env['SMSIR_TOKEN'];
    if (!apiKey) {
        console.warn('SMSIR_TOKEN not set, skipping SMS');
        return false;
    }
    const finalPhone = String(phone).replace(/^0/, '').replace(/^\+98/, '').replace(/^98/, '');
    if (global_1.VARS.isDev) {
        console.log(`[DEV SMS] To: ${finalPhone}, Message: ${message}`);
        return true;
    }
    try {
        const res = await fetch('https://api.sms.ir/v1/send', {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                'X-API-KEY': apiKey,
            },
            body: JSON.stringify({
                message,
                mobiles: [finalPhone],
            }),
        });
        if (!res.ok) {
            const errorText = await res.text();
            console.error(`SMS send failed: ${res.status} ${errorText}`);
            return false;
        }
        console.log(`SMS sent to ${finalPhone}`);
        return true;
    }
    catch (e) {
        console.error('SMS send error:', e);
        return false;
    }
}
async function notifyUserSMS(userId, template, parameters) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user)
        return false;
    const phone = user.phone;
    if (typeof phone === 'function')
        return false;
    return sendSMS(phone, template, parameters);
}
//# sourceMappingURL=sms.js.map