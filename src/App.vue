<script setup>
import { ref , onMounted, inject} from "vue"
let currentUser = ref({
    "id": "0",
    "user": "guess",
    "pass": "1234",
    "todo": [
    ],
    "board": ["Default board"]
})


const tryLogin = (user) => {
      console.log(user)
      currentUser.value = user
}

</script>
<template>
      <router-view @loginUser="(user) => tryLogin(user)" :user="currentUser"> </router-view>{{ $route.path }}
</template>

<style >
@import url('https://fonts.googleapis.com/css2?family=Athiti:wght@700&display=swap');

body {
      font-family: 'Athiti', sans-serif;
}

.font-Athiti {
      font-family: 'Athiti', sans-serif;
}

.scrollbar-hide::-webkit-scrollbar {
      display: none;
}

.scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
}

.board-top {
      top: 55%;
}

.my-scrollbar::-webkit-scrollbar {
      width: 16px;
}

.my-scrollbar::-webkit-scrollbar-track {
      background-color: #fff88f;
      border-radius: 100px;
}

.my-scrollbar::-webkit-scrollbar-thumb {
      background-color: #fda400;
      border-radius: 100px;
}

.scrollbar-detail::-webkit-scrollbar {
      width: 0px;
}

.scrollbar-detail::-webkit-scrollbar-track {
      border-radius: 100px;
}

.scrollbar-detail::-webkit-scrollbar-thumb {
      border-radius: 100px;
}

.scrollbar-detail::-webkit-scrollbar:horizontal {
      height: 0;
      width: 0;
      display: none;
}

.scrollbar-detail::-webkit-scrollbar-thumb:horizontal {
      display: none;
}

.bottomLine::after {
      content: '';
      position: absolute;
      margin: 0 auto;
      left: 2.5%;
      width: 95%;
      transform: scaleX(0);
      height: 2px;
      bottom: 0;
      background-color: #fda400;
      transform-origin: bottom center;
      transition: transform 0.70s ease-out;
}

.bottomLine:hover::after {
      transform: scaleX(1);
      transform-origin: bottom center;
}
</style>
