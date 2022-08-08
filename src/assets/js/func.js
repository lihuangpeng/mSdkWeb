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
};

window.openWindow = function (url, name, iWidth, iHeight) {
    //window.screen.height获得屏幕的高，window.screen.width获得屏幕的宽
    var iTop = (window.screen.height - 30 - iHeight) / 2;       //获得窗口的垂直位置;
    var iLeft = (window.screen.width - 10 - iWidth) / 2;        //获得窗口的水平位置;
    window.open(url, name, 'height=' + iHeight + ',,innerHeight=' + iHeight + ',width=' + iWidth + ',innerWidth=' + iWidth + ',top=' + iTop + ',left=' + iLeft + ',toolbar=no,menubar=no,scrollbars=auto,resizeable=no,location=no,status=no');
};

window.sdkLogin = function (access_code) {
    window.parent.postMessage(JSON.stringify({
        'ac': 'login',
        'params': {access_code: access_code},
    }), '*');
};



