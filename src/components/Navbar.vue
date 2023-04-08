<script setup>
import userIcon from './icons/userIcon.vue'
import { ref, onUpdated } from 'vue';
import remindIcon from './icons/remindIcon.vue';
import burgerIcon from './icons/burgerIcon.vue';
import dropDownIcon from './icons/dropDownIcon.vue'
import searchBoxIcon from './icons/searchBoxIcon.vue'
import { RouterLink } from 'vue-router';
let ReminderBoard = ref('')
const prop = defineProps({
      boardName: String,
      tags: Array,
      todoRemind: Object
})
const emit = defineEmits([
      'showReminder',
      'searching',
      'showLogin',
      'reload'
])
const searchTags = ref([])
const showSearchBtn = ref(false)
const searchBox = ref('')

const showReminder = (Reminder) => {
      ReminderBoard.value = Reminder
      emit('showReminder' , Reminder)
}
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
                        <burgerIcon/>
                        &nbsp;{{ boardName ?? ReminderBoard}}
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
                                                <label @click="showReminder('OneDayLeft')" class="cursor-pointer label hover:bg-gray-300 hover:rounded-md">
                                                      <span class=" text-left">1 day left ( {{ todoRemind["OneDayLeft"].length }} )</span>
                                                </label>
                                                <label @click="showReminder( 'TwoDayLeft')" class="cursor-pointer label hover:bg-gray-300 hover:rounded-md">
                                                      <span class=" text-left">2 days left ( {{ todoRemind["TwoDayLeft"].length }} )</span>
                                                </label>
                                                <label @click="showReminder('ThreeDayLeft')" class="cursor-pointer label hover:bg-gray-300 hover:rounded-md">
                                                      <span class=" text-left">3 days left ( {{ todoRemind["ThreeDayLeft"].length }} )</span>
                                                </label>
                                                <label @click="showReminder('Late')" class="cursor-pointer label hover:bg-gray-300 hover:rounded-md">
                                                      <span class=" text-left">Late ( {{ todoRemind["Late"].length }} )</span>
                                                </label>
                                          </div>
                                    </div>
                              </div>
                  </div>
                  <!-- FILTER : DROP DOWN //FILTER BY TAG(S) -->
                  <div class="dropdown dropdown-hover dropdown-bottom dropdown-end btn btn-ghost btn-circle mr-1">
                        <label tabindex="0">
                              <dropDownIcon/>
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
                        <searchBoxIcon/>
                  </button>
                  <input @change="emit('reload')" type="text" placeholder="topic / description" class="input input-bordered input-accent max-w-xs h-10"
                        v-show="showSearchBtn" v-model="searchBox" />
                        
                  <div class="dropdown dropdown-end h-12">
                        <label tabindex="0" class="btn btn-ghost btn-circle" @click="emit('showLogin')"><userIcon></userIcon></label>
                        <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                               <li><RouterLink to="/register">Register</RouterLink></li> 
                               <li><RouterLink to="/login">Sign Out</RouterLink></li>
                               <li><label for="delete-acc" class="text-red-600">Delete User</label></li>
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