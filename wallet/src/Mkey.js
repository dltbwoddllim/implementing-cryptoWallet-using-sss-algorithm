import BN from 'bn.js';

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
        const randomBytes_2 = new Uint8Array(32);
        crypto.getRandomValues(randomBytes_2);
        this.privateKey = new BN(randomBytes, 16);
        this.coEfficient = new BN(randomBytes_2,16);
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

        this.point_1.Y = this.privateKey.add(this.coEfficient.mul(this.point_1.X))
        this.point_2.Y = this.privateKey.add(this.coEfficient.mul(this.point_2.X))

        return
    }
    
    //recovery privateKey by points
    recoveryPrivateKey(point_1, point_2) {
        const co = (point_1.Y.sub(point_2.Y)).div(point_1.X.sub(point_2.X))
        this.recoverykey = point_1.Y.sub(co.mul(point_1.X))
        this.privateKey = this.recoverykey
        return this.recoverykey
    }

    //Input value
    userPoint_xInputGenerateY(inputValue){
        this.digestMessage(inputValue).then((hash)=>
        {
            const result = new Uint8Array(hash)
            this.point_3.X = new BN(result);
            this.point_3.Y = this.privateKey.add(this.coEfficient.mul(this.point_3.X))
        })
    }

    // userPoint_xInput

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
