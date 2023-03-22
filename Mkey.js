
const crypto = require('crypto')
const BN = require("bn.js")
const bip39 = require('bip39');

export class manageKey {
    constructor() {
        this.point_1 = new points(new BN(0), new BN(0));
        this.point_2 = new points(new BN(0), new BN(0));
        this.point_3 = new points(new BN(0), new BN(0));
        this.coEfficient = new BN(0);
        this.privateKey = new BN(0);
        this.userInput = "";
    }


    //generate PrivateKey
    genPrivateKey() {
        this.privateKey = new BN(crypto.randomBytes(32).toString('hex'), 16);
        return this.privateKey;
    }

    //generate points that be used in recovering PrivateKey
    genPoints() {
        this.point_1.X = new BN(crypto.randomBytes(32).toString('hex'), 16);
        this.point_2.X = new BN(crypto.createHash('sha256').update(this.userInput).digest('hex'), 16);
        this.point_3.X = new BN(crypto.randomBytes(32).toString('hex'), 16);

        this.point_1.Y = this.privateKey.add(this.coEfficient.mul(this.point_1.X))
        this.point_2.Y = this.privateKey.add(this.coEfficient.mul(this.point_2.X))
        this.point_3.Y = this.privateKey.add(this.coEfficient.mul(this.point_3.X))

        return
    }
    //manage 
    encryptPoint(point){
        var RSAPubKey = new crypto.createPublicKey(this.point_2.X .toBuffer);
        var encryptedPoint = crypto.publicEncrypt(RSAPubKey, point.toBuffer())
        return encryptedPoint
    }

    decryptPoint(encryptedPoint){
        var RSAPrivKey = new crypto.createPrivateKey(this.point_2.X .toBuffer);
        var decryptedPoint = crypto.publicDecrypt(RSAPrivKey,encryptedPoint)
        return decryptedPoint
    }
    // saveAtLocal() {

    // }

    // saveAtDrive() {

    // }

    // getPointFromLocal() {

    // }


    // getPointFromDrive() {

    // }


    // getUserInput() {

    // }

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
