import axios from "../axios";

export default {
    init: (app_key,public_key) => {
        let obj = {
            public_key : public_key,
            app_key: app_key
        };
        return axios.post('/app/init',obj);
    }
}