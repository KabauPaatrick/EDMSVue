import 'bootstrap/dist/css/bootstrap.css';
import { createApp } from 'vue';
import App from './App.vue';
import './assets/style.css';
import router from './router.js';

import 'sweetalert2/dist/sweetalert2.min.css';
import VueSweetalert2 from 'vue-sweetalert2';

import Toast, { POSITION } from 'vue-toastification';
import 'vue-toastification/dist/index.css';

import Vue3Progress from 'vue3-progress';

const app = createApp(App);
// app.config.globalProperties.baseApiUrl = 'http://127.0.0.1:8000';
app.config.globalProperties.baseApiUrl = 'http://edms-enpoints.bitz-itc.com';

app.use(VueSweetalert2);
const toast_options = {
  // You can set your default options here
  position: POSITION.BOTTOM_RIGHT,
};
app.use(Toast, toast_options);
const progress_options = {

  position: 'fixed',
  height: '8px',
  color: '#355b11',
};
app.use(Vue3Progress, progress_options);
app.use(router);
app.mount('#app');
