import { manageKey } from "./Mkey";

var Mkey = new manageKey()
var PrivKey = Mkey.genPrivateKey();
Mkey.genPoints();
console.log(PrivKey);
console.log(Mkey.recoveryPrivateKey(Mkey.point_1, Mkey.point_2));
console.log(Mkey.recoveryPrivateKey(Mkey.point_1, Mkey.point_3));
console.log(Mkey.recoveryPrivateKey(Mkey.point_2, Mkey.point_3));
console.log(Mkey.encryptPoint(Mkey.point_1))