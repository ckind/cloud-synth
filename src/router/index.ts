import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import Session from "../views/Session.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/session",
    name: "Session",
    component: Session
  }
];

const router = new VueRouter({
  routes
});

export default router;
