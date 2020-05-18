# 验证码登录（扩展）

## 安装

方法1: 使用npm：

```
npm install --save @cloudbase/extension-sms@latest
```

方法2: 使用CDN

```html
<script src="//unpkg.com/@cloudbase/extension-sms/built/index.umd.js"></script>
```

## Usage

```js
const extSms = require('@cloudbase/extension-sms')

tcb.init({
    env:'xxx',
});

tcb.registerExtension(extSms)

const res = await tcb.invokeExtension('CloudInfinite',opts)
```

`opts` 包含以下属性

|名称	|类型	| 是否必须	| 说明 |
|--| -- | -- | -- |
| action | String | 是 | 操作类型，支持 Send 和 Login |
| phone | String | 是 | 电话号码 | 
| app | Tcb | 是 | tcb实例 |
| smsCode | String | 否 | 短信验证码，action 为 Login 时需要传入 |
| customDomain | String | 否 | HTTP触发的自定义域名 |

`action`目前包含以下类型

- Send: 发送短信验证码
- Login: 短信验证码登录

## 功能说明

#### 发送短信验证码

```javascript
const app = tcb.init({
    env: '您的环境ID'
});

const opts = {
    action: 'Send',
    app,
    phone: '' // 用户输入的手机号
};

try {
    await tcb.invokeExtension(extSms.name, opts); // 发送短信验证码
    console.log('短信验证码发送成功')
} catch (error) {
    console.log('短信验证码发送失败：', error.message)
}
```

**注意**：前往[短信服务(SMS)](https://console.cloud.tencent.com/smsv2/app-setting)，调整短信发送频率配置

#### 短信验证码登录

```javascript
const app = tcb.init({
    env: '您的环境ID'
});

const opts = {
    action: 'Login',
    app,
    phone: '', // 用户手机号
    smsCode: '', // 接收到的短信验证码
}

try {
    await tcb.invokeExtension(extSms.name, opts); // 正式登录
    console.log('短信验证码登录成功')
} catch (error) {
    console.log('登录失败：', error.message)
}
```