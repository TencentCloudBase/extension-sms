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
const axios_1 = __importDefault(require("axios"));
const httpPath = '/tcb-ext-sms';
const ActionType = {
    Login: 'login',
    Send: 'send',
    Verify: 'verify'
};
exports.name = 'SMS';
function invoke(opts) {
    return __awaiter(this, void 0, void 0, function* () {
        const { action, phone, smsCode, app, customDomain } = opts;
        if (!action || !ActionType[action]) {
            throw new Error('[@cloudbase/extension-sms] action必须为正确的值');
        }
        if (!app) {
            throw new Error('[@cloudbase/extension-sms] app必须为tcb.init(...)的返回值');
        }
        const url = customDomain ? `${customDomain}${httpPath}` : `https://${app.config.env}.service.tcloudbase.com${httpPath}`;
        let functionData = {};
        if (action === 'Login') {
            functionData = {
                cmd: ActionType[action],
                phone,
                smsCode
            };
        }
        else if (action === 'Send') {
            functionData = {
                cmd: ActionType[action],
                phone
            };
        }
        else if (action === 'Verify') {
            functionData = {
                cmd: ActionType[action],
                phone,
                smsCode
            };
        }
        const axiosOptions = {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'post',
            url,
            data: JSON.stringify(functionData)
        };
        const smsRes = yield callFunction(axiosOptions);
        if (action === 'Login' && smsRes.code === 'LOGIN_SUCCESS') {
            const auth = app.auth({ persistence: 'local' });
            yield auth
                .customAuthProvider()
                .signIn(smsRes.res);
            return;
        }
        if (action === 'Send' && smsRes.code === 'SEND_SUCCESS') {
            return;
        }
        if (action === 'Verify' && smsRes.code === 'SMS_CODE_IS_VALID') {
            return;
        }
        throw new Error(`[@cloudbase/extension-sms] ${smsRes.msg}`);
    });
}
exports.invoke = invoke;
function callFunction(options) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const smsRes = yield axios_1.default(options);
            return smsRes.data;
        }
        catch (err) {
            throw new Error(`[@cloudbase/extension-sms] 调用扩展函数失败 ;  ${err.message}`);
        }
    });
}
