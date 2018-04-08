// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'
import lazyload from 'vue-lazyload'
import 'common/stylus/index.styl'

Vue.config.productionTip = false
fastclick.attach(document.body);
Vue.use(lazyload,{
  preLoad: 1.3,
  loading: 'static/loading/loading.png',
  attempt: 1
});



/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
