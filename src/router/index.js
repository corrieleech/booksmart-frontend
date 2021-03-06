import { createRouter, createWebHistory } from "vue-router";
import AboutView from "../views/AboutView.vue";
import SignupView from "../views/SignupView.vue";
import LoginView from "../views/LoginView.vue";
import LogoutView from "../views/LogoutView.vue";
import UsersShow from "../views/UsersShow.vue";
import ClubsIndex from "../views/ClubsIndex.vue";
import ClubsNew from "../views/ClubsNew.vue";
import ClubsShow from "../views/ClubsShow.vue";

const routes = [
  {
    path: "/",
    name: "about",
    component: AboutView,
  },
  {
    path: "/signup",
    name: "signup",
    component: SignupView,
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/logout",
    name: "logout",
    component: LogoutView,
  },
  {
    path: "/users/:id",
    name: "show",
    component: UsersShow,
  },
  {
    path: "/clubs",
    name: "clubs",
    component: ClubsIndex,
  },
  {
    path: "/clubs/new",
    name: "clubs-new",
    component: ClubsNew,
  },
  {
    path: "/clubs/:id",
    name: "clubsshow",
    component: ClubsShow,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
