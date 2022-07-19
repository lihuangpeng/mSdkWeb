<template>
    <section class="msdk-password-login-wrapper">
        <PhoneInput ref="phone_input"></PhoneInput>
        <PasswordInput ref="password_input"></PasswordInput>
        <section class="field-other">
            <section><a href="javascript:;" @click="pushRegister()">注册账号</a></section>
            <section><a href="javascript:;" @click="pushForgetPassword()">忘记密码？</a></section>
        </section>
        <Button :clickHandle="clickHandle" btnClass="msdk-bth-major" :text="text"></Button>
    </section>
</template>
<script>
    import PhoneInput from "@CommonComponents/PhoneInput.vue";
    import PasswordInput from "@CommonComponents/PasswordInput.vue";
    import Button from "@CommonComponents/Button.vue";
    import User from "@CommonAssets/js/api/user";
    import Aes from "@CommonAssets/js/encrypt/aes";
    export default{
        name: "PasswordLogin",
        components: {
            PhoneInput,
            PasswordInput,
            Button,
        },
        props:{
            policy:Object,
        },
        data: function () {
            return {
                phoneInputValue: '',
                text:'登录',
                disabled:false,
            }
        },
        methods: {
            clickHandle: function () {
                if(this.disabled){
                    return false;
                }
                if(!this.policy.checked){
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
                if(!check_password){
                    return false;
                }
                this.disabled = true;
                this.text = '登录中...';
                User.phonePasswordLogin(this.$refs.phone_input.areaCode, check_phone, check_password).then((data) => {
                    data = Aes.decrypt(data, window.msdk_aes_key);
                    data = JSON.parse(data);
                    if (data.code === 200) {
                        window.sdkLogin(data.data);
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
            pushRegister:function () {
                this.$router.push('/register');
            },
            pushForgetPassword:function () {
                this.$router.push('/forget_password');
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
        margin-bottom: 30px;
    }

    .msdk-password-login-wrapper .field-other section {
        display: block;
        width: 50%;
        margin-top: 8px;
        font-size: 12px;
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
</style>