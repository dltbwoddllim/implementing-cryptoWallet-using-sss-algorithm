<script>
// import { inject } from 'vue'
// import Test from './components/TestEx.vue'
import { manageKey } from './Mkey.js';
const myMkey = new manageKey();
console.log(myMkey); // check the object in the console

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
      point_3_x: ''
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
      console.log(myMkey.privateKey.toJSON())
    },
    genPoints() {
      myMkey.genPoints()
      console.log(myMkey.point_1)
      console.log(myMkey.point_2)
      console.log(myMkey.point_3)
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
    onInput(e) {
      // v-on 핸들러는 네이티브 DOM 이벤트를 인자로 받습니다.
      this.point_3_x = e.target.value
    }
    // created() {

    // }
  }
}
</script>

<template>
  <!-- <Test /> -->
  <div>{{ message }}</div>>
  <button @click="genprivKey">genprivKey</button>>
  <button @click="genPoints">genPoints</button>>
  <input :value="point_3_x" @input="onInput" placeholder="여기에 입력하기"><button @click="inputValuePass">inputValuePass</button>
  <button @click="recovery">recovery</button>>
</template>
