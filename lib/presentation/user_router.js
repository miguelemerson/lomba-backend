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
        try {
            const user = yield getUser.execute(req.params.id);
            res.status(200).send(new router_response_1.RouterResponse('1.0', user, 'get', { id: req.params.id }, 'geted by id'));
        }
        catch (err) {
            res.status(500).send(new router_response_1.RouterResponse('1.0', err, 'get', { id: req.params.id }, 'not obtained'));
        }
    }));
    router.get('/byorga/:orgaId', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const users = yield getUsersByOrgaId.execute(req.params.orgaId);
            res.status(200).send(new router_response_1.RouterResponse('1.0', users, 'get', { orgaId: req.params.orgaId }, 'geted by orga id'));
        }
        catch (err) {
            res.status(500).send(new router_response_1.RouterResponse('1.0', err, 'get', { orgaId: req.params.orgaId }, 'not obtained by orga id'));
        }
    }));
    router.post('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield addUser.execute(req.body);
            res.status(201).send(new router_response_1.RouterResponse('1.0', user, 'post', undefined, 'new user added'));
        }
        catch (err) {
            res.status(500).send(new router_response_1.RouterResponse('1.0', err, 'post', undefined, 'user was not added'));
        }
    }));
    router.put('/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield updateUser.execute(req.params.id, req.body);
            res.status(201).send(new router_response_1.RouterResponse('1.0', user, 'put', { id: req.params.id }, 'user edited'));
        }
        catch (err) {
            res.status(500).send(new router_response_1.RouterResponse('1.0', err, 'put', { id: req.params.id }, 'user was not edited'));
        }
    }));
    router.put('/enable/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
        const text = (req.query.enable === 'false' ? false : true) ? 'enabled' : 'disabled';
        try {
            const result = yield enableUser.execute(req.params.id, (req.query.enable === 'false' ? false : true));
            res.status(200).send(new router_response_1.RouterResponse('1.0', result, 'put', { id: req.params.id, enable: req.query.enable }, 'user ' + text));
        }
        catch (err) {
            res.status(500).send(new router_response_1.RouterResponse('1.0', err, 'put', { id: req.params.id, enable: req.query.enable }, 'user was not ' + text));
        }
    }));
    router.delete('/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield deleteUser.execute(req.params.id);
            res.status(200).send(new router_response_1.RouterResponse('1.0', result, 'delete', { id: req.params.id }, 'user deleted'));
        }
        catch (err) {
            res.status(500).send(new router_response_1.RouterResponse('1.0', err, 'delete', { id: req.params.id }, 'user was not deleted'));
        }
    }));
    return router;
}
exports.default = UsersRouter;
//# sourceMappingURL=user_router.js.map