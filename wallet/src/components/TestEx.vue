<script>
let id = 0;
import ChildComp from './ChildComp.vue'

export default {
  data() {
    return {
      message: '안녕 Vue!',
      titleClass: 'title',
      count: 0,
      text: "",
      awesome: true,
      newTodo: '',
      todos: [
        { id: id++, text: 'HTML 배우기' },
        { id: id++, text: 'JavaScript 배우기' },
        { id: id++, text: 'Vue 배우기' }
      ]
    }
  },
  methods: {
    increment() {
      // 컴포넌트의 count 상태 업데이트
      this.count++
    },
    onInput(e) {
      // v-on 핸들러는 네이티브 DOM 이벤트를 인자로 받습니다.
      this.text = e.target.value
    },
    toggle() {
      this.awesome = !(this.awesome)
    },
    addTodo() {
      // ...
      this.newTodo = ''
    },
    removeTodo(todo) {
      this.todos.remove(todo)
    }
  },
  watch: {
    count(newCount) {
      // 예, console.log()는 사이드 이펙트입니다.
      console.log(`새로 센 숫자 값은: ${newCount}`)
    }
  },
  components: {
    ChildComp
  }
}
</script>

<template>
<ChildComp :msg=message />
  <form @submit.prevent="addTodo">
    <input v-model="newTodo">
    <button>할 일 추가</button>
  </form>
  <ul>
    <li v-for="todo in todos" :key="todo.id">
      {{ todo.text }}
      <button @click="removeTodo(todo)">X</button>
    </li>
  </ul>
  <div v-bind:id="dynamicId"></div>
  <div :id="dynamicId">
    <h1>나를 다이나믹하게 만들어주세요!</h1>
  </div>
  <h1>나를 다이나믹하게 만들어주세요!</h1>
  <h1>{{ message }}</h1>
  <h1>{{ message.split('').reverse().join('') }}</h1>
  <button v-on:click="increment">{{ count }}</button>
  <button @click="increment">{{ count }}</button>
  <input :value="text" @input="onInput" placeholder="여기에 입력하기">
  <p>{{ text }}</p>
  <button @click="toggle">토글 버튼</button>
  <h1 v-if="awesome">Vue는 굉장해! 엄청나!</h1>
  <h1>오 안돼 😢</h1>
</template>
