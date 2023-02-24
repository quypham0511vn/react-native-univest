import RNSimpleCrypto from 'react-native-simple-crypto';

const RSA_PUBLIC_KEY = '-----BEGIN PUBLIC KEY-----\r\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDZvvAt+TCfK4r15RZTMBmccOPKHlPBqLX+9QqFflr2exS6CKjiAHZJEz/JLS0Ao1dYOW3mmbG9m4xLT6wFmas4fDplkhAlInzPa1WnIzdJSVHKebYzcDjSl5GEqhUfmj23Hb7o+fI91Jom+IljX/PUjgqCuoRXfTkRAJap0Mn8rQIDAQAB\r\n-----END PUBLIC KEY-----';

async function encryptData(data: string) {
    const rsaEncryptedMessage = await RNSimpleCrypto.RSA.encrypt(
        data,
        RSA_PUBLIC_KEY
    );
    return rsaEncryptedMessage.split('\n').join('').split('\r').join('').split(' ').join('');
}

export default {
    encryptData
};
