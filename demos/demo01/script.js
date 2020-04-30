const app = tcb.init({
    env: 'hjjhjg-cfd2b6'
}) // 填入envid，确保将短信应用授权给TcbRole

tcb.registerExtension(extSms) // 注册SMS扩展

main()

async function main() {
    await loginAnonymously()
    const ticket = await getTicket()
    loginWithTicket(ticket)
}

/**
 * 匿名登录
 */
async function loginAnonymously() {
    const auth = app.auth()
    await auth.signInAnonymously()
    const loginState = await auth.getLoginState()
    console.log('是否为匿名登录:', loginState.isAnonymous) // true
}

/**
 * 发送并且检查验证码，获取Ticket
 * 
 * @return {Promise<string>}
 */
async function getTicket() {
    const phone = window.prompt("请输入您的手机号，将发送验证码到您的手机", "")
    await tcb.invokeExtension(extSms.name, {
        action: 'Send',
        phone
    })

    await sleep(1000) // 等待接受验证码

    const smsCode = window.prompt('请输入接受到的验证码', '')
    const ticket = await tcb.invokeExtension(extSms.name, {
        action: 'Login',
        phone,
        smsCode
    })
    console.log('换取登录密钥成功:', ticket)
    return ticket
}

/**
 * 利用ticket登录，然后检查状态
 * 
 * @param {string} ticket 
 */
async function loginWithTicket(ticket) {
    const auth = app.auth()
    await auth.customAuthProvider()
        .signIn(ticket)
    
    const loginState = await auth.getLoginState()
    console.log('登录成功，当前是否是匿名登录状态：', loginState.isAnonymous)
}

/**
 * @param {number} ms 
 * @return {Promise<void>}
 */
function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(() => resolve(), ms)
    })
}