import { createRouter, createWebHistory } from "vue-router";
import Board from "./views/Board.vue";
import Login from "./views/Login.vue";
import CreateAccount from "./views/CreateAccount.vue"

const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/",
    name: "Board",
    component: Board
  },
  {
    path: "/register",
    name: "CreateAccount",
    component: CreateAccount
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn").toLowerCase() === "true" ?? false
  if (!isLoggedIn && to.path !== "/login" && to.path !== "/register") {
    next("/login");
  }else {
    next()
  }
});

export default router;
