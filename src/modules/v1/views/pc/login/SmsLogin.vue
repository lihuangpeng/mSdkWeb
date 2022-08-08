<template>
    <section class="msdk-password-login-wrapper">
        <PhoneInput ref="phone_input"></PhoneInput>
        <CodeInput ref="code_input" action="phone_login"></CodeInput>
        <Button :clickHandle="clickHandle" btnClass="msdk-bth-major" :text="text"></Button>
    </section>
</template>
<script>
    import PhoneInput from "@CommonComponents/PhoneInput.vue";
    import CodeInput from "@CommonComponents/CodeInput.vue";
    import Button from "@CommonComponents/Button.vue";
    import Aes from "@CommonAssets/js/encrypt/aes";
    import User from "@CommonAssets/js/api/user";
    export default{
        name: "SmsPassword",
        components: {
            PhoneInput,
            CodeInput,
            Button,
        },
        props:{
            policy:Object
        },
        data: function () {
            return {
                phoneInputValue: '',
                text:'登录',
                disabled:false
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
                if (!check_code) {
                    return false;
                }
                this.disabled = true;
                this.text = '登录中...';
                User.phoneSmsLogin(this.$refs.phone_input.areaCode,check_phone,check_code).then((data) => {
                    data = Aes.decrypt(data,window.msdk_aes_key);
                    data = JSON.parse(data);
                    if(data.code == 200){
                        window.sdkLogin(data.data);
                    }else{
                        this.disabled = false;
                        this.text = '登录';
                        this.$message.error(data.msg);
                    }
                }).catch(() => {
                    this.disabled = false;
                    this.text = '登录';
                    this.$message.error('接口异常');
                })
            },
        },
        mounted: function () {

        },
    }
</script>
<style scoped>
    .msdk-phone-input-wrapper {
        padding-top: 10px;
    }

    .msdk-code-input-wrapper {
        padding-top: 15px;
        margin-bottom: 54px;
    }

    .msdk-password-login-wrapper .field-other {
        display: flex;
        margin-bottom: 30px;
    }
</style>