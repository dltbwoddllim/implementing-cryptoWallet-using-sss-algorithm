<script>

import BN from 'bn.js';
import { manageKey } from './Mkey.js';
import { encryptItem } from './encryptItem.js'
import Web3 from 'web3';

const myMkey = new manageKey();
const myencryptItem = new encryptItem();
const web3 = new Web3(new Web3.providers.HttpProvider('https://sepolia.infura.io/v3/0218ff73aa344036a2c39f38030f9939'));

var initpage = 0
if (localStorage.getItem('encryptDatas') == null) {
  initpage = 1;
} else {
  initpage = 5;
}

export default {
  components: {},
  data() {
    return {
      point_3_x: '',
      password: "",
      password_2: "",
      cypherPoint: "",
      privateKey: "",
      initpage: initpage,
      jsonfile: "",
      ethbalance: 0,
      address: "",
      recoveryJsonFile: "",
      amount:0,
      toAddress : "",
      pageIndex : ""
    }
  },
  methods: {
    genprivKey() {
      myMkey.genPrivateKey()
      this.privateKey = myMkey.privateKey.toJSON()
      this.initpage = 2;
    },
    genPoints() {
      myMkey.genPoints()
    },
    recovery() {
      this.initpage = 5;
    },
    inputValuePass() {
      myMkey.userPoint_xInputGenerateY(this.point_3_x);
      this.initpage = 3
    },
    inputValuePasstest(){
      myMkey.userPoint_xInputGenerateY(this.point_3_x);
    },
    inputPwPass() {
      myencryptItem.setPassword(this.password);
      if (this.initpage == 5) {
        this.attatchFromlocalstorage()
      } else {
        this.saveTolocalstorage();
        this.initpage = 4
      }
    },
    onInput(e) {
      this.point_3_x = e.target.value
    },
    onAmount(e){
      this.amount = e.target.value
    },
    ontoAddress(e){
      this.toAddress = e.target.value

    },
    onPassword(e) {
      this.password = e.target.value
    },
    onrecoveryJsonFile(e) {
      this.recoveryJsonFile = e.target.value
    },

    saveTolocalstorage() {
      myencryptItem.encrypt(myMkey.privateKey).then((result) => {
        const encryptDatas = {
          salt: myencryptItem.salt,
          iv: myencryptItem.iv,
          encryptData: new Uint8Array(result)
        }
        const serializedData = JSON.stringify(encryptDatas)

        localStorage.setItem('encryptDatas', serializedData);
      });
    },
    attatchFromlocalstorage() {
      const serializedData = localStorage.getItem('encryptDatas')
      const encryptDatas = JSON.parse(serializedData);

      var uint8Arr1 = new Uint8Array(Object.keys(encryptDatas.iv).length);
      var uint8Arr2 = new Uint8Array(Object.keys(encryptDatas.salt).length);
      var uint8Arr3 = new Uint8Array(Object.keys(encryptDatas.encryptData).length);
      for (var i = 0; i < uint8Arr1.length; i++) {
        uint8Arr1[i] = encryptDatas.iv[i]
      }
      for (var j = 0; j < uint8Arr2.length; j++) {
        uint8Arr2[j] = encryptDatas.salt[j]
      }
      for (var t = 0; t < uint8Arr3.length; t++) {
        uint8Arr3[t] = encryptDatas.encryptData[t]
      }

      myencryptItem.iv = uint8Arr1
      myencryptItem.salt = uint8Arr2
      myencryptItem.decrypt(uint8Arr3).then((result) => {
        myMkey.privateKey = new BN(result);
      })
    },
    pointJsonData() {
      const encryptDatas = {
        salt: myencryptItem.salt,
        iv: myencryptItem.iv,
        point_2_X: "",
        point_2_Y: "",
        point_3_Y: ""
      }
      const points = [myMkey.point_2.X, myMkey.point_2.Y, myMkey.point_3.Y];
      myencryptItem.encryptBatch(points).then((results) => {
        for (var i = 0; i < results.length; i++) {
          console.log(results[i])
          points[i] = new Uint8Array(results[i])
        }
      }).then(() => {
        encryptDatas['point_2_X'] = points[0];
        encryptDatas['point_2_Y'] = points[1];
        encryptDatas['point_3_Y'] = points[2];
        const serializedData = JSON.stringify(encryptDatas)
        this.jsonfile = serializedData
        console.log(this.jsonfile)

        // decrypt part
        const encryptDatass = JSON.parse(this.jsonfile);
        console.log(encryptDatass)
        var uint8Arr1 = new Uint8Array(Object.keys(encryptDatass.iv).length);
        var uint8Arr2 = new Uint8Array(Object.keys(encryptDatass.salt).length);
        var uint8Arr3 = new Uint8Array(Object.keys(encryptDatass.point_2_Y).length);
        var uint8Arr4 = new Uint8Array(Object.keys(encryptDatass.point_3_X).length);
        var uint8Arr5 = new Uint8Array(Object.keys(encryptDatass.point_3_Y).length);

        for (var i = 0; i < uint8Arr1.length; i++) {
          uint8Arr1[i] = encryptDatass.iv[i]
        }
        for (var j = 0; j < uint8Arr2.length; j++) {
          uint8Arr2[j] = encryptDatass.salt[j]
        }
        for (var t = 0; t < uint8Arr3.length; t++) {
          uint8Arr3[t] = encryptDatass.point_2_Y[t]
        }
        for (var k = 0; k < uint8Arr4.length; k++) {
          uint8Arr4[k] = encryptDatass.point_3_X[k]
        }
        for (var p = 0; p < uint8Arr5.length; p++) {
          uint8Arr5[p] = encryptDatass.point_3_Y[p]
        }

        console.log(uint8Arr3)
        console.log(uint8Arr4)
        console.log(uint8Arr5)

        myencryptItem.iv = uint8Arr1
        myencryptItem.salt = uint8Arr2
        myencryptItem.decryptBatch([uint8Arr3, uint8Arr4, uint8Arr5]).then((results) => {
          console.log(results);
          myMkey.point_2.Y = new BN(results[0])
          myMkey.point_3.X = new BN(results[1])
          myMkey.point_3.Y = new BN(results[2])
          console.log(myMkey.point_2.Y)
          console.log(myMkey.point_3.X)
          console.log(myMkey.point_3.Y)
          myMkey.recoveryPrivateKey(myMkey.point_2, myMkey.point_3);
          console.log(myMkey.recoverykey.toJSON())
          console.log(myMkey.privateKey.toJSON())

        })
      })

    },
    recoveryByJson() {
      // decrypt part
      const encryptDatass = JSON.parse(this.recoveryJsonFile);
      console.log(encryptDatass)
      var uint8Arr1 = new Uint8Array(Object.keys(encryptDatass.iv).length);
      var uint8Arr2 = new Uint8Array(Object.keys(encryptDatass.salt).length);
      var uint8Arr3 = new Uint8Array(Object.keys(encryptDatass.point_2_X).length);
      var uint8Arr4 = new Uint8Array(Object.keys(encryptDatass.point_2_Y).length);
      var uint8Arr5 = new Uint8Array(Object.keys(encryptDatass.point_3_Y).length);

      for (var i = 0; i < uint8Arr1.length; i++) {
        uint8Arr1[i] = encryptDatass.iv[i]
      }
      for (var j = 0; j < uint8Arr2.length; j++) {
        uint8Arr2[j] = encryptDatass.salt[j]
      }
      for (var t = 0; t < uint8Arr3.length; t++) {
        uint8Arr3[t] = encryptDatass.point_2_X[t]
      }
      for (var k = 0; k < uint8Arr4.length; k++) {
        uint8Arr4[k] = encryptDatass.point_2_Y[k]
      }
      for (var p = 0; p < uint8Arr5.length; p++) {
        uint8Arr5[p] = encryptDatass.point_3_Y[p]
      }

      myencryptItem.iv = uint8Arr1
      myencryptItem.salt = uint8Arr2
      myencryptItem.decryptBatch([uint8Arr3, uint8Arr4, uint8Arr5]).then((results) => {
        console.log(results);
        myMkey.point_2.X = new BN(results[0])
        myMkey.point_2.Y = new BN(results[1])
        myMkey.point_3.Y = new BN(results[2])
        console.log(myMkey.point_2.X)
        console.log(myMkey.point_2.Y)
        console.log(myMkey.point_3.X)
        console.log(myMkey.point_3.Y)
        myMkey.recoveryPrivateKey(myMkey.point_2, myMkey.point_3);
        console.log(myMkey.recoverykey.toJSON())
        console.log(myMkey.privateKey.toJSON())

      })
    },
    goTohome() {
      this.initpage = 6;
      this.getAddress();
    },
    async getAddress() {
      const account = web3.eth.accounts.privateKeyToAccount(myMkey.privateKey.toJSON());
      this.address = account.address;
      const balanceInWei = await web3.eth.getBalance(this.address);
      this.ethbalance = web3.utils.fromWei(balanceInWei, 'ether');

    },
    async sendTx() {
      const to = this.toAddress;
      const amount = web3.utils.toWei(this.amount, 'ether');
      const gasPrice = await web3.eth.getGasPrice();
      const gasLimit = 21000;
      const txData = {
        to: to,
        value: amount,
        gasPrice: gasPrice,
        gas: gasLimit
      };
      const signedTx = await web3.eth.accounts.signTransaction(txData, myMkey.privateKey.toJSON());
      const txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
      console.log('Transaction receipt:', txReceipt);
    }
    // encryptPoint() {
    //   myencryptItem.encrypt(myMkey.point_1.X).then((result) => {
    //     this.cypherPoint = result
    //     return (this.cypherPoint)
    //   })
    // },
    // decryptPoint() {
    //   myencryptItem.setPassword(this.password_2);
    //   myencryptItem.decrypt(this.cypherPoint).then((result) => {
    //     console.log(result);
    //     myMkey.privateKey = result;
    //   });
    // },
  }
}
</script>
<template>
  <div v-if="this.pageIndex == 'init'">
    <!-- 개인키 생성, 로컬 스토리지, josn 선택 -->
    <button @click="page">genprivKey</button><br>

  </div>
  <!-- 개인키 생성 -->
  <div v-else-if="this.pageIndex == 'genprivateKey'">
    <!-- 개인키 생성 버튼
        point3_x 입력
        비밀번호 입력 -->
  </div>
  <div v-else-if="this.pageIndex == 'RecoveryBylocalStorage'">
  <!-- 
    비밀번호 입력
   -->
  </div>
  <div v-else-if="this.pageIndex == 'RecoveryByJson'">
  <!-- 
    point3_x
    비밀번호
    json입력
   -->
  </div>
  <div v-else-if="this.pageIndex == 'home'"></div>

  <div v-if="this.initpage == 1">
    <button @click="genprivKey">genprivKey</button><br>
    <button @click="recovery">recovery</button><br>
  </div>
  <div v-else-if="this.initpage == 2">
    <button @click="genPoints">genPoints</button><br>
    <input :value="point_3_x" @input="onInput" placeholder="point3x입력"><button @click="inputValuePass">onInput</button><br>
  </div>
  <div v-else-if="this.initpage == 3">
    <input :value="password" @input="onPassword" placeholder="비밀번호 입력"><br>
    <button @click="inputPwPass">onPassword</button><br>
  </div>
  <div v-else-if="this.initpage == 4">
    <button @click="pointJsonData">복구 데이터 생성</button>
    {{ jsonfile }}
    <button @click="goTohome">goTohome</button>
  </div>
  <div v-else-if="this.initpage == 5">
    <input :value="point_3_x" @input="onInput" placeholder="point3x입력"><button @click="inputValuePasstest">onInput</button><br>
    <input :value="password" @input="onPassword" placeholder="비밀번호 입력"><button @click="inputPwPass">onPassword</button><br>
    <input :value="recoveryJsonFile" @input="onrecoveryJsonFile" placeholder="json 입력"><br>
    <button @click="recoveryByJson">recoveryByJson</button><br>
    <button @click="goTohome">goTohome</button>

  </div>

  <div v-else>
    <p>주소 : {{ address }}</p>
    <p>eth : {{ ethbalance }}</p>
    <input :value="toAddress" @input="ontoAddress" placeholder="toAddress"><br>
    <input :value="amount" @input="onAmount" placeholder="amount"><button @click="sendTx">sendTx</button>
    <div>

    </div>
  </div>
</template>
