<template>
    <section class="msdk-password-input-wrapper" ref="msdk-password-input-wrapper">
        <section class="msdk-password-input-tips"></section>
        <NormalInput ref="password_normal_input" :placeholder="placeholder_data" :type="type" wrapperStyle="border-bottom:1px solid #999999">
            <i class="el-icon-view" :style="show_password ? 'color:blue' : ''" @click="showPassword()"></i>
        </NormalInput>
    </section>
</template>
<script>
    import NormalInput from "@CommonComponents/NormalInput.vue";
    export default{
        name: "PasswordInput",
        components: {
            NormalInput
        },
        data: function () {
            return {
                type: 'password',
                show_password:false,
                placeholder_data:'请输入密码'
            }
        },
        props: {
            placeholder:String,
        },
        created: function () {
            if(this.placeholder) this.placeholder_data = this.placeholder;
        },
        methods:{
            showPassword:function () {
                this.show_password = !this.show_password;
                this.type = this.show_password ? 'text' : 'password';
            },
            checkPassword:function () {
                let reg = /^([0-9|A-z|_]){6,20}$/;
                let value = this.$refs.password_normal_input.inputValue;
                if(!(reg.test(value))){
                    this.$refs['msdk-password-input-wrapper'].querySelector('.msdk-password-input-tips').innerHTML = '密码格式不正确';
                    return false;
                }
                this.$refs['msdk-password-input-wrapper'].querySelector('.msdk-password-input-tips').innerHTML = '';
                return value;
            }
        },
        computed: {}
    }
</script>
<style scoped>
    .msdk-password-input-wrapper{
        position: relative;
    }
    .msdk-password-input-tips{
        color: red;
        /*font-size: 12px;*/
        position: absolute;
        top:0;
    }
    .msdk-password-input-wrapper .el-icon-view{
        position: absolute;
        right: 10px;
        top:11px;
        cursor: pointer;
    }
</style>