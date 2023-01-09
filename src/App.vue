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
    // 此处用预设数据进行演示。如需请求数据，可调用已封装的方法httpdatas（），url相关数据在utils文件夹修改。
    this.curWea = fakeCurData.result
    this.daysWea = fakeData.result
    this.updatedTmes = this.timeFormatter()
  },
  mounted () {
    visualViewport.addEventListener('resize', this.chartsResize)
  },
  beforeDestroy () {
    visualViewport.removeEventListener('resize', this.chartsResize)
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
      return year + '年' + month + '月' + day + '日' + h + '时' + m + '分'
    },
    // echarts图表自适应
    chartsResize () {
      this.$refs.days.daysResize()
      this.$refs.winds.radarResize()
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
</style>
