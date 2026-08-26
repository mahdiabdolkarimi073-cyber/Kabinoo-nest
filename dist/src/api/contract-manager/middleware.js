"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request_handler_1 = require("../../core/request.handler");
class ContractManagerMiddleware {
    async use(req, res, next) {
        const handler = new request_handler_1.default(req, res);
        const user = await handler.getUser();
        if (!user)
            return handler.response("باید وارد شوید", 401, 'Unauthenticated');
        if (!user.isAdmin && !user.isContractManager)
            return handler.response("شما دسترسی لازم را ندارید", 403, 'Forbidden');
        next();
    }
}
exports.default = ContractManagerMiddleware;
//# sourceMappingURL=middleware.js.map