// import crypto from 'crypto-js'
import BN from 'bn.js';
// import util from 'util';

// const pbkdf2Async = util.promisify(crypto.pbkdf2);

export class manageKey {
    constructor() {
        this.point_1 = new points(new BN(0), new BN(0));
        this.point_2 = new points(new BN(0), new BN(0));
        this.point_3 = new points(new BN(0), new BN(0));
        this.coEfficient = new BN(0);
        this.privateKey = new BN(0);
        this.recoverykey = new BN(0);
        this.userInput = "";
    }

    //generate PrivateKey
    genPrivateKey() {
        const randomBytes = new Uint8Array(32);
        crypto.getRandomValues(randomBytes);
        this.privateKey = new BN(randomBytes, 16);
        return this.privateKey;
    }

    //generate points that be used in recovering PrivateKey
    genPoints() {
        const randomBytes_1 = new Uint8Array(32);
        const randomBytes_2 = new Uint8Array(32);
        crypto.getRandomValues(randomBytes_1);
        crypto.getRandomValues(randomBytes_2);

        this.point_1.X = new BN(randomBytes_1, 16);
        this.point_2.X = new BN(randomBytes_2, 16);
        // this.point_3.X = new BN(this.digestMessage(this.userInput), 16);

        this.point_1.Y = this.privateKey.add(this.coEfficient.mul(this.point_1.X))
        this.point_2.Y = this.privateKey.add(this.coEfficient.mul(this.point_2.X))
        // this.point_3.Y = this.privateKey.add(this.coEfficient.mul(this.point_3.X))

        return
    }
    
    //recovery privateKey by points
    recoveryPrivateKey(point_1, point_2) {
        const co = (point_1.Y.sub(point_2.Y)).div(point_1.X.sub(point_2.X))
        this.recoverykey = point_1.Y.sub(co.mul(point_1.X))
        return this.recoverykey
    }

    //Input value
    userPoint_xInput(inputValue){
        this.digestMessage(inputValue).then((hash)=>
        {
            const result = new Uint8Array(hash)
            this.point_3.X = new BN(result);
            console.log(this.point_3.X);
            this.point_3.Y = this.privateKey.add(this.coEfficient.mul(this.point_3.X))
        })
    }


    // async encryptPointAsync(password, dataToEncrypt) {
    //     const salt = crypto.randomBytes(32); // generate a random salt
    //     const iterations = 100000; // number of iterations
    //     const keyLength = 256; // key length in bits

    //     const derivedKey = await pbkdf2Async(password, salt, iterations, keyLength, 'sha256');
    //     const cipher = crypto.createCipher('aes-256-cbc', derivedKey);
    //     let encrypted = cipher.update(dataToEncrypt, 'utf8', 'hex');
    //     encrypted += cipher.final('hex');

    //     return { salt, encryptedData: encrypted };
    // }

    // async decryptPointAsync(password, encryptedData) {
    //     const { salt, encryptedData: encrypted } = encryptedData;
    //     const iterations = 100000; // number of iterations
    //     const keyLength = 256; // key length in bits

    //     const derivedKey = await pbkdf2Async(password, salt, iterations, keyLength, 'sha256');
    //     const decipher = crypto.createDecipher('aes-256-cbc', derivedKey);
    //     let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    //     decrypted += decipher.final('utf8');

    //     return decrypted;
    // }
    
    async digestMessage(message) {
        const encoder = new TextEncoder();
        const data = encoder.encode(message);
        const hash = await crypto.subtle.digest("SHA-256", data);
        return hash;
      }

}

class points {
    constructor(x, y) {
        this.X = x;
        this.Y = y;
    }
}
