<template>
    <section class="msdk-login-wrapper">
        <PasswordLogin v-show="show == 1" :policy="policy"></PasswordLogin>
        <SmsLogin v-show="show == 2" :policy="policy"></SmsLogin>
        <Register v-show="show == 3" :policy="policy"></Register>
        <ForgetPassword v-if="show == 4"></ForgetPassword>
        <BindPhone v-if="show == 5" :policy="policy"></BindPhone>
        <PolicyService v-show="show!=4" ref="policy_service"></PolicyService>
        <OtherLogin v-if="show == 2 || show == 1" :policy="policy" type="H5"></OtherLogin>
    </section>
</template>

<script>
    import PolicyService from "@CommonComponents/PolicyService.vue";
    export default {
        name: "Login",
        components: {
            PasswordLogin: () => import("@ModuleViews/mobile/login/PasswordLogin.vue"),
            SmsLogin: () => import("@ModuleViews/mobile/login/SmsLogin.vue"),
            Register: () => import("@ModuleViews/mobile/Register.vue"),
            ForgetPassword: () => import("@ModuleViews/mobile/ForgetPassword.vue"),
            OtherLogin: () => import("@CommonComponents/OtherLogin.vue"),
            BindPhone: () => import('@ModuleViews/mobile/BindPhone.vue'),
            PolicyService
        },
        data: function () {
            return {
                show: 1,
                last_show: 0,
                policy: {},
            }
        },
        mounted: function () {
            this.policy = this.$refs.policy_service;
        },
        methods: {},
        computed: {}
    }
</script>

<style scoped>
    .msdk-login-wrapper {
        width: 80%;
        margin: auto;
    }
</style>