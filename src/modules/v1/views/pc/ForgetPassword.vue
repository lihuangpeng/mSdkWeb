<template>
    <section class="msdk-forget-password-wrapper" ref="msdk-forget-password-wrapper">
        <section class="msdk-forget-password-title">
            <i class="el-icon-arrow-left" @click="back()">返回</i>
            <span v-show="show == 1">忘记密码(安全验证)</span>
            <span v-show="show == 2">忘记密码(修改密码)</span>
        </section>
        <section class="msdk-forget-password-container">
            <section v-show="show == 1" class="msdk-forget-password-yanzheng-container">
                <PhoneInput ref="phone_input"></PhoneInput>
                <CodeInput ref="code_input" action="forget_password"></CodeInput>
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
    import Aes from "@CommonAssets/js/encrypt/aes";
    import Verify from "@CommonAssets/js/api/verify";
    import User from "@CommonAssets/js/api/user";
    import Config from "@ModuleAssets/js/config.js";
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
                show: 1,
                token: '',
                timer_id : 0
            }
        },
        methods: {
            yangZheng: function () {
                let check_phone = this.$refs.phone_input.checkPhoneNumber();
                if (!check_phone) {
                    return false;
                }
                let check_code = this.$refs.code_input.checkCode();
                if (!check_code) {
                    return false;
                }
                if(this.token){
                    return true;
                }
                Verify.phone(this.$refs.phone_input.areaCode, check_phone, check_code).then((data) => {
                    let aes_key = Aes.decrypt(window.msdk_aes_key,Config.aes_key);
                    data = Aes.decrypt(data, aes_key);
                    data = JSON.parse(data);
                    if (data.code == 200) {
                        //验证验证码...
                        this.$message({
                            'message': data.msg,
                            'type': 'success'
                        });
                        this.token = data.data;
                        this.timer_id = setTimeout(() => {
                            this.token = '';
                        },1000 * 60);
                        this.show = 2;
                    } else {
                        this.$message.error(data.msg);
                    }
                }).catch(()=>{
                    this.$message.error('请求接口异常');
                });
            },
            updatePassword: function () {
                if(!this.token){
                    this.$message({
                        'message': '请先进行安全验证',
                        'type': 'warning'
                    });
                    this.show = 1;
                    return false;
                }
                let check_password = this.$refs.password_input.checkPassword();
                if (!check_password) {
                    return false;
                }
                if (this.$refs.repeat_password_input.$refs['password_normal_input'].inputValue !== check_password) {
                    this.$refs.password_input.$refs['msdk-password-input-wrapper'].querySelector('.msdk-password-input-tips').innerHTML = '输入密码不一致';
                    return false;
                }
                //修改密码,返回登录界面
                User.forgetPassword(this.token,check_password,this.$refs.repeat_password_input.$refs['password_normal_input'].inputValue).then((data)=>{
                    let aes_key = Aes.decrypt(window.msdk_aes_key,Config.aes_key);
                    data = Aes.decrypt(data, aes_key);
                    data = JSON.parse(data);
                    if (data.code == 200) {
                        this.$message({
                            'message': data.msg,
                            'type': 'success'
                        });
                        clearTimeout(this.timer_id);
                        this.token = '';
                        this.$router.push('/');
                    } else {
                        this.$message.error(data.msg);
                    }
                }).catch(()=>{
                    this.$message.error('请求接口异常');
                });
            },
            back: function () {
                if (this.show == 1) {
                    window.history.go(-1);
                } else {
                    this.show = 1;
                }
            }
        }
    }
</script>
<style>
    .msdk-forget-password-wrapper {
        margin-top: 20px;
    }

    .msdk-forget-password-wrapper .msdk-forget-password-title {
        position: relative;
        text-align: center;
        margin-bottom: 30px;
    }

    .msdk-forget-password-wrapper .msdk-forget-password-title i {
        position: absolute;
        left: -16px;
        top: 5px;
        cursor: pointer;
        font-size: 14px;
    }

    .msdk-forget-password-wrapper .msdk-forget-password-yanzheng-container > section, .msdk-forget-password-wrapper .msdk-forget-password-update-container > section {
        margin: 20px 0;
    }

    .msdk-forget-password-wrapper .msdk-phone-input-tips, .msdk-forget-password-wrapper .msdk-code-input-tips, .msdk-forget-password-wrapper .msdk-password-input-tips {
        top: -17px !important;
    }
</style>