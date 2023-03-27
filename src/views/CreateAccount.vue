<script setup>
import { ref } from "vue"
import { useRouter, RouterLink } from "vue-router";
const router = useRouter()
const username = ref("")
const password = ref("")
const confPwd = ref("")
const emit = defineEmits(["setCurrent"])

const createUser = async () => {
      try{
      const data = ref({
            id: new Date().getTime(),
            user: username.value,
            pass: password.value,
            todo: [],
            board: ["Default board"]
      })
      await fetch("http://localhost:3001/user", {
            method: "POST",
            headers: {
                  "Content-Type": "application/json",
            },
            body: JSON.stringify(data.value)
      })
      router.push("/")
      if (response.ok) {
      emit("setCurrent", data.value);
      console.log("create");
    } else {
      console.error(`Failed to create user: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error(`Failed to create user: ${error}`);
  }
}


</script>
 
<template>
      <div
            class="absolute bg-white lg:h-3/5 lg:w-1/4 px-5 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 rounded-2xl">
            <h1 class="mt-5 text-4xl font-bold border-b-2 w-11/12 pb-4 mx-auto"> Craete New Account </h1>
            <div class="form-control">
                  <span class="label-text pb-3 pt-5 text-3xl ">Username</span>
                  <input v-model="username" type="text" class="input input-bordered w-full">
            </div>
            <div class="form-control">
                  <span class="label-text pb-3 pt-5 text-3xl ">PassWord</span>
                  <input v-model="password" type="password" class="input input-bordered w-full">
            </div>
            <div class="form-control">
                  <span class="label-text pb-3 pt-5 text-3xl ">Confirm</span>
                  <input v-model="confPwd" type="password" class="input input-bordered w-full">
            </div>
            <div class="w-full space-x-2">
                  <p class="pl-1 mt-2 text-red-600">{{ password !== confPwd ? "Passwords do not match." : "" }}</p>
                  <button :disabled="password !== confPwd" class="btn btn-accent mt-3" @click="createUser">Create</button>
                  <RouterLink to="/login"><button class="btn btn-accent mt-3">Login</button></RouterLink>
            </div>
      </div>
</template>
 
<style scoped></style>