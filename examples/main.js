import Vue from 'vue';
import router from './router';
import App from './App';
import Eagle from '../src';
import '../src/styles/index';
import DemoBlock from './components/DemoBlock';

Vue.use(Eagle);
Vue.component('DemoBlock', DemoBlock);
Vue.config.productionTip = false;

new Vue ({
  el: '#app',
  router,
  template: '<App />',
  components: { App }
});