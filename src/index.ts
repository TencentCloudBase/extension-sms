const functionName = 'tcb-sms-auth'

const ActionType = {
    Login: 'login',
    Send: 'send'
}

export const name = 'SMS'

export async function invoke(opts, tcb) {
    const { action, phone, smsCode, app } = opts
    if (!action || !ActionType[action]) {
        throw new Error('[@cloudbase/extension-sms] action必须为正确的值')
    }

    let functionData = {}
    if (action === 'Login') {
        if (!app) {
            throw new Error('[@cloudbase/extension-sms] app必须为tcb.init(...)的返回值')
        }
        functionData = {
            cmd: ActionType[action],
            phone,
            smsCode
        }
    } else if (action === 'Send') {
        functionData = {
            cmd: ActionType[action],
            phone
        }
    }

    const smsRes = await callFunction(tcb, {
        name: functionName,
        data: functionData
    })

    if (action === 'Login' && smsRes.code === 'LOGIN_SUCCESS') {
        const auth = app.auth({ persistence: 'local'})
        await auth
            .customAuthProvider()
            .signIn(smsRes.res)
        return
    }

    if (action === 'Send' && smsRes.code === 'SEND_SUCCESS') {
        return
    }

    throw new Error(`[@cloudbase/extension-sms] ${smsRes.msg}`)    
}

async function callFunction(tcb, options) {
    let smsRes
    try {
        smsRes = await tcb.callFunction(options)
    } catch (err) {
        let errMessage = `[@cloudbase/extension-sms] 调用扩展函数失败 ;  ${err.code ? err.code : ''} ${err.message ? err.message : ''}`
        if (err.message && err.message.indexOf('找不到对应的FunctionName') > -1) {
            throw new Error('[@cloudbase/extension-sms] 请确认扩展已安装')
        }

        throw new Error(errMessage)
    }

    if (smsRes.code) {
        if (smsRes.message && smsRes.message.indexOf('找不到对应的FunctionName') > -1) {
            throw new Error('[@cloudbase/extension-sms] 请确认扩展已安装')
        }

        throw new Error(`[@cloudbase/extension-sms] 调用扩展函数失败 ;  ${smsRes.requestId ? smsRes.requestId : ''} ; ${smsRes.code} ; ${smsRes.message}`)
    }
    
    return smsRes.result
}