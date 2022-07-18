import JSEncrypt  from "jsencrypt";

export default (function () {
    function Rsa() {
        this.PRIVATE = "-----BEGIN RSA PRIVATE KEY-----\n" +
            "MIICWwIBAAKBgQCC2Kh46ZE2/k6hBfRHXOm37lQhQ9g7phdw2jGo0KNgW+wxW2pm\n" +
            "ZzQhLg+Dx9FyEXa3j0YraktnCIBkx816DLw/xUIhRObjYX4+5hUnv6IGtHf5pNyP\n" +
            "9v/utiRdkko+Vj1BDWtI4lw/0DXruLJIV06EIf95TFfZaEk81/EO31FdpQIDAQAB\n" +
            "AoGATyoMTBNsY2xbYDr8/4wsb7cHOZUVp4km14V71BpfLnaPIZGgf1JjjMuUYXOs\n" +
            "uantPMO3fZ7y/eR74f2syPIZllFqSI0CP1HkDyTH5BsLqKqTmzWcbvrWx1Pc2Dis\n" +
            "OCf9KVz4o/Scly3igI8Nblrk5zP03NMBb7dqyNzqsP2i6gUCQQDGojaHEWZ4qTZm\n" +
            "wFhTccKX/DHc1vJesjS3JQHRU6TDWSML476KGoH3+S23XRfRsIFzN1QWrhqfopfg\n" +
            "phP2gcPnAkEAqKKnmAOY0BhzMh0D7q94dtGZbg/MxQPpBRWvEcLsragv8NilM5Mp\n" +
            "6gUjLcWSgEoBq4VcywQE/AOosXbOaQcgkwJAdedRgIkGjza50PH5O8a54CdVnaWF\n" +
            "Bkq3WcLAunTwxvfBAsyzjBxB62RgC4hZnCEuJarA4hmEOh90EWfjT54lHwJALSni\n" +
            "2MOd2Z2yvGko9HPqP2hDP0bcAKfbcJEuIgOif5/btxVOqVFwmExn74pKgjFP4TAG\n" +
            "ehjJfPU96Ml43ogaIQJAYpbORQgUvJilLJGTIisWNF8Wa+lEt1J4tn7p47IDMOAa\n" +
            "CwcbmDGnhnh67CXrwwJvb4F8tK/NiwNqlLhyDrONyg==\n" +
            "-----END RSA PRIVATE KEY-----";
        this.PUBLIC = "-----BEGIN PUBLIC KEY-----\n" +
            "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCC2Kh46ZE2/k6hBfRHXOm37lQh\n" +
            "Q9g7phdw2jGo0KNgW+wxW2pmZzQhLg+Dx9FyEXa3j0YraktnCIBkx816DLw/xUIh\n" +
            "RObjYX4+5hUnv6IGtHf5pNyP9v/utiRdkko+Vj1BDWtI4lw/0DXruLJIV06EIf95\n" +
            "TFfZaEk81/EO31FdpQIDAQAB\n" +
            "-----END PUBLIC KEY-----";
    };

    Rsa.prototype.encrypt = function (data) {
        if (typeof data === 'object') {
            data = JSON.stringify(data);
        }
        let jsEncrypt = new JSEncrypt();
        jsEncrypt.setPublicKey(this.PUBLIC);
        let data_length = data.length;
        let length = 100;
        let offset = 0;
        let result = [];
        while (data_length - offset > 0) {
            let str = data.substr(offset, length);
            result.push(jsEncrypt.encrypt(str));
            offset += length;
        }
        return JSON.stringify(result);
    };

    Rsa.prototype.decrypt = function (data) {
        let jsEncrypt = new JSEncrypt();
        jsEncrypt.setPrivateKey(this.PRIVATE);
        if(typeof data === 'string') data = JSON.parse(data);
        let count = data.length;
        let result = '';
        for (let i = 0; i < count; i++) {
            result = result + jsEncrypt.decrypt(data[i]);
        }
        result = JSON.parse(result);
        return result;
    };

    return new Rsa();
})();