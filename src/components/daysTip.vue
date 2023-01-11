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
#daysTip > p{
  box-sizing: border-box;
  box-shadow: 3px 3px 5px 2px rgba(1, 32, 123, .8),-2px -2px 5px 2px rgba(238,247,242,.7);
  border-radius: 5px;
  padding: 0.2rem;
  height: 1.2rem;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
  cursor: wait;
}
#daysTip > p:hover{
  box-shadow: 3px 3px 5px 2px rgba(1, 32, 123, .8),-1px -1px 5px 2px rgba(238,247,242,.5);
}
#daysTip > p > span{
  width: auto;
  height: 100%;
  /* 设置文字溢出隐藏 */
  overflow: hidden;
  white-space: wrap;
}
#daysTip > p:hover span {
  position: absolute;
  width: auto;
  text-overflow: unset;
  overflow: visible;
  animation: slide 10s linear infinite normal;
}
@keyframes slide {
  from {
    top: 0;
  }
  20%{
    top:-85%;
  }
  50%{
    top: -200%;
  }
  to {
    top: -400%;
  }
}
</style>
