import VueRouter  from "vue-router";
import Vue from "vue";
Vue.use(VueRouter);
// 判断平台
let platform;
if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
    platform = 'mobile';
} else {
    platform = 'pc';
}

const routes = [
    {
        path: '/', name: platform == 'mobile' ? 'Home' : 'Login', component: function () {
            if(platform == 'mobile'){
                return import("../views/"+platform+'/Home.vue')
            }else{
                return import("../views/"+platform+'/Login.vue')
            }

        }
    },
    {
        path: '/register', name: 'Register', component: function () {
        return import("../views/"+platform+'/Register.vue')
    }
    },
    {
        path: '/forget_password', name: 'ForgetPassword', component: function () {
        return import("../views/"+platform+'/ForgetPassword.vue')
    }
    },
    {
        path: '/bind_phone', name: 'BindPhone', component: function () {
        return import("../views/" + platform + '/BindPhone.vue')
    }
    },
    {
        path: '*', redirect: "/"
    }
];

var router = new VueRouter({
    mode : 'history',
    routes
});

export default router;