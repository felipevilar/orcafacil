<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    //
  }),
};
</script>

<style>
.fixed-size {
  max-width: 1280px !important;
  border: 1px solid rgb(214, 214, 214);
  border-radius: 4px;
  margin: 10px auto;
  background-color: #fff;
}
#app {
  background-color: rgb(56, 56, 56);
}
</style>
