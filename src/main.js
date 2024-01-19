import { createApp } from 'vue'
import App from './App.vue'
import router from './router.js'
import "./assets/style.css";
import 'bootstrap/dist/css/bootstrap.css';

const app = createApp(App);
app.config.globalProperties.baseApiUrl = 'http://127.0.0.1:8000';
app.use(router);
app.mount('#app');
