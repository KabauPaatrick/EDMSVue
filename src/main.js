import { createApp } from 'vue'
import App from './App.vue'
import router from './router.js'
import "./assets/style.css";
import 'bootstrap/dist/css/bootstrap.css';

createApp(App)
.use(router)
.mount('#app')
