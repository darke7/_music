<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <div class="content">
      <keep-alive>
        <router-view/>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import MHeader from 'components/m-header/m-header'
import tab from 'components/tab/tab'
export default {
  components:{
    MHeader,
    tab
  }
}
</script>


