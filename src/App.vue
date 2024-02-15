<template>
  <vue3-progress />
  <Login v-if="!token" @login-success="handleLoginSuccess" />
  <PageLayout v-if="token" />
</template>

<script>
import PageLayout from "@/components/PageLayout.vue";
import Login from '@/views/LoginView.vue';
export default {
  name: "HomeView",
  components: {
    PageLayout,
    Login,
  },
  data() {
    return {
      token: localStorage.getItem("edms_token"),
    };
  },
  mounted() {
    if (this.token) {
      this.$router.push({ path: "/dashboard" });
      this.$progress.finish();
    }
  },
  created() {
    this.$progress.start();

    this.$router.beforeEach((to, from, next) => {
      this.$progress.start();
      next();
    });

    this.$router.afterEach(() => {
      
      this.$progress.finish();

    });
  },
  methods: {
    handleLoginSuccess() {
      // Handle the login success event
      this.token = localStorage.getItem("edms_token");
      this.$router.push('/dashboard');
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
}
</style>