<script>

import BN from 'bn.js';
import { manageKey } from './Mkey.js';
import { encryptItem } from './encryptItem.js'
import Web3 from 'web3';
import * as FileSaver from 'file-saver';

const myMkey = new manageKey();
const myencryptItem = new encryptItem();
const web3 = new Web3(new Web3.providers.HttpProvider('https://sepolia.infura.io/v3/0218ff73aa344036a2c39f38030f9939'));

export default {
  components: {},
  data() {
    return {
      point_3_x: '',
      password: "",
      password_2: "",
      cypherPoint: "",
      privateKey: "",
      jsonfile: "",
      ethbalance: 0,
      address: "",
      recoveryJsonFile: "",
      amount: 0,
      toAddress: "",
      pageIndex: "init"
    }
  },
  methods: {
    page(index) {
      this.pageIndex = index
      if (index == 'home') {
        this.getAddress();
      }
    },
    genprivKey() {
      myMkey.genPrivateKey()
      this.privateKey = myMkey.privateKey.toJSON()
    },
    genPoints() {
      myMkey.genPoints()
    },
    inputValuePass() {
      myMkey.userPoint_xInputGenerateY(this.point_3_x);
    },
    inputValuePasstest() {
      myMkey.userPoint_xInputGenerateY(this.point_3_x);
    },
    inputPwPass() {
      myencryptItem.setPassword(this.password);
    },
    onInput(e) {
      this.point_3_x = e.target.value
    },
    onAmount(e) {
      this.amount = e.target.value
    },
    ontoAddress(e) {
      this.toAddress = e.target.value

    },
    onPassword(e) {
      this.password = e.target.value
    },
    onrecoveryJsonFile(e) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const data = JSON.parse(reader.result);
        console.log(data);
        this.recoveryJsonFile = data;
        // Do something with the parsed JSON data
      };
      reader.readAsText(file);
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

        // decrypt part
        const encryptDatass = JSON.parse(this.jsonfile);
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
          myMkey.point_2.X = new BN(results[0])
          myMkey.point_2.Y = new BN(results[1])
          myMkey.point_3.Y = new BN(results[2])
          myMkey.recoveryPrivateKey(myMkey.point_2, myMkey.point_3);
        }).then(()=>{
          localStorage.setItem('data', serializedData);
        })
      })
      this.saveTolocalstorage()
    },
    recoveryByJson() {
      const encryptDatass = this.recoveryJsonFile;
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
        myMkey.point_2.X = new BN(results[0])
        myMkey.point_2.Y = new BN(results[1])
        myMkey.point_3.Y = new BN(results[2])
        myMkey.recoveryPrivateKey(myMkey.point_2, myMkey.point_3);
      })
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
    },
    downloadData(){
      const data = localStorage.getItem('data'); // Replace 'my-data' with your own key
      const blob = new Blob([data], { type: 'application/json' });
      FileSaver.saveAs(blob, 'data.json');
    }
  }
}
</script>
<template>
  <div v-if="this.pageIndex == 'init'">
  <div class="container" style="margin-top: 100px;">
    <p class="guide">지갑을 처음 사용하신다면 아래 버튼을 눌러주세요!</p>
    <v-btn class="buttonSize" @click="page('genprivateKey')">개인키 생성하기</v-btn><br>
  </div>
  <div class="container">
    <p class="guide">해당 기기에서 생성된 계정을 사용하려면 아래 버튼을 눌러주세요!</p>
    <v-btn class="buttonSize" @click="page('RecoveryBylocalStorage')">비밀번호 입력하기</v-btn><br>
  </div>
    <div class="container">
      <p class="guide">리커버리 파일로 복원하려면 아래 버튼을 눌러주세요!</p>
      <v-btn  class="buttonSize" @click="page('RecoveryByJson')">리커버리 파일로 복원하기</v-btn><br>
  </div>


  </div>
  <div v-else-if="this.pageIndex == 'genprivateKey'">
    <button @click="genprivKey">genprivKey</button><br>
    <button @click="genPoints">genPoints</button><br>
    <input :value="point_3_x" @input="onInput" placeholder="point3x입력"><button
      @click="inputValuePass">onInput</button><br>
    <input :value="password" @input="onPassword" placeholder="비밀번호 입력"><button
      @click="inputPwPass">onPassword</button><br>
    <button @click="pointJsonData">복구 데이터 생성</button>
    {{ jsonfile }}
    <v-btn class="buttonSize" @click="downloadData()"> 복구 데이터 다운로드</v-btn><br>
    <button @click="page('home')">wallet</button><br>
  </div>
  <div v-else-if="this.pageIndex == 'RecoveryBylocalStorage'">
    <input :value="password" @input="onPassword" placeholder="비밀번호 입력"><button
      @click="inputPwPass">onPassword</button><br>
    <button @click="attatchFromlocalstorage">로그인</button><br>
    <button @click="page('home')">wallet</button><br>

  </div>
  <div v-else-if="this.pageIndex == 'RecoveryByJson'">
    <input :value="point_3_x" @input="onInput" placeholder="point3x입력"><button
      @click="inputValuePasstest">onInput</button><br>
    <input :value="password" @input="onPassword" placeholder="비밀번호 입력"><button
      @click="inputPwPass">onPassword</button><br>
    <input type="file" :value="recoveryJsonFile" @input="onrecoveryJsonFile" placeholder="json 입력"><br>
    <button @click="recoveryByJson">recoveryByJson</button><br>
    <button @click="page('home')">wallet</button><br>
  </div>
  <div v-else-if="this.pageIndex == 'home'">
    <!-- 주소, 보유량, 보낼 주소, send, send 결과 -->
    <p>주소 : {{ address }}</p>
    <p>eth : {{ ethbalance }}</p>
    <input :value="toAddress" @input="ontoAddress" placeholder="toAddress"><br>
    <input :value="amount" @input="onAmount" placeholder="amount"><button @click="sendTx">sendTx</button>
  </div>
</template>

<style>
.buttonSize {
  width: 400px;
  height: 50px;
}
.container{
  height: 100px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
.guide{
  margin-bottom: 10px;
}

</style>