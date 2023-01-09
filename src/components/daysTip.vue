<template>
  <article id="daysTip" class="boxSet">
  <h2>近期小贴士</h2>
  <p v-for="item in parentdata.list" :key="item.date">
    <span>
      <strong>{{ item.date }}：</strong>
      {{ item.tips }}
    </span>
  </p>
</article>
</template>

<script>
export default {
  props: {
    parentdata: {
      type: Object,
      default: function () {
        return {}
      }
    }
  }
}
</script>

<style>

</style>
