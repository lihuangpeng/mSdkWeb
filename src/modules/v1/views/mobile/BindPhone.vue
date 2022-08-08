<template>
    <section class="msdk-bind-phone-wrapper" ref="msdk-bind-phone-wrapper">
        <section class="msdk-bind-phone-title">
            <span>绑定手机号</span>
        </section>
        <section style="font-size: 12px;text-align: center;margin-bottom: 20px;">
            为了你的账户安全，请绑定一个手机号(请确认是否是你本人操作)
        </section>
        <section class="msdk-bind-phone-container">
            <PhoneInput ref="phone_input"></PhoneInput>
            <CodeInput ref="code_input" action="bind_phone"></CodeInput>
            <Button :clickHandle="bindPhone" btnClass="msdk-bth-major" :text="text"></Button>
        </section>
    </section>
</template>
<script>
    import PhoneInput from "@CommonComponents/PhoneInput.vue";
    import Button from "@CommonComponents/Button.vue";
    import PolicyService from "@CommonComponents/PolicyService"
    import CodeInput from "@CommonComponents/CodeInput.vue";
    import Aes from "@CommonAssets/js/encrypt/aes";
    import User from "@CommonAssets/js/api/user";
    export default{
        name: 'BindPhone',
        components: {
            PhoneInput,
            Button,
            CodeInput,
            PolicyService
        },
        props:{
            policy:Object
        },
        data: function () {
            return {
                token: '',
                disabled:false,
                text:'确认绑定',
            }
        },
        create:function () {},
        mounted:function () {},
        methods: {
            bindPhone: function () {
                if(this.disabled){
                    return false;
                }
                this.token = this.$cookie.getCookie('PC003');
                if(!this.token){
                    this.back();
                    this.$message.error('请先进行登录');
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
                //绑定手机号
                this.disabled = true;
                this.text = '绑定中...';
                User.bindPhone(this.token,this.$refs.phone_input.areaCode,check_phone,check_code).then((data)=>{
                    data = Aes.decrypt(data, window.msdk_aes_key);
                    data = JSON.parse(data);
                    if(data.code === 200){
                        window.parent.postMessage(JSON.stringify({
                            'ac': 'login',
                            'params': {access_code: data.data},
                        }), '*');
                    }else{
                        this.disabled = false;
                        this.text = '确认绑定';
                        this.$message.error(data.msg);
                    }
                }).catch(()=>{
                    this.disabled = false;
                    this.text = '确认绑定';
                    this.$message.error('接口异常');
                });
            },
            back: function () {
                this.$cookie.delCookie('PC003');
                window.history.go(-1);
            }
        }
    }
</script>
<style>
    .msdk-bind-phone-title span{
        font-size: 0.6rem;
        font-weight: bold;
    }

    .msdk-bind-phone-wrapper .msdk-bind-phone-title {
        position: relative;
        text-align: center;
        margin-bottom: 15px;
    }

    .msdk-bind-phone-wrapper .msdk-bind-phone-title i {
        position: absolute;
        left: -16px;
        top: 5px;
        cursor: pointer;
        font-size: 14px;
    }

    .msdk-bind-phone-wrapper .msdk-bind-phone-yanzheng-container > section, .msdk-bind-phone-wrapper .msdk-bind-phone-update-container > section {
        margin: 20px 0;
    }

    .msdk-bind-phone-wrapper .msdk-phone-input-tips{
        top: -5px !important;
    }
    .msdk-bind-phone-wrapper .msdk-code-input-tips{
        top: 0px !important;
    }
</style>