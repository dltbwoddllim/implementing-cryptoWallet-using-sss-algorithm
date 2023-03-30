<!-- todo
  1. 핵심 함수들 다 최소 단위로 쪼개서 만들기
  2. 유저 플로우를 기준으로 기능 구현하기.(props사용 데이터 주고 받기.)
 -->

<script>
// import { inject } from 'vue'
// import Test from './components/TestEx.vue'

import { manageKey } from './Mkey.js';
const myMkey = new manageKey();
console.log(myMkey);
import { encryptItem } from './encryptItem.js'
const myencryptItem = new encryptItem();


export default {
  // setup() {
  //   const cryoptojs = inject('cryptojs')
  //   const Mkey = inject('Mkey')
  //   return {
  //     cryoptojs,
  //     Mkey
  //   }
  // },
  components: {
    // Test
  },
  data() {
    return {
      count: 0,
      message: '',
      point_3_x: '',
      password: "",
      password_2: "",
      cypherPoint: ""
    }
  },
  methods: {
    // increment() {
    //   // 컴포넌트의 count 상태 업데이트
    //   const a = new this.Mkey
    //   console.log(a);
    // },
    genprivKey() {
      myMkey.genPrivateKey()
      // console.log(myMkey.privateKey.toJSON())
    },
    genPoints() {
      myMkey.genPoints()
      // console.log(myMkey.point_1)
      // console.log(myMkey.point_2)
      // console.log(myMkey.point_3)
    },
    recovery() {
      console.log(myMkey.recoveryPrivateKey(myMkey.point_1, myMkey.point_2).toJSON());
      console.log(myMkey.recoveryPrivateKey(myMkey.point_1, myMkey.point_3).toJSON());
      console.log(myMkey.recoveryPrivateKey(myMkey.point_2, myMkey.point_3).toJSON());
    },
    inputValuePass() {
      console.log(this.point_3_x)
      myMkey.userPoint_xInput(this.point_3_x);
    },
    inputPwPass() {
      myencryptItem.setPassword(this.password);
      console.log(myencryptItem.password);
    },
    inputPw2Pass() {
      console.log(this.password_2);
    },
    onInput(e) {
      this.point_3_x = e.target.value
    },
    onPassword(e) {
      this.password = e.target.value
    },
    onPassword_2(e) {
      this.password_2 = e.target.value
    },
    encryptPoint() {
      console.log(this.password)
      myencryptItem.encrypt(myMkey.point_1.X).then((result) => {
        console.log(result);
        this.cypherPoint = result
        return (this.cypherPoint)
      })
    },
    decryptPoint() {
      console.log(this.password_2)
      myencryptItem.setPassword(this.password_2);
      myencryptItem.decrypt(this.cypherPoint, this.password_2).then((result) => {
        console.log(result);
        console.log(myMkey.point_1.X.toString())
      })
    },
    saveTolocalstorage() {
      myencryptItem.encrypt(myMkey.privateKey).then((result) => {
        const encryptDatas = {
          salt: myencryptItem.salt,
          iv: myencryptItem.iv,
          encryptData: new Uint8Array(result)
        }
        console.log(encryptDatas)
        const serializedData = JSON.stringify(encryptDatas)

        localStorage.setItem('encryptDatas', serializedData);
      });
    },
    attatchFromlocalstorage() {
      const serializedData = localStorage.getItem('encryptDatas')
      const encryptDatas = JSON.parse(serializedData);
      console.log(encryptDatas.iv);
      console.log(encryptDatas.salt);
      console.log(encryptDatas.encryptData);
      // const encoder = new TextEncoder();
      // const ivObject = JSON.stringify(encryptDatas.iv);
      // const saltObject = JSON.stringify(encryptDatas.salt);
      // myencryptItem.iv = encoder.encode(ivObject);
      // myencryptItem.salt = encoder.encode(saltObject);

      const arrayBuffer = new ArrayBuffer(encryptDatas.encryptData.length)
      const bufferView = new ArrayBuffer(arrayBuffer);
      
      // console.log(encoder.encode(ivObject));
      // console.log(encoder.encode(ivObject));
      // console.log(bufferView);

      // console.log(myencryptItem .iv);
      // console.log(myencryptItem.salt);
      myencryptItem.decrypt(bufferView).then((result) => {
        console.log(result);
        console.log(myMkey.privateKey.toJSON())
      })
    }
    // created() {

    // }
  }
}
</script>

<template>
    <!-- <Test /> -->
  <div>{{ message }}</div>
  <button @click="genprivKey">genprivKey</button><br>
  <p>{{  }}</p>
  <button @click="genPoints">genPoints</button><br>
  <input :value="point_3_x" @input="onInput" placeholder="여기에 입력하기"><button @click="inputValuePass">onInput</button><br>
  <button @click="recovery">recovery</button><br>

  <input :value="password" @input="onPassword" placeholder="다른 기기에서 복구 시 사용할 비밀번호를 입력해주세요">
  <button @click="inputPwPass">onPassword</button><br>

  <button @click="encryptPoint">encryptPoint</button><br>
  <input :value="password_2" @input="onPassword_2" placeholder="다른 기기에서 복구 시 사용할 비밀번호를 입력">
  
  <button @click="inputPw2Pass">onPassword_2</button><br>
  <button @click="decryptPoint">decryptPoint</button><br>
  <button @click="saveTolocalstorage">saveTolocalstorage</button><br>
  <button @click="attatchFromlocalstorage">attatchFromlocalstorage</button><br>
  

</template>
