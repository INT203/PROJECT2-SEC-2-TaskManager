import { createRouter, createWebHistory } from "vue-router";
import App from "./views/AppPage.vue";
import Login from "./views/Login.vue";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/",
    name: "App",
    component: App
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn").toLocaleLowerCase() === "true" ?? false
  if (!isLoggedIn && to.path !== "/login") {
    next("/login");
  }  else {
    next()
  }
});

export default router;
