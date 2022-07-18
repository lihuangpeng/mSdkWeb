<template>
    <section class="msdk-policy-service">
        <el-checkbox v-model="checked"></el-checkbox>
        <span>同意<a href="/static/views/TermsOfServeice.html" target="_blank">《用户协议》</a>和<a href="/static/views/PrivacyPolicy.html" target="_blank">《隐私政策》</a></span>
    </section>
</template>
<script>
    export default{
        name:'PolicyService',
        data:function () {
            return {
                checked:false
            }
        }
    }
</script>
<style scoped>
    .msdk-policy-service {
        line-height: 20px;
        height: 20px;
        font-size: 12px;
        margin: 8px 0 15px;
        text-align: center;
    }

    .msdk-policy-service span {
        padding-left: 5px;
        margin-top: 1px;
    }

    .msdk-policy-service span a {
        text-decoration: none;
        color: #409EFF;
    }

    .msdk-policy-service span a:hover {
        text-decoration: underline;
    }
</style>