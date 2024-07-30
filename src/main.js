import { createApp } from 'vue';
import App from './App.vue';
import router from './router.js';
import './style.css';
import './components/popups/popup-styles.css';

const app = createApp(App);

app.use(router);

app.mount('#app');
