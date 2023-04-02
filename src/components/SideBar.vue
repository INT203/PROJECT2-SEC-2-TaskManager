<script setup>
      import { ref } from 'vue';
      import deleteBoard from './icons/deleteBoard.vue';
      import checkAgree from './icons/checkAgreeIcon.vue'
      import checkAbort from './icons/checkAbort.vue'

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
                        <deleteBoard/>
                  </button>
                  <button v-show="isConfirm" id="btn" class="invisible btn btn-circle btn-outline btn-sm" @click="removeB(board)">
                        <checkAgree/> 
                  </button>
                  <button v-show="isConfirm" id="btn" class="invisible btn btn-circle btn-outline btn-sm" @click="isConfirm = !isConfirm">
                        <checkAbort/>
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