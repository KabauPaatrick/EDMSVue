<template>
    <div class="layout">
      <NavBar />
      <div class="content-container">
        <router-view />
      </div>
      <PropertiesSideBar />
      <PageFooter />
    </div>
  </template>
  
<script>
import NavBar from "@/components/NavBar.vue";
import PageFooter from "@/components/PageFooter.vue";
import PropertiesSideBar from "@/components/PropertiesSideBar.vue"

export default {
    components: {
        NavBar,
        PageFooter,
        PropertiesSideBar
    },
    data() {
        return {

        };
    },

    methods: {
    },

};
</script>
  
<style></style>