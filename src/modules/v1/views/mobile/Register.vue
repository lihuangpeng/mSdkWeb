<template>
    <section class="msdk-register-wrapper">
        <h2 class="msdk-register-title">
            <span>注册账号</span>
        </h2>
        <section class="msdk-register-container">
            <PhoneInput ref="phone_input"></PhoneInput>
            <CodeInput ref="code_input"></CodeInput>
            <PasswordInput ref="password_input"></PasswordInput>
            <Button :clickHandle="clickHandle" btnClass="msdk-bth-major" :text="text"></Button>
        </section>
    </section>
</template>
<script>
    import PhoneInput from "@CommonComponents/PhoneInput.vue";
    import PasswordInput from "@CommonComponents/PasswordInput.vue";
    import Button from "@CommonComponents/Button.vue";
    import CodeInput from "@CommonComponents/CodeInput.vue";
    import User from "@CommonAssets/js/api/user.js";
    import Aes from "@CommonAssets/js/encrypt/aes.js";
    export default{
        name: 'Register',
        components: {
            PhoneInput,
            PasswordInput,
            Button,
            CodeInput,
        },
        props:{
            policy:Object
        },
        data:function () {
            return {
                text : '登录',
                disabled : false
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
                let check_code = this.$refs.code_input.checkCode();
                if(!check_code){
                    return false;
                }
                let check_password = this.$refs.password_input.checkPassword();
                if(!check_password){
                    return false;
                }
                this.disabled = true;
                this.text = '注册中...';
                User.phoneRegister(this.$refs.phone_input.areaCode, check_phone, check_code, check_password).then((data) => {
                    data = Aes.decrypt(data, window.msdk_aes_key);
                    data = JSON.parse(data);
                    if (data.code === 200) {
                        window.sdkLogin(data.data);
                    } else {
                        this.disabled = false;
                        this.text = '注册';
                        this.$message.error(data.msg);
                    }
                }).catch((data) => {
                    this.disabled = false;
                    this.text = '注册';
                    this.$message.error('注册接口异常');
                });
            }
        }
    }
</script>
<style scoped>

    .msdk-register-wrapper .msdk-register-title {
        position: relative;
        text-align: center;
        font-size: 0.6rem;
        margin-bottom: 0.5rem;
    }

    .msdk-phone-input-wrapper .msdk-phone-input-tips{
        top: 0 !important;
    }

    .msdk-register-wrapper .msdk-register-title i {
        position: absolute;
        left: -16px;
        top: 5px;
        cursor: pointer;
        font-size: 14px;
    }
    .msdk-code-input-wrapper{
        margin-bottom: 0 !important;
    }

    .msdk-password-input-wrapper{
        margin-bottom: 1rem;
    }

</style>