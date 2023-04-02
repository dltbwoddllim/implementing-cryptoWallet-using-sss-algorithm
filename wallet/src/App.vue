<!-- todo

 -->

<script>
// import { inject } from 'vue'
// import Test from './components/TestEx.vue'
import BN from 'bn.js';
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
  mounted() {
    const script = document.createElement('script')
    script.src = 'https://apis.google.com/js/api.js'
    document.head.appendChild(script)
  },
  methods: {
    // increment() {
    //   // 컴포넌트의 count 상태 업데이트
    //   const a = new this.Mkey
    //   console.log(a);
    // },
    genprivKey() {
      myMkey.genPrivateKey()
      console.log(myMkey.privateKey.toJSON())
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
      myencryptItem.decrypt(this.cypherPoint).then((result) => {
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
        const privateKey = new BN(result);
        console.log(privateKey.toJSON())
        console.log(myMkey.privateKey.toJSON())
      })
    },
    pointJsonData() {
      const encryptDatas = new Array(3);
      const points = [myMkey.point_2.Y, myMkey.point_3.X, myMkey.point_3.Y];
      myencryptItem.encryptBatch(points).then((results) => {
        for (var i = 0; i < results.length; i++) {
          encryptDatas[i] = results[i]
        }
  // json 구글 드라이브 업로드 파트.
      })
    },
    uploadToDrive() {

    }
    // objectTouint8Array(data){
    //   var uint8Arr = new Uint8Array(Object.keys(data).length);
    //   for(var i = 0; i<iv.length; i++){
    //     uint8Arr[i] = data[i]
    //   }
    //   return uint8Arr
    // }
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
  <button @click="pointJsonData">pointJsonData</button><br>

</template>
