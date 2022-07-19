(function () {
    function mSdk() {
        let params = {
            'width': '100%',
            'height': '100%',
            'left': '0',
            'top': '0',
            'zIndex': '9999',
            'app_key': '',
            'callback': '',
        };
        let el = 'msdk_v1';
        this.storage_key = 'msdk_access_token';
        this.baseURI = '';
        this.init = false;

        this.getParams = function (key) {
            if (!this.baseURI) {
                let scripts = document.getElementsByTagName("script");
                for (let i = 0; i < scripts.length; i++) {
                    if (scripts[i] && scripts[i].getAttribute("src") && scripts[i].getAttribute("src").indexOf("msdk.js") > -1) {
                        let url = scripts[i].getAttribute("src");
                        let url_info = url.split('//');
                        this.baseURI = url_info[0] + '//' + url_info[1].split('/')[0]+'/sdk';
                        let param = url.substr(url.indexOf("?") + 1).split("&");
                        for (let i = 0; i < param.length; i++) {
                            let data = param[i].split('=');
                            params[data[0]] = data[1];
                        }
                    }
                }
            }
            if (!key) {
                return params;
            } else {
                return params.hasOwnProperty(key) ? params[key] : null;
            }
        };

        this.open = function () {
            if (!document.getElementById(el)) {
                this.getParams();
                let div = document.createElement('div');
                div.innerHTML = '<iframe src="' + this.baseURI + '" width="100%" height="100%" frameborder="0" ' +
                    'scrolling="no" id="' + el + '_iframe" sandbox=" allow-same-origin allow-scripts  allow-popups allow-forms allow-modals allow-top-navigation-by-user-activation"></iframe>';
                div.setAttribute('id', el);
                div.style.width = this.getParams('width');
                div.style.height = this.getParams('height');
                div.style.position = 'fixed';
                div.style.left = this.getParams('left');
                div.style.top = this.getParams('top');
                div.style.zIndex = this.getParams('zIndex');
                this.close();
                let body = document.body;
                body.insertBefore(div, body.lastChild);
                //通知sdk初始化
                if(!this.getParams('app_key')){
                    throw new DOMException('param app_key not exists');
                }
                if(!this.getParams('callback')){
                    throw new DOMException('param callback not exists');
                }
                const targetIframe = document.getElementById(el + '_iframe');
                targetIframe.onload = ()=>{
                    targetIframe.contentWindow.postMessage(JSON.stringify({
                        'ac': 'init',
                        'params': {app_key: params['app_key'], 'callback': params['callback']}
                    }), '*');
                }
            } else {
                if (!this.init) return false;
                document.getElementById(el).style.display = 'block';
            }
        };

        this.refresh = function () {
            if(this.init){
                const targetIframe = document.getElementById(el + '_iframe');
                targetIframe.contentWindow.postMessage(JSON.stringify({
                    'ac': 'init',
                    'params': {app_key: params['app_key'], 'callback': params['callback']}
                }), '*');
            }
        };

        this.bind = function (btn_el) {
            if (document.getElementById(btn_el)) {
                let _this = this;
                addEvent(document.getElementById(btn_el), 'click', function () {
                    _this.open();
                });
            }
        };
        this.close = function () {
            if (document.getElementById(el)) {
                document.getElementById(el).style.display = 'none';
            }
        };
        this.loginOut = function (callback) {
            window.localStorage.removeItem(this.storage_key);
            if(callback){
                callback();
            }
            window.location.href = ""
        }
    }

    function addEvent(ele, type, handler) {
        if (ele.addEventListener) {
            ele.addEventListener(type, handler);
        } else if (ele.attachEvent) {
            /* 检查是否使IE浏览器 */
            ele.attachEvent("on" + type, handler);
        } else {
            ele["on" + type] = handler;
        }
    }

    window.mSDK = new mSdk();

    addEvent(window, 'message', function (event) {
        let origin = event.origin;
        if (origin !== window.mSDK.baseURI) return false;
        if (typeof event.data !== 'string') return false;
        let data = JSON.parse(event.data);
        if(!Object.hasOwnProperty.call(data,'ac')){
            return false;
        }
        switch (data.ac) {
            case 'close':
                window.mSDK.close();
                break;
            case 'show':
                window.mSDK.init = true;
                window.mSDK.open();
                break;
            case 'refresh':
                window.mSDK.refresh();
                break;
            case 'login':
                if(Object.hasOwnProperty.call(data,'params') && Object.hasOwnProperty.call(data.params,'access_code')){
                    window.open(mSDK.getParams('callback')+'/?code='+data.params.access_code,'_self');
                }
                break;
            default:
                break;
        }
    });
})();