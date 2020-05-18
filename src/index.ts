import axios from 'axios'

const httpPath = '/tcb-ext-sms'

const ActionType = {
    Login: 'login',
    Send: 'send'
}

export const name = 'SMS'

export async function invoke(opts) {
    const { action, phone, smsCode, app, customDomain } = opts
    if (!action || !ActionType[action]) {
        throw new Error('[@cloudbase/extension-sms] action必须为正确的值')
    }

    // tcb实例：
    //  1. 读取config中的envid
    //  2. 在sdk内部进行登录
    if (!app) {
        throw new Error('[@cloudbase/extension-sms] app必须为tcb.init(...)的返回值')
    }

    const url = customDomain ? `${customDomain}${httpPath}` : `https://${app.config.env}.service.tcloudbase.com${httpPath}`

    let functionData = {}
    if (action === 'Login') {
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

    const axiosOptions = {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'post',
        url,
        data: JSON.stringify(functionData)
    }

    const smsRes = await callFunction(axiosOptions)

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

async function callFunction(options) {
    try {
        const smsRes = await axios(options)
        return smsRes.data
    } catch (err) {
        throw new Error(`[@cloudbase/extension-sms] 调用扩展函数失败 ;  ${err.message}`)
    }
}