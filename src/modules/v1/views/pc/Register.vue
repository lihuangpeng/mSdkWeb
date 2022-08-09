<template>
    <section class="msdk-register-wrapper">
        <section class="msdk-register-title">
            <i class="el-icon-arrow-left" @click="back()">返回</i>
            <span>注册账号</span>
        </section>
        <section class="msdk-register-container">
            <PhoneInput ref="phone_input"></PhoneInput>
            <CodeInput ref="code_input" action="phone_register"></CodeInput>
            <PasswordInput ref="password_input"></PasswordInput>
            <Button :clickHandle="clickHandle" btnClass="msdk-bth-major" :text="text"></Button>
            <PolicyService ref="policy_service"></PolicyService>
        </section>
    </section>
</template>
<script>
    import PhoneInput from "@CommonComponents/PhoneInput.vue";
    import PasswordInput from "@CommonComponents/PasswordInput.vue";
    import Button from "@CommonComponents/Button.vue";
    import CodeInput from "@CommonComponents/CodeInput.vue";
    import PolicyService from "@CommonComponents/PolicyService.vue";
    import User from "@CommonAssets/js/api/user";
    import Aes from "@CommonAssets/js/encrypt/aes";
    import Config from "@ModuleAssets/js/config.js";
    export default{
        name: 'Register',
        components: {
            PhoneInput,
            PasswordInput,
            Button,
            CodeInput,
            PolicyService
        },
        data: function () {
            return {
                text: '注册',
                disabled: false
            }
        },
        methods: {
            clickHandle: function () {
                if(this.disabled){
                    return false;
                }
                let check_phone = this.$refs.phone_input.checkPhoneNumber();
                if (!check_phone) {
                    return false;
                }
                let check_code = this.$refs.code_input.checkCode();
                if (!check_code) {
                    return false;
                }
                let check_password = this.$refs.password_input.checkPassword();
                if (!check_password) {
                    return false;
                }
                if (!this.$refs.policy_service.checked) {
                    this.$message({
                        'message': '请阅读并勾选页面底部的协议',
                        'type': 'warning'
                    });
                    return false;
                }
                this.disabled = true;
                this.text = '注册中...';
                User.phoneRegister(this.$refs.phone_input.areaCode, check_phone, check_code, check_password).then((data) => {
                    let aes_key = Aes.decrypt(window.msdk_aes_key,Config.aes_key);
                    data = Aes.decrypt(data, aes_key);
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
            },
            back: function () {
                window.history.go(-1);
            }
        }
    }
</script>
<style>
    .msdk-register-container > section {
        margin: 20px 0;
    }

    .msdk-register-wrapper .msdk-register-title {
        position: relative;
        text-align: center;
    }

    .msdk-register-wrapper .msdk-register-title i {
        position: absolute;
        left: -16px;
        top: 5px;
        cursor: pointer;
        font-size: 14px;
    }

    .msdk-code-input-wrapper {
        margin-bottom: 0;
    }

    .msdk-register-wrapper .msdk-phone-input-tips, .msdk-register-wrapper .msdk-code-input-tips, .msdk-register-wrapper .msdk-password-input-tips {
        top: -7px !important;
    }

</style>