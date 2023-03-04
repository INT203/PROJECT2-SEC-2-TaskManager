<script setup>
      let prop = defineProps({
            card: Object
      })
</script>
 
<template>
<div class="indicator h-fit">
      <span class="indicator-item badge badge-success font-semibold" v-if="card.done">Done</span> 
      <div class="card w-80 h-fit bg-orange-300 shadow-xl" >
            <div class="card-body mb-2 max-h-80">
                  <!-- TOPIC -->
                  <h2 class="card-title font-bold text-2xl text-white ">
                        {{ card.topic }}
                  </h2>
                  <!-- TAGS -->
                  <div class="card-actions justify-end p-1 m-1">
                        <div class="badge badge-outline bg-base-100" v-for="tag in card.tags">{{ tag }}</div>
                  </div>
                  <!-- DESCRIPTION -->
                  <p class="m-1 font-semibold text-sm text-white overflow-clip"> Due date : {{ card.dueDate.toLocaleDateString("en-GB", {day:"2-digit", month: "2-digit", year: "numeric"}) }}</p>
                  <hr>
                  <p class="m-1 font-semibold text-white overflow-clip">{{ card.description }}</p>
            </div>
      </div>
</div>
</template>
 
<style scoped>

</style>