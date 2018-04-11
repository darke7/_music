import Vue from 'vue'
import Router from 'vue-router'
const recommend = resolve => require(['components/recommend/recommend'],resolve);
const rank = resolve => require(['components/rank/rank'],resolve);
const singer = resolve => require(['components/singer/singer'],resolve);
const search = resolve => require(['components/search/search'],resolve);
const singerDetail = resolve => require(['components/singer-detail/singer-detail'],resolve);

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect:'/recommend'
    },
    {
      path: '/recommend',
      component:recommend
    },
    {
      path: '/rank',
      component:rank
    },
    {
      path: '/singer',
      component:singer,
      children:[
        {
          path:':id',
          component:singerDetail
        }
      ]
    },
    {
      path: '/search',
      component:search
    }
  ]
})
