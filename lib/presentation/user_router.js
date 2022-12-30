"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router_response_1 = require("../core/router_response");
function UsersRouter(getUser, getUsersByOrgaId, addUser, updateUser, enableUser, deleteUser) {
    const router = express_1.default.Router();
    router.get('/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
        //definitions
        let code = 500;
        let toSend;
        try {
            //execution
            const user = yield getUser.execute(req.params.id);
            //evaluate
            if (user == null) {
                code = 404;
                toSend = new router_response_1.RouterResponse('1.0', 'Not found', 'get', { id: req.params.id }, 'user not getted');
            }
            else {
                code = 200;
                toSend = new router_response_1.RouterResponse('1.0', user, 'get', { id: req.params.id }, 'geted by id');
            }
        }
        catch (err) {
            //something wrong
            code = 500;
            toSend = new router_response_1.RouterResponse('1.0', err, 'get', { id: req.params.id }, 'not obtained');
        }
        //respond cordially
        res.status(code).send(toSend);
    }));
    router.get('/byorga/:orgaId', (req, res) => __awaiter(this, void 0, void 0, function* () {
        //definitions
        let code = 500;
        let toSend;
        try {
            //execution
            const users = yield getUsersByOrgaId.execute(req.params.orgaId);
            //evaluate
            if (users == null || users.currentItemCount == 0) {
                code = 404;
                toSend = new router_response_1.RouterResponse('1.0', 'Not found', 'get', { orgaId: req.params.orgaId }, 'users not getted');
            }
            else {
                code = 200;
                toSend = new router_response_1.RouterResponse('1.0', users, 'get', { orgaId: req.params.orgaId }, 'geted by orga id');
            }
        }
        catch (err) {
            //something wrong
            code = 500;
            toSend = new router_response_1.RouterResponse('1.0', err, 'get', { orgaId: req.params.orgaId }, 'not obtained by orga id');
        }
        //respond cordially
        res.status(code).send(toSend);
    }));
    router.post('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
        //definitions
        let code = 500;
        let toSend;
        try {
            //execution
            const user = yield addUser.execute(req.body);
            //evaluate
            if (user == null) {
                code = 409;
                toSend = new router_response_1.RouterResponse('1.0', 'Conflict', 'post', undefined, 'new user not added');
            }
            else {
                code = 200;
                toSend = new router_response_1.RouterResponse('1.0', user, 'post', undefined, 'new user added');
            }
        }
        catch (err) {
            //something wrong
            code = 500;
            toSend = new router_response_1.RouterResponse('1.0', err, 'post', undefined, 'user was not added');
        }
        //respond cordially
        res.status(code).send(toSend);
    }));
    router.put('/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
        //definitions
        let code = 500;
        let toSend;
        try {
            //execution
            const user = yield updateUser.execute(req.params.id, req.body);
            //evaluate
            if (user == null) {
                code = 409;
                toSend = new router_response_1.RouterResponse('1.0', 'Conflict', 'put', { id: req.params.id }, 'user not edited');
            }
            else {
                code = 200;
                toSend = new router_response_1.RouterResponse('1.0', user, 'put', { id: req.params.id }, 'user edited');
            }
        }
        catch (err) {
            //something wrong
            code = 500;
            toSend = new router_response_1.RouterResponse('1.0', err, 'put', { id: req.params.id }, 'user was not edited');
        }
        //respond cordially
        res.status(code).send(toSend);
    }));
    router.put('/enable/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
        const text = (req.query.enable === 'false' ? false : true) ? 'enabled' : 'disabled';
        //definitions
        let code = 500;
        let toSend;
        try {
            //execution
            const result = yield enableUser.execute(req.params.id, (req.query.enable === 'false' ? false : true));
            //evaluate
            if (result == null) {
                code = 409;
                toSend = new router_response_1.RouterResponse('1.0', 'Conflict', 'put', { id: req.params.id, enable: req.query.enable }, 'user not ' + text);
            }
            else {
                code = 200;
                toSend = new router_response_1.RouterResponse('1.0', { result }, 'put', { id: req.params.id, enable: req.query.enable }, 'user ' + text);
            }
        }
        catch (err) {
            //something wrong
            code = 500;
            toSend = new router_response_1.RouterResponse('1.0', err, 'put', { id: req.params.id, enable: req.query.enable }, 'user was not ' + text);
        }
        //respond cordially
        res.status(code).send(toSend);
    }));
    router.delete('/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
        //definitions
        let code = 500;
        let toSend;
        try {
            //execution
            const result = yield deleteUser.execute(req.params.id);
            //evaluate
            if (result == null) {
                code = 409;
                toSend = new router_response_1.RouterResponse('1.0', 'Conflict', 'delete', { id: req.params.id }, 'user not deleted');
            }
            else {
                code = 200;
                toSend = new router_response_1.RouterResponse('1.0', { result }, 'delete', { id: req.params.id }, 'user deleted');
            }
        }
        catch (err) {
            //something wrong
            code = 500;
            toSend = new router_response_1.RouterResponse('1.0', err, 'delete', { id: req.params.id }, 'user was not deleted');
        }
        //respond cordially
        res.status(code).send(toSend);
    }));
    return router;
}
exports.default = UsersRouter;
//# sourceMappingURL=user_router.js.map