<template>
    <section class="msdk-login-wrapper">
        <el-tabs v-model="activeTab" class="msdk-tabs">
            <el-tab-pane :label="item.label" :name="item.name" v-for="(item,index) in tab_list" :key="index">
                <PasswordLogin v-if="item.name == 'passwordLogin'" :policy="policy"></PasswordLogin>
                <SmsLogin v-else-if="item.name == 'smsLogin'" :policy="policy"></SmsLogin>
            </el-tab-pane>
        </el-tabs>
        <PolicyService ref="policy_service"></PolicyService>
        <OtherLogin :policy="policy"></OtherLogin>
    </section>
</template>

<script>
    import PolicyService from "@CommonComponents/PolicyService.vue";
    import OtherLogin from "@CommonComponents/OtherLogin.vue";
    export default {
        name: "Login",
        components: {
            PasswordLogin: () => import("@ModuleViews/pc/login/PasswordLogin.vue"),
            SmsLogin: () => import("@ModuleViews/pc/login/SmsLogin.vue"),
            OtherLogin,
            PolicyService
        },
        data: function () {
            return {
                tab_list: [
                    {
                        name: 'passwordLogin', 'label': '密码登录'
                    },
                    {
                        name: 'smsLogin', 'label': '短信登录'
                    },
                ],
                activeTabName: 'passwordLogin',
                policy: {},
            }
        },
        mounted: function () {
            this.policy = this.$refs.policy_service;
            this.$nextTick(() => {
                this.initTabWidth();
            });
        },
        methods: {
            initTabWidth: function () {
                let obj = document.querySelector(".msdk-tabs");
                let tabs = document.querySelector('.el-tabs__nav');
                if (tabs.clientWidth > obj.clientWidth) {
                    return false;
                }
                tabs.style.left = (obj.clientWidth - tabs.clientWidth ) / 2 + "px";
            }
        },
        computed: {
            activeTab: {
                get: function () {
                    return this.activeTabName;
                },
                set: function (value) {
                    this.activeTabName = value;
                }
            }
        }
    }
</script>

<style>
    .mblog-tabs {
        width: 100%;
    }

    .el-tabs__nav {
        width: auto;
    }

    .el-tabs__item {
        font-size: 16px;
    }
    .el-tabs__content{
        overflow:visible ;
    }
</style>