<script setup>
      const prop = defineProps({
            postIt : Object
      }) 
      const emit = defineEmits([
            "setDone"
      ])
      const setDone = () => {
            emit("setDone" , prop.postIt.createdDate)
      }

</script>
 
<template>
<div>
      <div id="PoseItDetail" class="lg:h-3/5 lg:w-2/5 px-5 bg-white absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 rounded-2xl">
            <div id="leftDetail" class="my-auto overflow-clip">
                  <h2 class="mt-3 text-5xl font-bold border-b-2 w-5/6 pb-4 mx-auto">{{ postIt.topic }}</h2>
                  <p class="mt-5 text-xl w-5/6 p-3 rounded-md bg-gray-200 h-4/5 mx-auto">{{
                        postIt.description }}</p>
            </div>

            <div id="rightDetail" class="border-l-2 p-5 my-auto overflow-scroll scrollbar-detail">
                  <h3 class="text-2xl font-bold border-b-2 pb-2">Tags</h3>
                  <div id="tagsList" class="w-full block">
                        <div class="badge w-28 h-7 mt-3 mr-1 text-base overflow-clip"
                              v-for="tag in postIt.tags">{{ tag }}</div>
                  </div>
                  <h3 class="text-2xl font-bold border-b-2 pb-2 mt-5">Create Date</h3>
                  <div class="w-full block">
                        <div class="text-xl pt-2">{{ postIt.createdDate.toLocaleDateString("en-GB", {
                              day:
                                    "2-digit", month: "2-digit", year: "numeric"
                        }) }}</div>
                  </div>
                  <h3 class="text-2xl font-bold border-b-2 pb-2 mt-5">Due Date</h3>
                  <div class="w-full block">
                        <div class="text-xl pt-2">{{ postIt.dueDate.toLocaleDateString("en-GB", {
                              day:
                                    "2-digit", month: "2-digit", year: "numeric"
                        }) }}</div>
                  </div>
                  <div class="h-1/4 bottom-0 flex flex-col p-1 mt-3">
                        <button class="btn btn-info border-none hover:btn-success lg:text-xl sm:text-lg m-1 w-fit" @click="setDone">{{postIt.done?'Not done':'Done'}}</button>
                        <label for="remove-modal" class="btn btn-error border-none hover:btn-warning lg:text-xl sm:text-lg m-1 w-fit">Remove</label>
                  </div>
            </div>

      </div>
</div>
</template>
 
<style scoped>
      #PoseItDetail {
      display: grid;
      grid-template-columns: 1.5fr 1fr;
      grid-template-rows: 1fr;
      grid-column-gap: 0px;
      grid-row-gap: 0px;
}

#leftDetail {
      grid-area: 1 / 1 / 2 / 2;
      height: 90%;
}

#rightDetail {
      grid-area: 1 / 2 / 2 / 3;
      height: 90%;

}
</style>