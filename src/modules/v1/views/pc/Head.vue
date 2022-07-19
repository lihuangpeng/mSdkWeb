<template>
    <div class="msdk-header">
        <div class="msdk-header-logo">
            <img :src="images.logo" style="vertical-align: middle;height: 40px"/>
        </div>
        <span class="el-icon-close" @click="close()">
        </span>
    </div>
</template>
<script>
    export default {
        name: 'Head',
        data: function () {
            return {
                images: {
                    logo: require('@CommonAssets/images/logo.jpg')
                }
            }
        },
        created:function () {

        },
        methods:{
            close:function () {
                if(window.parent){
                    console.log('close');
                    window.parent.postMessage(JSON.stringify({
                        'ac': 'close',
                    }), '*');
                }
            }
        }
    }
</script>

<style>
    .msdk-header{
        position: relative;
        width: 100%;
    }
    .msdk-header-logo{
        padding: 7px 0;
        text-align: center;
        width: 100%;
        height: 100%;
    }
    .el-icon-close{
        position: absolute;
        top: 12px;
        right: 12px;
        cursor: pointer;
        font-size: 20px;
    }

</style>