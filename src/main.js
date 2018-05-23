// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import fastclick from 'fastclick'
import lazyload from 'vue-lazyload'

// 因为vConsole并不需要调用，
// 所以前面加“eslint-disable no-unused-vars”规避掉eslint语法检查

/* eslint-disable no-unused-vars */
import vConsole from 'vconsole'
new vConsole()

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
  store,
  components: { App },
  template: '<App/>'
})
