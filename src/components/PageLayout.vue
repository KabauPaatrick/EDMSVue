<template>
  <div class="layout">
    <!-- Content Header (Page header) -->
    <section class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1>{{ currentRouteName }}</h1>
          </div>
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item"><a href="" @click="$router.push('/')">Home</a></li>
              <li class="breadcrumb-item active">{{ currentRouteName }}</li>
            </ol>
          </div>
        </div>
      </div><!-- /.container-fluid -->
    </section>
    <NavBar />
    <div class="content-container">
      <router-view />
    </div>
    <RightSidebar />
    <PageFooter />
  </div>
</template>
  
<script>
import NavBar from "@/components/NavBar.vue";
import PageFooter from "@/components/PageFooter.vue";
import RightSidebar from "@/components/RightSidebar.vue";

export default {
  components: {
    NavBar,
    PageFooter,
    RightSidebar,
  },
  data() {
    return {

    };
  },

  methods: {
  },
  computed: {
    currentRouteName() {
      return this.$route.name;
    }
  }
};
</script>
  
<style></style>