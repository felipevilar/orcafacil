import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import PrintTable from "../components/PrintTable.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/printable",
    name: "PrintTable",
    component: PrintTable,
    props: true,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
