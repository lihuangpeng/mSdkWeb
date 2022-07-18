import md5 from "js-md5";
window.addEvent = function (ele, type, handler) {
    if (ele.addEventListener) {
        ele.addEventListener(type, handler);
    } else if (ele.attachEvent) {
        /* 检查是否使IE浏览器 */
        ele.attachEvent("on" + type, handler);
    } else {
        ele["on" + type] = handler;
    }
};

window.sortByKey = function (obj) {
    let keyArr = Object.keys(obj).sort();
    let new_obj = {};
    for (let i = 0; i < keyArr.length; i++) {
        new_obj[keyArr[i]] = obj[keyArr[i]];
    }
    return new_obj;
};

window.getSign = function (data, sign_key) {
    let call = function (data) {
        data = sortByKey(data);
        let str = '';
        for (let key in data) {
            if (typeof data[key] === 'object') {
                str = str + call(data[key]);
            } else {
                str = str + key + '=' + data[key] + '&';
            }
        }
        return str;
    };
    let str = call(data) + sign_key;
    return md5(str);
}



