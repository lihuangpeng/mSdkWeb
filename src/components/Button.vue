<template>
    <section class="msdk-btn-common">
        <section :class="'msdk-btn-gray ' + btnClass"  @click="click()">
            {{text}}
        </section>
    </section>
</template>
<script>
    export default{
        name: "Button",
        components: {},
        props: {
            clickHandle:Function,
            btnClass:String,
            text:String,
        },
        data: function () {
            return {

            }
        },
        methods:{
            click:function () {
                this.clickHandle();
            }
        }
    }
</script>
<style scoped>
    .msdk-btn-common {
        position: relative;
        width: 100%;
        color: white;
        height: 40px;
        line-height: 40px;
        text-align: center;
    }

    .msdk-btn-common > section {
        border-radius: 4px;
    }

    .msdk-btn-gray {
        background-color: rgba(0, 0, 0, 0.2);
    }

    .msdk-bth-major {
        cursor: pointer;
        background: linear-gradient(90deg, #409EFF 0, #409EAF 100%);
    }
</style>