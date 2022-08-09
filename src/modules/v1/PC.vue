<template>
    <section id="msdk-wrapper">
        <section class="msdk-container" ref="msdk-container">
            <Head></Head>
            <section v-if="!show" style="width: 100%;height: 100%;text-align: center;margin-top: 100px;">
                <i class="el-icon-loading" style="font-size: 30px"></i>
            </section>
            <section v-else-if="show == -1" style="text-align: center;margin-top: 86px;">
                <p style="color: red;font-size: 16px;margin-bottom: 10px;">{{error_tips}}</p>
                <i class="el-icon-refresh-right" style="cursor: pointer" @click="refresh()"></i>
            </section>
            <section v-else class="msdk-content">
                <router-view id="view"></router-view>
            </section>
        </section>
    </section>
</template>

<script>
    import Head from "@ModuleViews/pc/Head.vue";
    import App from "@CommonAssets/js/api/app.js";
    import Rsa from "@CommonAssets/js/encrypt/rsa.js";
    import Aes from "@CommonAssets/js/encrypt/aes.js";
    import Config from "@ModuleAssets/js/config.js";

    export default{
        name: "PC",
        components: {
            Head
        },
        data: function () {
            return {
                show: false,
                error_tips: '111',
                allow_message_ac: ['init']
            }
        },
        methods: {
            initWidthHeight: function () {
                let obj = this.$refs['msdk-container'];
                let width = obj.clientWidth;
                let height = obj.clientHeight;
                let bodyWidth = window.innerWidth;
                let bodyHeight = window.innerHeight;
                obj.style.top = (bodyHeight - height) / 2 + "px";
                obj.style.left = (bodyWidth - width) / 2 + "px";
            },
            refresh: function () {
                window.parent.postMessage(JSON.stringify({
                    'ac': 'refresh',
                }), '*');
            }
        },
        created: function () {
            let resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
            window.addEventListener(resizeEvt, () => {
                this.initWidthHeight();
            });
            this.$cookie.delCookie('PC003');
            setInterval(() => {
                let pc003 = this.$cookie.getCookie('PC003');
                if (pc003 && this.$route.path !== '/bind_phone') {
                    this.$router.push('/bind_phone');
                }
            }, 1000);
        },
        mounted: function () {
            window.addEvent(window, 'message', (event) => {
                if (typeof event.data !== 'string') return false;
                try {
                    var data = JSON.parse(event.data);
                } catch (e) {
                    return false;
                }
                if (data.ac === 'init') {
                    this.show = false;
                    if (!Object.hasOwnProperty.call(data.params, 'app_key')) {
                        this.show = -1;
                        this.error_tips = '初始化异常，app_key为空';
                        return false;
                    }
                    if (!Object.hasOwnProperty.call(data, 'ac') || this.allow_message_ac.indexOf(data.ac) < 0) {
                        this.show = -1;
                        this.error_tips = '初始化异常，操作方法错误';
                        return false;
                    }
                    //判断app_id 是否合格
                    let app_key = data.params.app_key;
                    let callback = data.params.callback;
                    App.init(data.params.app_key, Rsa.PUBLIC).then((data) => {
                        data = Rsa.decrypt(data);
                        if (data.code === 200) {
                            let secret_key = data['data']['secret_key'];
                            let sign_key = data['data']['sign_key'];
                            window.msdk_aes_key = Aes.encrypt(secret_key,Config.aes_key);
                            window.msdk_sign_key = Aes.encrypt(sign_key, secret_key);
                            window.msdk_app_id = data['data']['app_id'];
                            window.msdk_callback = callback;
                            window.msdk_sub_app_id = Aes.decrypt(app_key, secret_key);
                            this.show = 1;
                        } else {
                            this.show = -1;
                            this.error_tips = data.msg;
                        }
                    }).catch((data) => {
                        this.show = -1;
                        this.error_tips = '请求接口异常';
                    });
                    window.parent.postMessage(JSON.stringify({
                        'ac': 'show',
                    }), '*');
                }
            });
            this.initWidthHeight();
        },
    }
</script>

<style scoped>
    #msdk-wrapper {
        /*background-color: rgb(0, 0, 0);*/
        /*opacity: 0.5;*/
        position: fixed;
        width: 100%;
        height: 100%;
    }

    .msdk-container {
        height: 420px;
        width: 340px;
        box-shadow: 0 0 0 1px #d8d8d8 inset;
        background-color: white;
        border-radius: 5px;
        position: fixed;
        z-index: 9999;
        top: 0;
        left: 0;
    }

    .msdk-content {
        margin: 0 auto;
        width: 90%;
    }
</style>
