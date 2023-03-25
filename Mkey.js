import crypto from 'crypto';
import BN from 'bn.js';
import util from "util";
// import bip39 from 'bip39';

const pbkdf2Async = util.promisify(crypto.pbkdf2);

export class manageKey {
    constructor() {
        this.point_1 = new points(new BN(0), new BN(0));
        this.point_2 = new points(new BN(0), new BN(0));
        this.point_3 = new points(new BN(0), new BN(0));
        this.coEfficient = new BN(0);
        this.privateKey = new BN(0);
        this.userInput = "dladygks112-";
    }


    //generate PrivateKey
    genPrivateKey() {
        this.privateKey = new BN(crypto.randomBytes(32).toString('hex'), 16);
        return this.privateKey;
    }

    //generate points that be used in recovering PrivateKey
    genPoints(num) {
        this.point_1.X = new BN(crypto.randomBytes(32).toString('hex'), 16);
        this.point_2.X = new BN(crypto.createHash('sha256').update(this.userInput).digest('hex'), 16);
        this.point_3.X = new BN(crypto.randomBytes(32).toString('hex'), 16);

        this.point_1.Y = this.privateKey.add(this.coEfficient.mul(this.point_1.X))
        this.point_2.Y = this.privateKey.add(this.coEfficient.mul(this.point_2.X))
        this.point_3.Y = this.privateKey.add(this.coEfficient.mul(this.point_3.X))

        return
    }

    async encryptPointAsync(password, dataToEncrypt) {
        const salt = crypto.randomBytes(32); // generate a random salt
        const iterations = 100000; // number of iterations
        const keyLength = 256; // key length in bits

        const derivedKey = await pbkdf2Async(password, salt, iterations, keyLength, 'sha256');
        const cipher = crypto.createCipher('aes-256-cbc', derivedKey);
        let encrypted = cipher.update(dataToEncrypt, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        return { salt, encryptedData: encrypted };
    }

    async decryptPointAsync(password, encryptedData) {
        const { salt, encryptedData: encrypted } = encryptedData;
        const iterations = 100000; // number of iterations
        const keyLength = 256; // key length in bits

        const derivedKey = await pbkdf2Async(password, salt, iterations, keyLength, 'sha256');
        const decipher = crypto.createDecipher('aes-256-cbc', derivedKey);
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    }

    recoveryPrivateKey(point_1, point_2) {
        const co = (point_1.Y.sub(point_2.Y)).div(point_1.X.sub(point_2.X))
        this.privateKey = point_1.Y.sub(co.mul(point_1.X))
        return this.privateKey
    }
}

class points {
    constructor(x, y) {
        this.X = x;
        this.Y = y;
    }

}
