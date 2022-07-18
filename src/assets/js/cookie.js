var cookie = (function Cookie() {
    return {
        setCookie: function (name, value, expire) {
            if (!expire) {
                expire = 60 * 60 * 24 * 30 * 12; //默认一年
            }
            var date = new Date();
            data.setTime(date.getTime() + expire * 1000);
            document.cookie = name + " = " + escape(value) + ";expires=" + date.toGMTString();
        },
        getCookie: function (name){
            var ca = document.cookie.split(';');
            for(var i=0;i<ca.length;i++){
                var data = ca[i].trim();
                if(data.indexOf(name) === 0){
                    data = data.substring(name.length+1,data.length);
                    return unescape(data);
                }
            }
            return false;
        },
        delCookie:function (name) {
            document.cookie = name+"=;expires="+(new Date()).toGMTString();
        }
    };
})();

export default cookie;