<script setup>
import { ref, computed, onUpdated  } from "vue"
import { useRouter } from "vue-router";
const router = useRouter()
const username = ref("")
const password = ref("")
const confPwd = ref("")
const emit = defineEmits(["loginUser"])
const PassWordRegE = /^\w{8,16}$/g // Any charecters except specical charecters. Equivalent to [a-zA-Z-0-9_]
let userToken
let passToken

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

onUpdated(()=>{
      if (username.value !== userToken || password.value !== passToken) {
            warningText.value = ""
      }
})

const isPassValid = (data) => {
      return PassWordRegE.test(data)
}

const createUser = async () => {
      userToken = username.value
      passToken = password.value
      if (!isPassValid(data.value.pass)) {
            warningText.value = "Your password must be between 8 to 16 characters and do not contain special charecters."
            
      } else if (await isUserValid(data.value)) {
            try {
                  await fetch("http://localhost:3001/user", {
                        method: "POST",
                        headers: {
                              "Content-Type": "application/json",
                        },
                        body: JSON.stringify(data.value)
                  })
                  localStorage.setItem("isLoggedIn", true)
                  emit("loginUser", data.value);
                  router.push("/")
            }
            catch(err) {
                  alert("Unexpect error is occur: " + err)
            }
      }
}

const isUserValid = async (data)=> {
      try {
            let resp = await fetch("http://localhost:3001/user")
            let fetchData = await resp.json() 
            if (data.user.length > 0) {
                  if (fetchData.every( user => user['user'] !== data.user)) return true
                  else throw new Error("This username already exists.")
            }
            else {
                  throw new Error("Username can't be empty.")
            }
      }
      catch(err)  {
            warningText.value = err
            return false
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
                  <p class="pl-1 mt-2 text-red-600">{{ password !== confPwd ? "Passwords do not match.":warningText }}</p>
                  <button class="btn btn-accent mt-3" @click="$router.back()"> Go Back </button>
                  <button :disabled="password !== confPwd && isUserValid" class="btn btn-accent mt-3" @click="createUser">Create</button>
            </div>
      </div>
</template>
 
<style scoped></style>