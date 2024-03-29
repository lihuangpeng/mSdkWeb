import axios from "axios";
import qs from "qs";
import Aes from "./encrypt/aes";
import Rsa from "./encrypt/rsa";
import Config from "@ModuleAssets/js/config.js";

axios.defaults.baseURL = process.env.VUE_APP_AXIOS_BASE_URL;
axios.defaults.headers['Content-Type'] = "application/x-www-form-urlencoded;charset=utf-8";
axios.defaults.timeout = 3000;

//请求拦截器,能拦截请求主体信息
axios.defaults.transformRequest = function (data, request) {
    data.request_time= Math.floor((new Date()).getTime()/1000);
    var aes_key = '';
    if(!Object.hasOwnProperty.call(data,'public_key')){
        data.app_id = window.msdk_app_id;
        data.sub_app_id = window.msdk_sub_app_id;
        aes_key = Aes.decrypt(window.msdk_aes_key,Config.aes_key);
        let sign_key = Aes.decrypt(window.msdk_sign_key,aes_key);
        data.sign = window.getSign(data,sign_key);
    }else{
        data.sign = window.getSign(data,process.env.VUE_APP_COMMON_SIGN_KEY);
    }
    if (typeof data === 'object') {
        data = qs.stringify(data);
    }
    if(aes_key){
        data = Aes.encrypt(data,aes_key);
        request['Accept-Encrypt-Type'] = 'aes';
    }
    return data;
};

const instance = axios.create({
    validateStatus: function (status) {
        var reg_exp = new RegExp('^[2|3|4]\\d+');
        return reg_exp.test(status);
    }
});

//返回拦截器
instance.interceptors.response.use(function onFultfilled(response) {
    return Promise.resolve(response.data);
}, function onRejected(reason) {
    return Promise.reject(reason);
});


export default instance;