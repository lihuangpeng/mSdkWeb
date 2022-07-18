<template>
    <section class="msdk-other-login-wrapper">
        <section class="msdk-other-login-title">其他方式登录</section>
        <section class="msdk-other-login-container">
            <section class="msdk-other-weixin-login" v-if="open_list.weixin" @click="weixinLogin()"></section>
            <section class="msdk-other-qq-login" @click="qqLogin()" v-if="open_list.qq"></section>
            <section class="msdk-other-weibo-login" v-if="open_list.weibo" @click="weiboLogin()">

            </section>
        </section>
    </section>
</template>
<script>
    import Aes from "@CommonAssets/js/encrypt/aes.js";
    export default{
        name: "OtherLogin",
        props: {
            open: Array,
            policy : Object,
        },
        data: function () {
            return {
                open_list: {
                    weixin: 1,
                    qq: 1,
                    weibo: 1
                },
                sdk_type: 'js',
            }
        },
        created: function () {

        },
        mounted: function () {

        },
        methods: {
            weixinLogin: function () {
                this.$message({
                    'message': '暂不支持微信登录，敬请期待',
                    'type': 'warning'
                });
            },
            weiboLogin: function () {
                console.log(this.policy.checked);
                if(!this.policy.checked){
                    this.$message({
                        'message': '请阅读并勾选页面底部的协议',
                        'type': 'warning'
                    });
                    return false;
                }
                let params = {'rand': (Math.floor(Math.random() * 90000) + 10000) + '' + (new Date).getTime()};
                params.app_id = window.msdk_app_id;
                params.sub_app_id = window.msdk_sub_app_id;
                params.login_type = 4;
                params.callback = window.msdk_callback;
                let state = Aes.encrypt(params, window.msdk_aes_key);
                let query_str = 'response_type=code&client_id=' + process.env.VUE_APP_WEIBO_APP_KEY + '&redirect_uri=http://ithp.top/api/social/callback&state=' + state;
                window.open('https://api.weibo.com/oauth2/authorize?' + query_str, '_blank');
            },
            qqLogin: function () {
                if(!this.policy.checked){
                    this.$message({
                        'message': '请阅读并勾选页面底部的协议',
                        'type': 'warning'
                    });
                    return false;
                }
                let params = {};
                params.app_id = window.msdk_app_id;
                params.sub_app_id = window.msdk_sub_app_id;
                params.login_type = 2;
                params.callback = window.msdk_callback;
                let state = Aes.encrypt(params, window.msdk_aes_key);
                let query_str = 'response_type=code&client_id=' + process.env.VUE_APP_QQ_APP_ID + '&redirect_uri=' + process.env.VUE_APP_QQ_REDIRECT_URI + '&state=' + state;
                window.open('https://graph.qq.com/oauth2.0/authorize?' + query_str, '_blank');
            }
        }
    }
</script>
<style scoped>
    .msdk-other-login-wrapper {
        width: 100%;
    }

    .msdk-other-login-wrapper .msdk-other-login-title {
        text-align: center;
    }

    .msdk-other-login-wrapper .msdk-other-login-container {
        display: flex;
        justify-content: center;
        margin-top: 8px;
    }

    .msdk-other-login-wrapper .msdk-other-login-container > section {
        height: 35px;
        width: 45px;
        margin: 0 10px;
        cursor: pointer;
    }

    .msdk-other-login-wrapper .msdk-other-weixin-login {
        background: url("../assets/images/login-v1.png") no-repeat 52% center;
        background-size: cover;
    }

    .msdk-other-login-wrapper .msdk-other-qq-login {
        background: url("../assets/images/login-v1.png") no-repeat -3% center;
        background-size: cover;
    }

    .msdk-other-login-wrapper .msdk-other-weibo-login {
        background: url("../assets/images/login-v1.png") no-repeat 25% center;
        background-size: cover;
    }
</style>