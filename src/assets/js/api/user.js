import axios from "../axios";

export default {
    sendSmsCode: function (area_code, phone, action) {
        let obj = {
            area_code: area_code,
            phone: phone,
            action: action
        };
        return axios.post('/user/sendSmsCode', obj);
    },
    phoneRegister: function (area_code, phone, sms_code, password) {
        let obj = {
            area_code: area_code,
            phone: phone,
            sms_code: sms_code,
            password: password
        };
        return axios.post('/user/phoneRegister', obj);
    },
    phonePasswordLogin: function (area_code, phone, password) {
        let obj = {
            area_code: area_code,
            phone: phone,
            password: password
        };
        return axios.post('/user/phonePasswordLogin', obj);
    },
    phoneSmsLogin: function (area_code, phone, sms_code) {
        let obj = {
            area_code: area_code,
            phone: phone,
            sms_code: sms_code
        }
        return axios.post('/user/phoneSmsLogin', obj);
    },
    forgetPassword: function (token, password, repeat_password) {
        let obj = {
            token: token,
            password: password,
            repeat_password: repeat_password
        };
        return axios.post('/user/forgetPassword', obj);
    },
    bindPhone: function (token,area_code,phone,code) {
        let obj = {
            user_register_token: token,
            code:code,
            area_code: area_code,
            phone: phone
        };
        return axios.post('/user/bindPhone', obj);
    }
}