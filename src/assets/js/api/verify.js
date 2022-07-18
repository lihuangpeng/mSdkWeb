import axios from "../axios";

export default {
    phone: function (area_code, phone, sms_code) {
        let obj = {
            area_code : area_code,
            phone: phone,
            sms_code:sms_code,
            action:'forget_password',
        };
        return axios.post('/verify/phone',obj);
    }
}