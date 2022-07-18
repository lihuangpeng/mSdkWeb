<template>
    <section id="msdk-wrapper">
        <section class="msdk-container">
            <Head></Head>
            <section v-if="!show" style="width: 100%;height: 100%;text-align: center;margin-top: 100px;">
                <i class="el-icon-loading" style="font-size: 30px"></i>
            </section>
            <Home ref="home" v-if="show == 1"></Home>
            <section v-else-if="show == 2" style="text-align: center;margin-top: 86px;">
                <p style="color: red;font-size: 16px;margin-bottom: 10px;">{{error_tips}}</p>
                <i class="el-icon-refresh-right" style="cursor: pointer" @click="refresh()"></i>
            </section>
        </section>
    </section>
</template>

<script>
    import Head from "@ModuleViews/mobile/Head.vue";
    import Home from "@ModuleViews/mobile/Home.vue";
    import App from "@CommonAssets/js/api/app.js";
    import Rsa from "@CommonAssets/js/encrypt/rsa.js";
    import Aes from "@CommonAssets/js/encrypt/aes.js";

    export default{
        name: "Mobile",
        components: {
            Head,
            Home
        },
        data: function () {
            return {
                show: false,
                error_tips:'',
                allow_message_ac : ['init']
            }
        },
        created: function () {
            this.$cookie.delCookie('PC003');
            setInterval(() => {
                let pc003 = this.$cookie.getCookie('PC003');
                if (pc003 && this.$refs.home.show  !== 5) {
                    this.$refs.home.last_show = this.$refs.home.show;
                    this.$refs.home.show = 5;
                }
            }, 1000);
        },
        methods:{
            refresh : function () {
                window.parent.postMessage(JSON.stringify({
                    'ac': 'refresh',
                }), '*');
            }
        },
        mounted: function () {
            window.addEvent(window, 'message', (event) => {
                if (typeof event.data != 'string') return false;
                try {
                    var data = JSON.parse(event.data);
                } catch (e) {
                    return false;
                }
                if (data.ac === 'init') {
                    //判断app_id 是否合格
                    this.show = false;
                    if (!Object.hasOwnProperty.call(data.params, 'app_key')) {
                        this.show = 2;
                        this.error_tips = '初始化异常，app_key为空';
                        return false;
                    }
                    if (!Object.hasOwnProperty.call(data, 'ac') || this.allow_message_ac.indexOf(data.ac) < 0) {
                        this.show = 2;
                        this.error_tips = '初始化异常，操作方法错误';
                        return false;
                    }
                    let app_key = data.params.app_key;
                    let callback = data.params.callback;
                    App.init(app_key,Rsa.PUBLIC).then((data) =>{
                        data = Rsa.decrypt(data);
                        if(data.code === 200){
                            window.msdk_aes_key = data['data']['secret_key'];
                            window.msdk_sign_key = Aes.encrypt(data['data']['sign_key'],window.msdk_aes_key);
                            window.msdk_app_id = data['data']['app_id'];
                            window.msdk_callback = callback;
                            window.msdk_sub_app_id = Aes.decrypt(app_key,window.msdk_aes_key);
                            this.show = 1;
                        }else{
                            this.show = 2;
                            this.error_tips = data.msg;
                        }
                    }).catch((data)=>{
                        this.show = 2;
                        this.error_tips = '初始化异常，app_key错误';
                    });
                    window.parent.postMessage(JSON.stringify({
                        'ac': 'show',
                    }), '*');
                }
            });
            document.getElementsByTagName('html')[0].style.backgroundColor = 'white';
        },
    }
</script>

<style scoped>

</style>
