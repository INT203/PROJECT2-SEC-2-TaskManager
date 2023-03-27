<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
const router = useRouter()
const username = ref("")
const password = ref("")
const emit = defineEmits([
    "loginUser",
])
const tryLogin = () => {
  fetch(`http://localhost:3001/user?user=${username.value}`)
    .then(resp => resp.json())
    .then((data) => {
      if (data.length === 0) {
        console.log('This username in not exist ')
      }
  
      else {
        return data
      }
    })
    .then(data => {
      if (data[0].pass == password.value) {
        localStorage.setItem('isLoggedIn' , "true")
        emit("loginUser" , ...data)
        router.push("/")
        return data[0]
      } else if (password.value.length === 0) console.log('Password is required')
    })
    .catch(() => { console.log('Some requirement is missing') })
}



</script>
 
<template>
    <div class="w-full z-50">
        <div
            class="absolute bg-white lg:h-3/5 lg:w-1/4 px-5 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl">
            <h1 class="mt-5 text-4xl font-bold border-b-2 w-11/12 pb-4 mx-auto"> Login </h1>
            <div class="form-control">
                <span class="label-text pb-3 pt-5 text-3xl ">Username</span>
                <input type="text" class="input input-bordered w-full" v-model="username">
                <span class="label-text pb-3 pt-5 text-3xl ">PassWord</span>
                <input type="password" class="input input-bordered w-full" v-model="password">
                <div class="input-group">
                    <input type="checkbox" class="checkbox" id="passCheckbox" ref="passCheckbox">
                    <label for="passCheckbox">Show password</label>
                </div>

            </div>
            <div class="w-full space-x-2">
              <button class="btn" @click="tryLogin">Login</button>
              <RouterLink to="/register"><button class="btn">Register</button></RouterLink>
            </div>
            
        </div>
    </div>
</template>

<style scoped>
</style>