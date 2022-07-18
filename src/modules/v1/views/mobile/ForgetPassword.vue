<template>
    <section class="msdk-forget-password-wrapper" ref="msdk-forget-password-wrapper">
        <section class="msdk-forget-password-title">
            <h2 v-show="show == 1">忘记密码(安全验证)</h2>
            <h2 v-show="show == 2">忘记密码(修改密码)</h2>
        </section>
        <section class="msdk-forget-password-container">
            <section v-show="show == 1" class="msdk-forget-password-yanzheng-container">
                <PhoneInput ref="phone_input"></PhoneInput>
                <CodeInput ref="code_input"></CodeInput>
                <Button :clickHandle="yangZheng" btnClass="msdk-bth-major" text="确认验证"></Button>
            </section>
            <section v-show="show == 2" class="msdk-forget-password-update-container">
                <input type="hidden" name="__token" value="">
                <PasswordInput ref="password_input"></PasswordInput>
                <PasswordInput ref="repeat_password_input" placeholder="确认密码"></PasswordInput>
                <Button :clickHandle="updatePassword" btnClass="msdk-bth-major" text="修改密码"></Button>
            </section>
        </section>
    </section>
</template>
<script>
    import PhoneInput from "@CommonComponents/PhoneInput.vue";
    import PasswordInput from "@CommonComponents/PasswordInput.vue";
    import Button from "@CommonComponents/Button.vue";
    import CodeInput from "@CommonComponents/CodeInput.vue";
    export default{
        name: 'ForgetPassword',
        components: {
            PhoneInput,
            PasswordInput,
            Button,
            CodeInput
        },
        data: function () {
            return {
                show : 1,
            }
        },
        methods: {
            yangZheng: function () {
                let check_phone = this.$refs.phone_input.checkPhoneNumber();
                if (!check_phone) {
                    return false;
                }
                let check_code = this.$refs.code_input.checkCode();
                if(!check_code){
                    return false;
                }
                //验证验证码...
                this.show = 2;
            },
            updatePassword:function () {
                let check_password = this.$refs.password_input.checkPassword();
                if(!check_password){
                    return false;
                }
                if(this.$refs.repeat_password_input.$refs['password_normal_input'].inputValue !== check_password){
                    this.$refs.password_input.$refs['msdk-password-input-wrapper'].querySelector('.msdk-password-input-tips').innerHTML = '输入密码不一致';
                    return false;
                }

                //修改密码,返回登录界面...
                this.$parent.show = 1;
                this.$parent.last_show = 0;
            },
        }
    }
</script>
<style>
    .msdk-forget-password-wrapper h2{
        font-size: 0.6rem;
    }
    .msdk-forget-password-wrapper .msdk-forget-password-title {
        position: relative;
        text-align: center;
        margin-bottom: 0.8rem;
    }

    .msdk-forget-password-wrapper .msdk-forget-password-title i {
        position: absolute;
        left: -16px;
        top: 5px;
        cursor: pointer;
        font-size: 14px;
    }
    .msdk-forget-password-wrapper .msdk-btn-common{
        margin-top: 1rem;
    }
</style>