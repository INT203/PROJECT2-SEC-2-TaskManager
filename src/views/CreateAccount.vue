<script setup>
import { ref, computed  } from "vue"
import { useRouter, RouterLink } from "vue-router";
const router = useRouter()
const username = ref("")
const password = ref("")
const confPwd = ref("")
const emit = defineEmits(["loginUser"])
const PassWordRegE = /^\w{8,16}$/g
let warningText = ref("")
const data = computed(() => {
      return {
            id: new Date().getTime(),
            user: username.value,
            pass: password.value,
            todo: [],
            board: ["Default board"]
      }
})


const createUser = async () => {
      console.log(PassWordRegE.test(data.value.pass))
      if (!PassWordRegE.test(data.value.pass)) {
            warningText.value = "Use 8 to 16 characters which not contain spacial characters"
      }
      if (await isUserValid(data.value) && PassWordRegE.test(data.value.pass)) {
            fetch("http://localhost:3001/user", {
                  method: "POST",
                  headers: {
                        "Content-Type": "application/json",
                  },
                  body: JSON.stringify(data.value)
            }).then(() => {
                  localStorage.setItem("isLoggedIn", true)
                  emit("loginUser", data.value);
                  router.push("/")
                  
            }).catch((err) => {
                  console.error(err)
            })
      }
}

const isUserValid = (data)=> {
      console.log(data)
      return fetch("http://localhost:3001/user")
      .then((resp) => resp.json())
      .then((fetchData) => {
            if (data.user.length > 0) {
                  return fetchData
            }
            else {
                  warningText.value = "Username can't be empty"
            }
      })
      .then((fetchData) => {
            if (fetchData.every( user => user['user'] !== data.user)) return fetchData
            else warningText.value = "This username is already exist"
      })
      .catch((err) => console.log(err))
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
                  <p class="pl-1 mt-2 text-red-600">{{ password !== confPwd ? "Passwords do not match.": isPassValid == false ? passInvalid : warningText }}</p>
                  <button class="btn btn-accent mt-3" @click="$router.back()"> Go Back </button>
                  <button :disabled="password !== confPwd && isUserValid" class="btn btn-accent mt-3" @click="createUser">Create</button>
            </div>
      </div>
</template>
 
<style scoped></style>