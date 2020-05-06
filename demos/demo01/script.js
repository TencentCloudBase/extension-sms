const app = tcb.init({
    env: 'hjjhjg-cfd2b6'
}) // 填入envid，确保将短信应用授权给TcbRole

tcb.registerExtension(extSms) // 注册SMS扩展

main()

async function main() {
    const loginState = app.auth().hasLoginState()
    if (loginState && !loginState.isAnonymous) {
        return console.log('🚧目前已正式登录，请清空本地缓存数据，刷新页面')
    }
    await loginAnonymously()
    await loginWithSms()
}

/**
 * 匿名登录
 * 注意：调试时请打开匿名登录，之后扩展能力正式上线后，无需匿名登录也可调用云函数发送验证码
 */
async function loginAnonymously() {
    const auth = app.auth()
    await auth.signInAnonymously()
    const loginState = await auth.getLoginState()
    console.log('📌是否为匿名登录:', loginState.isAnonymous) // true
}

/**
 * 短信验证码登录
 */
async function loginWithSms() {
    const phone = window.prompt("请输入您的手机号，将发送验证码到您的手机", "")
    await tcb.invokeExtension(extSms.name, {
        action: 'Send',
        phone
    })

    console.log('💬短信已发送，请注意查看')
    await sleep(1000) // 等待接受验证码

    const smsCode = window.prompt('请输入接受到的验证码', '')
    await tcb.invokeExtension(extSms.name, {
        action: 'Login',
        app,
        phone,
        smsCode
    })
    console.log('✅登录成功')
    
    const loginState = await app.auth().getLoginState()
    console.log('📌是否为匿名登录:', loginState.isAnonymous) // false
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