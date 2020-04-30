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
Object.defineProperty(exports, "__esModule", { value: true });
const functionName = 'tcb-sms-auth';
const ActionType = {
    Login: 'login',
    Send: 'send'
};
exports.name = 'SMS';
function invoke(opts, tcb) {
    return __awaiter(this, void 0, void 0, function* () {
        const { action, phone, smsCode } = opts;
        if (!action || !ActionType[action]) {
            throw new Error('[@cloudbase/extension-sms] action必须为正确的值');
        }
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
        const smsRes = yield callFunction(tcb, {
            name: functionName,
            data: functionData
        });
        if (action === 'Login' && smsRes.code === 'LOGIN_SUCCESS') {
            return smsRes.res;
        }
        if (action === 'Send' && smsRes.code === 'SEND_SUCCESS') {
            return;
        }
        throw new Error(`[@cloudbase/extension-sms] ${smsRes.msg}`);
    });
}
exports.invoke = invoke;
function callFunction(tcb, options) {
    return __awaiter(this, void 0, void 0, function* () {
        let smsRes;
        try {
            smsRes = yield tcb.callFunction(options);
        }
        catch (err) {
            let errMessage = `[@cloudbase/extension-sms] 调用扩展函数失败 ;  ${err.code ? err.code : ''} ${err.message ? err.message : ''}`;
            if (err.message && err.message.indexOf('找不到对应的FunctionName') > -1) {
                throw new Error('[@cloudbase/extension-sms] 请确认扩展已安装');
            }
            if (err.errMsg && err.errMsg.indexOf('找不到对应的FunctionName') > -1) {
                errMessage = '[@cloudbase/extension-sms] 请确认扩展已安装';
            }
            throw new Error(errMessage);
        }
        if (smsRes.code) {
            if (smsRes.message && smsRes.message.indexOf('找不到对应的FunctionName') > -1) {
                throw new Error('[@cloudbase/extension-sms] 请确认扩展已安装');
            }
            throw new Error(`[@cloudbase/extension-sms] 调用扩展函数失败 ;  ${smsRes.requestId ? smsRes.requestId : ''} ; ${smsRes.code} ; ${smsRes.message}`);
        }
        return smsRes.result;
    });
}
