<script setup>
      import { ref } from 'vue';

      const prop = defineProps({
            boards : Array
      })
      const emit = defineEmits([
            "close",
            "goToBoard",
            "remove"
      ])
      const isConfirm = ref(false)
      const removeB = (b) => {
            console.log(b)
            emit('remove', b)
            isConfirm.value = !isConfirm.value
      }
</script>
 
<template>
<label for="menu-drawer" :class="['drawer-overlay']"></label>
<ul class="menu p-4 w-80 bg-base-100 text-base-content">
      <h2 class="w-full text-center font-bold  text-2xl pb-7 pt-2">Board</h2>
      <hr>
      <label @click="emit('close')" for="add-board-modal" class="mt-2 btn btn-ghost  w-full p-0 pr-1 border border-gray-300 bottomLine pt-1 pb-1 font-semibold text-lg">Create Board</label>
      <li  v-for="board in boards" @mouseleave="isConfirm = false">
            <div id="boardList" class=" w-full p-0 pr-1 bottomLine pt-1 pb-1">
                  <span class="w-full h-full pt-2 p-3 m-0 font-semibold text-lg" @click="emit('goToBoard', board)">{{ board }}</span>
                  <button v-show="boards.length != 1 && isConfirm == false" id="btn" class="invisible btn btn-ghost border hover:border-red-700 hover:bg-red-100 hover:text-red-700" @click="isConfirm = !isConfirm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                              <path fill="currentColor" d="M7 4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2h4a1 1 0 1 1 0 2h-1.069l-.867 12.142A2 2 0 0 1 17.069 22H6.93a2 2 0 0 1-1.995-1.858L4.07 8H3a1 1 0 0 1 0-2h4V4zm2 2h6V4H9v2zM6.074 8l.857 12H17.07l.857-12H6.074z"/>
                        </svg>
                  </button>
                  <button v-show="isConfirm" id="btn" class="invisible btn btn-circle btn-outline btn-sm" @click="removeB(board)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 36 36">
                              <path fill="currentColor" d="M13.72 27.69L3.29 17.27a1 1 0 0 1 1.41-1.41l9 9L31.29 7.29A1 1 0 0 1 32.7 8.7Z" class="clr-i-outline clr-i-outline-path-1"/>
                              <path fill="none" d="M0 0h36v36H0z"/>
                        </svg> 
                  </button>
                  <button v-show="isConfirm" id="btn" class="invisible btn btn-circle btn-outline btn-sm" @click="isConfirm = !isConfirm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M20 20L4 4m16 0L4 20"/>
                        </svg>
                  </button>
            </div>
      </li>
</ul>
</template>
 
<style scoped>
#boardList:hover > #btn {
      visibility: visible;
}
</style>