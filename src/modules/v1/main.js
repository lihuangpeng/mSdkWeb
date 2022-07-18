import Vue from 'vue';
import Mobile from "./Mobile.vue";
import PC from "./PC.vue";
import router from './router/index';
import "@CommonAssets/js/element";
import axios from "@CommonAssets/js/axios";
import cookie from "@CommonAssets/js/cookie";
import "@CommonAssets/js/func.js";
Vue.prototype.$axios = axios
Vue.prototype.$cookie = cookie
Vue.config.productionTip = false
let App;
if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)){
    import("lib-flexible/flexible")
    import("@CommonAssets/css/mobile_v1.css")
    App = Mobile;
}else{
    App = PC;
}

new Vue({
    router,
    render: h => h(App),
}).$mount('#app')
