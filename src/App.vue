<template>
  <div id="app">
    <div id="header">
      <h3>上次更新时间：{{ updatedTmes }}</h3>
      <citySelect v-on:change="updatedArea"></citySelect>
    </div>
    <div id="content">
      <Now :parentdata="curWea"></Now>
      <risesetNow :parentdata="curWea"></risesetNow>
      <Wind :parentdata="curWea" ref="winds"></Wind>
      <daysTemp :parentdata="daysWea" ref="days"></daysTemp>
      <daysTip :parentdata="daysWea"></daysTip>
    </div>
  </div>
</template>

<script>
import risesetNow from './components/risesetNow.vue'
import Now from './components/now.vue'
import Wind from './components/wind.vue'
import daysTemp from './components/daysTemp.vue'
import daysTip from './components/daysTip.vue'
import citySelect from './components/citySelect.vue'
import api from './utils/index'
import fakeCurData from '../src/assets/json/fakeCurData.json'
import fakeData from '../src/assets/json/fakeData.json'

export default {
  name: 'App',
  components: {
    risesetNow, Now, Wind, daysTip, daysTemp, citySelect
  },
  data () {
    return {
      curWea: fakeCurData.result, // 实时天气数据
      daysWea: fakeData.result, // 7日天气数据
      updatedTmes: '', // 接收到请求的时间
      areaid: '' // 上一次选择的城市
    }
  },
  created () {
    console.log('欢迎访问：基于Vue搭建的城市级天气数据可视化系统。觉得ok可以点个star~~https://github.com/xling-77/Weather-Data-Visualization.git')
    // 此处用预设数据进行演示。如需请求数据，可调用已封装的方法httpdatas（），url相关数据在utils文件夹修改。
    this.curWea = fakeCurData.result
    this.daysWea = fakeData.result
    this.updatedTmes = this.timeFormatter()
  },
  mounted () {
    let that = this
    visualViewport.addEventListener('resize', function () {
      that.$refs.days.daysResize()
      that.$refs.winds.radarResize()
    })
  },
  beforeDestroy () {
    let that = this
    visualViewport.removeEventListener('resize', function () {
      that.$refs.days.daysResize()
      that.$refs.winds.radarResize()
    })
  },
  watch: {
    // 监听从citySelect组件传过来的areaid值。
    areaid (cur, pre) {
      localStorage.setItem('historyAreaid', cur)
      Promise.all([api.getWeather1(cur), api.getWeather7(cur)])
        .then(res => {
          console.log(res)
          this.curWea = res[0].data.result
          this.daysWea = res[1].data.result
          this.updatedTmes = this.timeFormatter()
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  methods: {
    // 接收city选择组件传过来的地区id：areaid
    updatedArea (e) {
      this.areaid = e
    },
    // 实时的时间
    timeFormatter () {
      let now = new Date()
      let year = now.getFullYear()
      let month = now.getMonth() + 1
      let day = now.getDate()
      let h = now.getHours()
      let m = now.getMinutes()
      if (day < 10) {
        day = `0${day}`
      }
      if (h < 10) {
        h = `0${h}`
      }
      if (m < 10) {
        m = `0${m}`
      }
      return year + '年' + month + '月' + day + '日' + h + '时' + m + '分'
    },
    // 请求接口数据
    httpdatas () {
      if (localStorage.getItem('historyAreaid')) {
        this.areaid = localStorage.getItem('historyAreaid')
        Promise.all([api.getWeather1(this.areaid), api.getWeather7(this.areaid)])
          .then(res => {
            console.log(res)
            this.curWea = res[0].data.result
            this.daysWea = res[1].data.result
            this.updatedTmes = this.timeFormatter()
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        this.curWea = fakeCurData.result
        this.daysWea = fakeData.result
      }
    }
  }
}
</script>

<style>
@import url(./assets/css/weatherIcon/iconfont.css);
@import url(./assets/css/grid.css);
#app{
  width: 100vw;
  height: 90vh;
  position: relative;
}
/* 二-2 头部样式，头部包括：更新时间、城市选择组件 */
#header{
  box-sizing: border-box;
  position: sticky;
  top: -10px;
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  align-items: baseline;
  justify-content: stretch;
  padding: 15px;
  z-index: 1;
  background-color: #0e3265;
}
/* 二-2 头部样式-更新时间 */
#header > h3{
  margin: 0;
  margin-left: 60px;
  text-align: left;
}
</style>
