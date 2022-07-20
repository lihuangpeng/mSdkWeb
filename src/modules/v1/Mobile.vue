<template>
    <section id="msdk-wrapper">
        <section class="msdk-container">
            <Head></Head>
            <section v-if="!show" style="width: 100%;height: 100%;text-align: center;margin-top: 100px;">
                <i class="el-icon-loading" style="font-size: 30px"></i>
            </section>
            <section v-else-if="show === -1" style="text-align: center;margin-top: 86px;">
                <p style="color: red;font-size: 16px;margin-bottom: 10px;">{{error_tips}}</p>
                <i class="el-icon-refresh-right" style="cursor: pointer" @click="refresh()"></i>
            </section>
            <Home ref="home" v-else :init_show="show"></Home>
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
                show: 0,
                error_tips:'',
                allow_message_ac : ['init'],
                timer_id : 0
            }
        },
        created: function () {
            let hash = window.location.hash;
            if(hash){
                hash = hash.substr(1);
                let params = {};
                let param = hash.split('&');
                for (let i=0;i<param.length;i++){
                    if(param[i].indexOf('=') < 0){
                        continue;
                    }
                    param[i] = param[i].split('=');
                    params[param[i][0]] = param[i][1];
                }
                this.initApp(params);

            }else{
                this.$cookie.delCookie('PC003');
                window.addEvent(window, 'message', (event) => {
                    if (typeof event.data !== 'string') return false;
                    try {
                        var data = JSON.parse(event.data);
                    } catch (e) {
                        return false;
                    }
                    if (!Object.hasOwnProperty.call(data, 'ac') || this.allow_message_ac.indexOf(data.ac) < 0) {
                        this.show = -1;
                        this.error_tips = '未知操作方法';
                        return false;
                    }
                    if(!Object.hasOwnProperty.call(data,'params')){
                        this.show = -1;
                        this.error_tips = '参数缺失';
                        return false
                    }
                    if (data.ac === 'init') {
                        //判断app_id 是否合格
                        this.initApp(data.params);
                    }
                });
            }
        },
        methods:{
            refresh : function () {
                window.parent.postMessage(JSON.stringify({
                    'ac': 'refresh',
                }), '*');
            },
            toBindPhone:function () {
                if(this.show === 5){
                    return false;
                }else{
                    let pc003 = this.$cookie.getCookie('PC003');
                    console.log(pc003);
                    if (pc003) {
                        if(this.$refs.home){
                            this.$refs.home.last_show = this.$refs.home.show;
                        }
                        this.show = 5;
                    }
                }
            },
            initApp:function (params) {
                this.show = 0;
                if(this.timer_id){
                    clearInterval(this.timer_id);
                }
                if (!Object.hasOwnProperty.call(params, 'app_key')) {
                    this.show = -1;
                    this.error_tips = '初始化异常，app_key为空';
                    return false;
                }
                let app_key = params.app_key;
                let callback = params.callback;
                App.init(app_key,Rsa.PUBLIC).then((data) =>{
                    data = Rsa.decrypt(data);
                    if(data.code === 200){
                        window.msdk_aes_key = data['data']['secret_key'];
                        window.msdk_sign_key = Aes.encrypt(data['data']['sign_key'],window.msdk_aes_key);
                        window.msdk_app_id = data['data']['app_id'];
                        window.msdk_callback = callback;
                        window.msdk_sub_app_id = Aes.decrypt(app_key,window.msdk_aes_key);
                        this.toBindPhone();
                        if(!this.show) this.show = 1;
                        this.timer = setInterval(() => {
                            this.toBindPhone();
                        }, 1000);
                    }else{
                        this.show = -1;
                        this.error_tips = data.msg;
                    }
                }).catch((data)=>{
                    console.log(data);
                    this.show = -1;
                    this.error_tips = '初始化异常，请刷新重试';
                });
                window.parent.postMessage(JSON.stringify({
                    'ac': 'show',
                }), '*');
            }
        },
        mounted: function () {
            document.getElementsByTagName('html')[0].style.backgroundColor = 'white';
        },
    }
</script>

<style scoped>

</style>
