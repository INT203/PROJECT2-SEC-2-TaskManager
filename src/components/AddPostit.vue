<script setup>
      import { ref, computed, inject} from 'vue'
      const newPostItTags = ref([])
      const prop = defineProps({
            board: String,
            tags: Array
      })
      const emit = defineEmits([
            "close",
            "create"
      ])
      let postit = ref({
            topic: '',
            tags: [],
            description: '',
            createdDate: new Date(),
            dueDate: new Date(),
            board: ''
      })
      const createPostIt = () => {
            emit('create',{
                  topic: postit.value.topic,
                  tags: newPostItTags.value,
                  description: postit.value.description,
                  createdDate: new Date(),
                  dueDate: new Date(postit.value.dueDate),
                  board: prop.board
            })


            newPostItTags.value = []
            postit.value ={
                  topic: '',
                  tags: [],
                  description: '',
                  createdDate: new Date(),
                  dueDate: new Date(),
                  board: ''
            }
            emit('close')
      }

</script>
 
<template>
<div class="h-3/5 w-2/5 px-5 bg-white absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 rounded-2xl flex flex-col">
      <h1 class="text-5xl font-bold mt-5">New Post-it</h1>
      <div>
            <input type="text" placeholder="Enter Task" maxlength="25" class="border border-gray-500 mt-5 input w-1/2 ml-1"
                  v-model="postit.topic">
            <div class="dropdown">
                  <label tabindex="0" class="btn m-1">Tags</label>
                  <div tabindex="0"
                        class="dropdown-content card card-compact w-64 p-2 shadow bg-white text-black filter-box">
                        <div class="card-body ">
                              <div class="form-control">
                                    <label class="cursor-pointer label" v-for="tag in tags">
                                          <span>{{ tag }}</span>
                                          <input type="checkbox" class="checkbox checkbox-info" :value="tag"
                                                v-model="newPostItTags" />
                                    </label>
                              </div>
                        </div>
                  </div>
            </div>
      </div>
      <h3 class="text-2xl font-semibold">Detail</h3>
      <textarea type="text" placeholder="Detail" class="border border-gray-500 m-1 input h-1/4 px-2 py-1"
            v-model="postit.description"></textarea>
      <h3 class="text-xl font-semibold">Due Date</h3>
      <input type="date" placeholder="Due date" class="border border-gray-500 m-1 w-1/3 input"
            v-model="postit.dueDate" :min="new Date().toISOString().substring(0,10)">
      <button @click="createPostIt"
            class="border border-gray-500 mt-5 btn bg-blue-500 hover:bg-blue-400">Add</button>
</div>
</template>
 
<style scoped>

</style>