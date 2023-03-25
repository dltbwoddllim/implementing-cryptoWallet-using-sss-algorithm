import { manageKey } from "./Mkey.js";
import crypto from 'crypto';
import BN from 'bn.js';
var Mkey = new manageKey()
var PrivKey = Mkey.genPrivateKey();

Mkey.genPoints();
console.log(PrivKey);
console.log(Mkey.recoveryPrivateKey(Mkey.point_1, Mkey.point_2));
console.log(Mkey.recoveryPrivateKey(Mkey.point_1, Mkey.point_3));
console.log(Mkey.recoveryPrivateKey(Mkey.point_2, Mkey.point_3));

var encryptedPoint_1= '';
Mkey.encryptPointAsync(Mkey.point_2.X.toString(),Mkey.point_1.X.toString()).then((result)=>{
    console.log(result);
    var userinput = "dladygks112-";
    var password= new BN(crypto.createHash('sha256').update(userinput).digest('hex'), 16).toString();
    console.log(password);

    Mkey.decryptPointAsync(password, result).then((result2)=>{
        console.log(result2);
        console.log(Mkey.point_1.X.toString())
        const a = new BN(result2);
        console.log(a.toString());
    })
})
