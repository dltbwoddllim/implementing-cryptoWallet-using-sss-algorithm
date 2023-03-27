<script>
// import { inject } from 'vue'
import Test from './components/TestEx.vue'
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
    Test
  },
  data() {
    return {
      count: 0,
      message: ''
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
      console.log(myMkey.privateKey)
    }
  }
  // created() {

  // }
}
</script>

<template>
  <Test />
  <div>{{ message }}</div>>
  <button @click="genprivKey">개인키 생성</button>>
</template>
