<template>
    <section class="msdk-password-login-wrapper">
        <h2 class="msdk-password-login-title" style="text-align: center">
            账号登录
        </h2>
        <section class="msdk-password-input-container">
            <PhoneInput ref="phone_input"></PhoneInput>
            <PasswordInput ref="password_input"></PasswordInput>
            <section class="field-other">
                <section><a href="javascript:;" @click="pushSmsLogin()">短信登录</a> | <a href="javascript:;"
                                                                                      @click="pushRegister()">注册账号</a>
                </section>
                <section><a href="javascript:;" @click="pushForgetPassword()">忘记密码？</a></section>
            </section>
            <Button :clickHandle="clickHandle" btnClass="msdk-bth-major" :text="text"></Button>
        </section>
    </section>
</template>
<script>
    import PhoneInput from "@CommonComponents/PhoneInput.vue";
    import PasswordInput from "@CommonComponents/PasswordInput.vue";
    import Button from "@CommonComponents/Button.vue";
    import User from "@CommonAssets/js/api/user.js";
    import Aes from "@CommonAssets/js/encrypt/aes.js";
    export default{
        name: "PasswordLogin",
        components: {
            PhoneInput,
            PasswordInput,
            Button,
        },
        props: {
            policy: Object
        },
        data: function () {
            return {
                phoneInputValue: '',
                disabled: false,
                text:'登录'
            }
        },
        methods: {
            clickHandle: function () {
                if(this.disabled){
                    return false;
                }
                if (!this.policy.checked) {
                    this.$message({
                        'message': '请阅读并勾选页面底部的协议',
                        'type': 'warning'
                    });
                    return false;
                }
                let check_phone = this.$refs.phone_input.checkPhoneNumber();
                if (!check_phone) {
                    return false;
                }
                let check_password = this.$refs.password_input.checkPassword();
                if (!check_password) {
                    return false;
                }
                this.disabled = true;
                this.text = '登录中...';
                User.phonePasswordLogin(this.$refs.phone_input.areaCode, check_phone, check_password).then((data) => {
                    data = Aes.decrypt(data, window.msdk_aes_key);
                    data = JSON.parse(data);
                    if (data.code === 200) {
                        window.parent.postMessage(JSON.stringify({
                            'ac': 'login',
                            'params': {access_code: data.data},
                        }), '*');
                    } else {
                        this.disabled = false;
                        this.text = '登录';
                        this.$message.error(data.msg);
                    }
                }).catch((data) => {
                    this.disabled = false;
                    this.text = '登录';
                    this.$message.error('请求异常,请重试');
                });
            },
            pushSmsLogin: function () {
                this.$parent.last_show = this.$parent.show;
                this.$parent.show = 2;
            },
            pushRegister: function () {
                this.$parent.last_show = this.$parent.show;
                this.$parent.show = 3;
            },
            pushForgetPassword: function () {
                this.$parent.last_show = this.$parent.show;
                this.$parent.show = 4;
            }
        },
        mounted: function () {

        },
    }
</script>
<style scoped>
    .msdk-phone-input-wrapper {
        padding-top: 10px;
    }

    .msdk-password-input-wrapper {
        padding-top: 15px;
    }

    .msdk-password-login-wrapper .field-other {
        display: flex;
        margin-bottom: 1rem;
    }

    .msdk-password-login-wrapper .field-other section {
        display: block;
        width: 50%;
        margin-top: 8px;
        font-size: 6px;
    }

    .msdk-password-login-wrapper .field-other section a {
        text-decoration: none;
        color: black;
    }

    .msdk-password-login-wrapper .field-other section a:hover {
        color: #409EFF;
    }

    .msdk-password-login-wrapper .field-other section:nth-child(2) {
        text-align: right;
    }

    h2 {
        font-size: 0.6rem;
    }
</style>