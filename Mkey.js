
const crypto = require('crypto')
const BN = require("bn.js")
const privateKey = new BN(crypto.randomBytes(32).toString('hex'), 16);
const coEfficient = new BN(crypto.randomBytes(32).toString('hex'), 16);
const bip39 = require('bip39');

//Generate three points
//y=ax+b(a : random number, b : privatekey)
const a = coEfficient;
const b = privateKey;

//x1,x2(user input),x3 -> y1,y2,y3
//add PBKDF2 to user input
const userInput = "dladygks"
// https://www.geeksforgeeks.org/node-js-crypto-pbkdf2-method/
// crypto.pbkdf2(userInpu)

const x1 = new BN(crypto.randomBytes(32).toString('hex'), 16);
const x2 = new BN(crypto.createHash('sha256').update(userInput).digest('hex'), 16);
const x3 = new BN(crypto.randomBytes(32).toString('hex'), 16);

const y1 = b.add(a.mul(x1))
const y2 = b.add(a.mul(x2))
const y3 = b.add(a.mul(x3))

//recover private key
//a = (y1-y2)/(x1-x2)
//b = (y1-ax1)
const user_x = new BN(crypto.createHash('sha256').update(userInput).digest('hex'), 16);

const co = (y1.sub(y2)).div(x1.sub(user_x))
const recoveryPrivateKey = y1.sub(co.mul(x1))
console.log(privateKey);
console.log(recoveryPrivateKey);

//generate mnemonics
const mnemonic = bip39.entropyToMnemonic(privateKey.toBuffer());
console.log(mnemonic);

//RSA encryption using x2(PBKDF2)'s pubKey or symmetrics encrpytion.


// -----------------------------------------
// class points {
//     constructor(x, y) {
//       this.X = x;
//       this.Y = y;
//     }
//   }

// class manageKey {
//     constructor(){

//     }
// function genPrivateKey(){
//     return new BN(crypto.randomBytes(32).toString('hex'), 16);
// }

// function genPoints(privateKey){
//     const coEfficient = new BN(crypto.randomBytes(32).toString('hex'), 16);
//     const x1 = new BN(crypto.randomBytes(32).toString('hex'), 16);
//     const x2 = new BN(crypto.randomBytes(32).toString('hex'), 16);
//     const x3 = new BN(crypto.randomBytes(32).toString('hex'), 16);

//     const y1 = b.add(a.mul(x1))
//     const y2 = b.add(a.mul(x2))
//     const y3 = b.add(a.mul(x3))


//     return 
// }

// function saveAtLocal(point){

// }

// function saveAtDrive(point){

// }

//     function getPointFromLocal() {

//     }


//     function getPointFromDrive() {

//     }


//     function getUserInput() {

//     }

//     function recoveryPrivateKey(point_1, point_2) {

//     }
// }