import CryptoJS from "crypto-js";

export default {
    // 加密
    encrypt: function (data,key) {
        if (typeof data === 'object') {
            data = JSON.stringify(data);
        }
        // 统一将传入的字符串转成UTF8编码
        const dataHex = CryptoJS.enc.Utf8.parse(data); // 需要加密的数据
        const keyHex = CryptoJS.enc.Utf8.parse(key); // 秘钥
        const ivHex = CryptoJS.enc.Utf8.parse('jetkoCmDiK7rNg0j'); // 偏移量
        const encrypted = CryptoJS.AES.encrypt(dataHex, keyHex, {
            iv: ivHex, //偏移量
            mode: CryptoJS.mode.CBC, // 加密模式
        });
        let encryptedVal = encrypted.ciphertext.toString();
        return encryptedVal; //  返回加密后的值
    },
    // 解密
    decrypt: function (encryptedVal,key) {
        // 传入的key和iv需要和加密时候传入的key一致
        // 统一将传入的字符串转成UTF8编码
        let encryptedHexStr = CryptoJS.enc.Hex.parse(encryptedVal);
        let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
        const keyHex = CryptoJS.enc.Utf8.parse(key); // 秘钥
        const ivHex = CryptoJS.enc.Utf8.parse('jetkoCmDiK7rNg0j'); // 偏移量
        let decrypt = CryptoJS.AES.decrypt(srcs, keyHex, {
            iv: ivHex,
            mode: CryptoJS.mode.CBC,
        });
        let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
        return decryptedStr.toString();
    },
};