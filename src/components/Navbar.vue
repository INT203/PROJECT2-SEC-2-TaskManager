<script setup>
import userIcon from './icons/userIcon.vue'
import { ref, onUpdated } from 'vue';
import remindIcon from './icons/remindIcon.vue';
const prop = defineProps({
      boardName: String,
      tags: Array,
      todoRemind: Object
})
const emit = defineEmits([
      "searching",
      'showLogin',
      'reload'
])
const searchTags = ref([])
const showSearchBtn = ref(false)
const searchBox = ref('')
onUpdated(() => {
      emit("searching", [searchTags.value, searchBox.value])
})
</script>
 
<template>
      <nav class="navbar bg-base-100 absolute z-10">
            <div class="navbar-start">
                  <!-- PICTURE -->
                  <div class="flex flex-row">
                        <img src="/images/postit-icon.png" alt="post-it-picture-logo" class="w-12">
                        <p class="w-16 text-center my-auto font-Athiti">POST-IT</p>
                  </div>
            </div>
            <!-- THE NAME OF BOARD -->
            <div class="navbar-center">
                  <label for="menu-drawer" class="btn btn-ghost normal-case text-2xl font-Athiti">
                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 16 16">
                              <path fill="currentColor" fill-rule="evenodd"
                                    d="M0 3.75A.75.75 0 0 1 .75 3h14.5a.75.75 0 0 1 0 1.5H.75A.75.75 0 0 1 0 3.75ZM0 8a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H.75A.75.75 0 0 1 0 8Zm.75 3.5a.75.75 0 0 0 0 1.5h14.5a.75.75 0 0 0 0-1.5H.75Z"
                                    clip-rule="evenodd" />
                        </svg>
                        &nbsp;{{ boardName }}
                  </label>

            </div>
            <!-- SEARCH BOX AND FILTER -->
            <div class="navbar-end">
                  <!-- REMINDER  -->
                  <div class="dropdown dropdown-hover dropdown-bottom dropdown-end mr-1 top-0.5" :class="todoRemind['Remind'].length !== 0?'avatar online':''" >
                              <label class="btn btn-ghost btn-circle">
                              <remindIcon />
                              </label>
                              <div tabindex="0" class="dropdown-content card card-compact w-64 p-2 shadow bg-white text-black">
                                    <div class="card-body ">
                                          <h3 class="card-title">Reminder [ {{ todoRemind["Remind"].length }} ]</h3>
                                          <hr>
                                          <div class="form-control w-full text-sm font-semibold space-y-2">
                                                <label class="cursor-pointer label hover:bg-gray-300 hover:rounded-md">
                                                      <span class=" text-left">1 day left ( {{ todoRemind["OneDayLeft"].length }} )</span>
                                                </label>
                                                <label class="cursor-pointer label hover:bg-gray-300 hover:rounded-md">
                                                      <span class=" text-left">2 days left ( {{ todoRemind["TwoDayLeft"].length }} )</span>
                                                </label>
                                                <label class="cursor-pointer label hover:bg-gray-300 hover:rounded-md">
                                                      <span class=" text-left">3 days left ( {{ todoRemind["ThreeDayLeft"].length }} )</span>
                                                </label>
                                                <label class="cursor-pointer label hover:bg-gray-300 hover:rounded-md">
                                                      <span class=" text-left">Late ( {{ todoRemind["Late"].length }} )</span>
                                                </label>
                                          </div>
                                    </div>
                              </div>
                  </div>
                  <!-- FILTER : DROP DOWN //FILTER BY TAG(S) -->
                  <div class="dropdown dropdown-left btn btn-ghost btn-circle mr-1">
                        <label tabindex="0">
                              <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48" class="scale-50">
                                    <path
                                          d="M22 40q-.85 0-1.425-.575Q20 38.85 20 38V26L8.05 10.75q-.7-.85-.2-1.8Q8.35 8 9.4 8h29.2q1.05 0 1.55.95t-.2 1.8L28 26v12q0 .85-.575 1.425Q26.85 40 26 40Zm2-13.8L36 11H12Zm0 0Z" />
                              </svg>
                        </label>
                        <div tabindex="0"
                              class="dropdown-content card card-compact w-64 p-2 shadow bg-white text-black filter-box">
                              <div class="card-body ">
                                    <h3 class="card-title">Filter by tags</h3>
                                    <hr>
                                    <div class="form-control">
                                          <label @change="emit('reload')" class="cursor-pointer label" v-for="tag in tags">
                                                <span class=" text-left">{{ tag }}</span>
                                                <input type="checkbox" class="checkbox checkbox-info" :value="tag"
                                                      v-model="searchTags" />

                                          </label>
                                          <label @change="emit('reload')" class="cursor-pointer label">
                                                <span class=" text-left">Done</span>
                                                <input type="checkbox" class="checkbox checkbox-info" value="Done"
                                                      v-model="searchTags" />
                                          </label>
                                          <label @change="emit('reload')" class="cursor-pointer label">
                                                <span class=" text-left text-red-500">Non-tag(s)</span>
                                                <input type="checkbox" class="checkbox checkbox-info" value="None"
                                                      v-model="searchTags" />
                                          </label>
                                    </div>
                              </div>
                        </div>
                  </div>
                  <!-- SEARCH BOX : CLICK TO APPEAR  //SEARCH BY TOPIC -->
                  <button class="btn btn-ghost btn-circle" @click="showSearchBtn = !showSearchBtn">
                        <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48" class="scale-50" fill="none"
                              viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                  </button>
                  <input @change="emit('reload')" type="text" placeholder="topic / description" class="input input-bordered input-accent max-w-xs h-10"
                        v-show="showSearchBtn" v-model="searchBox" />
                        
                  <div class="dropdown dropdown-end h-12">
                        <label tabindex="0" class="btn btn-ghost btn-circle" @click="emit('showLogin')"><userIcon></userIcon></label>
                        <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                        
                        </ul>
                  </div>

            </div>
      </nav>
</template>
 
<style scoped>
.filter-box {
      box-shadow: 1px 0px 10px 3px rgba(0, 0, 0, 0.5);
      -webkit-box-shadow: 1px 0px 10px 3px rgba(0, 0, 0, 0.5);
      -moz-box-shadow: 1px 0px 10px 3px rgba(0, 0, 0, 0.5);
}</style>