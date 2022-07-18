<template>
    <section class="msdk-phone-input-wrapper" ref="msdk-phone-input-wrapper" style=" border-bottom: 1px solid #999999;">
        <section class="msdk-phone-input-tips"></section>
        <section class="msdk-phone-area">
            <section class="msdk-phone-area-selected" v-on:click="show">
                <input type="hidden" name="area_code" v-model="areaCode">
                <span>{{areaName}} +{{areaCode}}</span>
                <i class="el-icon-arrow-down"></i>
            </section>
            <section v-show="showOption" class="msdk-phone-area-option" v-on:mouseleave="show(false)">
                <ul>
                    <li v-for="(area,areaInfo) in areaCodeList" :key="areaInfo" :item="area" v-on:click="select(area)">
                        {{area.name}} + {{area.code}}
                    </li>
                </ul>
            </section>
        </section>
        <section style="width: 1%" class="msdk-phone-input-fenge"> | </section>
        <section class="msdk-phone-input">
            <NormalInput ref="phone_normal_input" placeholder="请输入手机号" type="text" wrapperStyle="padding-left:15px;"></NormalInput>
        </section>
    </section>

</template>
<script>
    import areaCodeList from "@/assets/js/areaCode.js";
    import NormalInput from "@CommonComponents/NormalInput.vue";
    export default {
        name: "PhoneInput",
        components: {
            NormalInput
        },
        data: function () {
            return {
                areaCode: '',
                areaName: '',
                showOption: false,
                areaCodeList:[],
            }
        },
        created:function () {
            this.areaCodeList = areaCodeList;
            if(!this.areaCode){
                let info = areaCodeList.CN;
                this.areaCode = info.code;
                this.areaName = info.name;
            }
        },
        methods: {
            select: function (area) {
                this.showOption = false;
                this.areaCode = area.code;
                this.areaName = area.name;
                this.$refs['msdk-phone-input-wrapper'].querySelector(".msdk-phone-area-selected").getElementsByTagName('span')[0].innerHTML = this.areaName + " +"+this.areaCode;
            },
            show: function (value) {
                if(typeof value !== "boolean") this.showOption = !this.showOption;
                else this.showOption = value;
            },
            checkPhoneNumber:function () {
                let value = this.$refs.phone_normal_input.inputValue;
                if(!(/^1[3456789]\d{9}$/.test(value))){
                    this.$refs['msdk-phone-input-wrapper'].querySelector('.msdk-phone-input-tips').innerHTML = '手机号格式不正确';
                    return false;
                }
                this.$refs['msdk-phone-input-wrapper'].querySelector('.msdk-phone-input-tips').innerHTML = '';
                return value;
            },
        }

    }
</script>
<style scoped>
    .msdk-phone-input-wrapper{
        position: relative;
        display: flex;
        vertical-align: middle;
        align-items:center;
    }
    .msdk-phone-input-wrapper .msdk-phone-input-tips{
        color: red;
        font-size: 12px;
        position: absolute;
        top:0;
    }
    .msdk-phone-area{
        position: relative;
        width: 40%;
        font-size: 14px;
    }
    .msdk-phone-area-selected{
        padding: 8px 0;
        white-space:nowrap;
        overflow-x: hidden;
    }
    .msdk-phone-area-option{
        position: absolute;
        background-color: white;
        z-index: 9999;
        left: 1px;
        top: 0;
        width: auto;
        padding: 10px 0;
        box-sizing:border-box;
        text-align: center;
        color: #000;
        overflow-y: auto;
        overflow-x: hidden;
        box-shadow: 0 0 5px 0 rgba(0,0,0,0.5);
        border-radius: 5px;
        max-height: 211px;
        height: 211px;
        font-size: 12px;
    }
    .msdk-phone-area-option ul{
        list-style: none;
    }
    .msdk-phone-area-option ul li{
        padding: 0 10px;
        cursor: pointer;
        color: #5e5e5e;
        height: 24px;
        line-height: 24px;
    }
    .msdk-phone-input{
        position: relative;
        width: 59%;
    }
    .msdk-phone-area-selected{
        cursor: pointer;
    }


    /*滚动条整体部分,必须要设置*/
    .msdk-phone-area-option::-webkit-scrollbar{
        width: 5px;
        background-color: #fff;
    }
    /*滚动条的轨道*/
    .msdk-phone-area-option::-webkit-scrollbar-track{
        background-color: #fff;
    }
    /*滚动条的滑块按钮*/
    .msdk-phone-area-option::-webkit-scrollbar-thumb{
        border-radius: 4px;
        background-color: #999999;
        height: 50px;
        box-shadow: inset 0 0 5px #999999;
    }
    /*滚动条的上下两端的按钮*/
    .msdk-phone-area-option::-webkit-scrollbar-button {
        height: 0;
        background-color: #fff;
    }

</style>