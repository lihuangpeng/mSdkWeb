<template>
    <section class="msdk-code-input-wrapper" ref="msdk-code-input-wrapper">
        <section class="msdk-code-input-tips"></section>
        <NormalInput ref="code_normal_input" placeholder="请输入验证码" :type="type"
                     wrapperStyle="border-bottom:1px solid #999999">
            <a href="javascript:;" @click="getCode()">{{desc}}</a>
        </NormalInput>
    </section>
</template>
<script>
    import NormalInput from "@CommonComponents/NormalInput.vue";
    import User from "@CommonAssets/js/api/user";
    import Aes from "@CommonAssets/js/encrypt/aes.js";
    export default{
        name: "CodeInput",
        components: {
            NormalInput
        },
        data: function () {
            return {
                type: 'text',
                time: '获取验证码',
                max_time: 5 * 60,
                bind_phone_input: 'phone_input',
            }
        },
        props: {
            phone_input_ref: String,
            interval: Number,
            action: String,
        },
        created: function () {
            if (this.phone_input_ref) this.bind_phone_input = this.phone_input_ref;
            if (this.interval) this.max_time = this.interval;
        },
        methods: {
            getCode: function () {
                let phone = this.$parent.$refs[this.bind_phone_input].checkPhoneNumber();
                if (!phone) {
                    return false;
                }
                if (this.time > 0) {
                    return false
                }
                let phone_ref = this.$parent.$refs[this.bind_phone_input];
                User.sendSmsCode(phone_ref.areaCode, phone, this.action).then((data) => {
                    //请求验证码
                    data = Aes.decrypt(data, window.msdk_aes_key);
                    data = JSON.parse(data);
                    if (data.code === 200) {
                        let obj = this.$refs['msdk-code-input-wrapper'].getElementsByTagName('a')[0];
                        obj.setAttribute('class', 'disabled');
                        this.time = this.max_time;
                        let timer_id = setInterval(() => {
                            this.time--;
                            if (this.time === 0) {
                                clearInterval(timer_id);
                                this.time = '获取验证码';
                                obj.setAttribute('class', '');
                            }
                        }, 1000);
                        this.$message({
                            message: data.msg,
                            type: 'success'
                        });
                    } else {
                        this.$message.error(data.msg);
                    }
                }).catch((data) => {
                    this.$message.error('发送接口异常');
                });
            },
            checkCode(){
                let value = this.$refs.code_normal_input.inputValue;
                if (!value) {
                    this.$refs['msdk-code-input-wrapper'].querySelector('.msdk-code-input-tips').innerHTML = '验证码不能为空';
                    return false;
                }
                this.$refs['msdk-code-input-wrapper'].querySelector('.msdk-code-input-tips').innerHTML = '';
                return value;
            }
        },
        computed: {
            desc: {
                get: function () {
                    if (this.time > 0) {
                        return '重新获取验证码(' + this.time + '秒)';
                    }
                    return this.time
                },
                set: function () {

                }
            }
        }
    }
</script>
<style scoped>
    .msdk-code-input-wrapper {
        position: relative;
    }

    .msdk-code-input-wrapper a {
        text-decoration: none;
        position: absolute;
        top: 8px;
        right: 0;
        font-size: 12px;
        color: #409EFF;
    }

    .msdk-code-input-wrapper a.disabled {
        cursor: no-drop;
        color: #999999;
    }

    .msdk-code-input-wrapper .msdk-code-input-tips {
        color: red;
        position: absolute;
        top: 0px;
        font-size: 12px;
    }
</style>