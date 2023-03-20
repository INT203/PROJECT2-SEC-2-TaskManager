import { createApp , provide , inject , ref} from 'vue'
import router from './router'
import App from './App.vue'
import './assets/main.css'
localStorage.setItem("isLoggedIn" , false)
createApp(App)
.use(router)
.mount('#app')
