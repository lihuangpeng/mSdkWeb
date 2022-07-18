<template>
    <div class="msdk-header">
        <i class="el-icon-arrow-left" @click="back()"></i>
    </div>
</template>
<script>
    export default {
        name: 'Head',
        data: function () {
            return {}
        },
        created: function () {

        },
        methods: {
            back: function () {
                if (Object.hasOwnProperty.call(this.$parent.$refs, 'home') && this.$parent.$refs.home.last_show != 0) {
                    if(this.$parent.$refs.home.show == 5){
                        this.$cookie.delCookie('PC003');
                    }
                    this.$parent.$refs.home.show = this.$parent.$refs.home.last_show;
                    this.$parent.$refs.home.last_show = 0;
                } else {
                    if (window.parent) {
                        window.parent.postMessage(JSON.stringify({
                            'ac': 'close',
                        }), '*');
                    }
                }
            }
        }

    }
</script>

<style scoped>
    .msdk-header {
        position: relative;
        width: 100%;
        padding: 8px 0 0 4px;
        color: #333;
        font-size: 12px;
        cursor: pointer;
    }
</style>