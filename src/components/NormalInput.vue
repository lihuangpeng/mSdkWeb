<template>
    <section class="msdk-input-wrapper" :style="wrapperStyle">
        <input :type="type" v-model="value" :style="inputStyle" autocomplete="true" :placeholder="placeholder" maxlength="20">
        <slot></slot>
    </section>
</template>
<script>
    export default{
        name: "NormalInput",
        components: {},
        data: function () {
            return {
                inputValue: '',
            }
        },
        props: {
            type: String,
            defaultValue: String,
            wrapperStyle: String,
            inputStyle: String,
            placeholder: String,
        },
        created: function () {
            if (this.defaultValue) this.inputValue = this.defaultValue;
            if (!this.type) this.type = 'text';
        },
        computed: {
            value: {
                get: function () {
                    return this.inputValue
                },
                set: function (value) {
                    this.inputValue = value
                }
            }
        }
    }
</script>
<style scoped>
    input:-webkit-autofill, textarea:-webkit-autofill, select:-webkit-autofill {
        -webkit-text-fill-color: #000;
        -webkit-box-shadow: 0 0 0 1000px #fff inset
    }

    input {
        caret-color:#409EFF;
    }

    input, textarea {
        -webkit-appearance: none;
    }

    .msdk-input-wrapper{
        position: relative;
    }

    .msdk-input-wrapper input {
        border: 0;
        font-size: 14px;
        height: 36px;
        line-height: 36px;
        width: 100%;
        color: black;
        background: transparent;
    }

    .msdk-input-wrapper input:focus {
        outline: none;
    }
</style>