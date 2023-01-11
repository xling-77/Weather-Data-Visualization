<template>
<div id="now" class="boxSet">
  <h2>今日天气</h2>
  <div id="container">
    <div id="brief">
      <!-- 城市名 -->
      <p>{{ propdata.area }}</p>
      <!-- 实时温度 -->
      <p>
        <span id="curTemp" :style="warningTemp(removeUnit(propdata.real))">{{ removeUnit(propdata.real) }}</span>
        &#x2103;
      </p>
      <!-- 最高温度/最低温度 -->
      <p>
        <span>{{ propdata.highest }}</span> / <span id="lowTemp">{{ propdata.lowest }}</span>
      </p>
    </div>
    <div id="indexContainer">
      <!-- 实时天气 -->
      <div class="corner">
        <p><span :class="weatherIcon" class="iconfont white"></span></p>
        <p>{{ propdata.weather }}</p>
      </div>
      <!-- 紫外线强度 -->
      <div class="corner">
        <p class="white">{{ uvIndex(propdata.uv_index) }}</p>
        <p>紫外线</p>
      </div>
      <!-- 空气质量 -->
      <div class="corner">
        <p class="white">{{aqiIndex(propdata.aqi)}}</p>
        <p>空气质量</p>
      </div>
    </div>
    <div id="point">
      <!-- 天气预警信息。没有就不显示 -->
      <div v-if="alarm">
        <strong>{{ alarmlevel }}{{ alarmtype }}预警</strong>
        <p class="indent">{{ alarmcontent }}</p>
      </div>
      <!-- 生活小贴士 -->
      <template>
        <strong>今日小贴士：</strong>
        <p class="indent">{{ propdata.tips }}</p>
      </template>
    </div>
  </div>
</div>
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
  },
  data () {
    return {
      propdata: this.parentdata, // 接收父组件数据，即实时天气情况
      alarm: false, // v-if的条件值，用于是否显示天气预警div
      alarmlevel: '', // 天气预警级别
      alarmtype: '', // 天气预警类型
      alarmcontent: '' // 天气预警内容
    }
  },
  watch: {
    parentdata: {
      handler (cur, pre) {
        this.propdata = cur
        // 在watch中再次调用，保证实时更新
        this.alarms()
      },
      deep: true,
      // 强制立即执行回调
      immediate: true
    }
  },
  created () {
    this.alarms()
  },
  computed: {
    // 处理温度数据，如带单位，就去除单位；否则直接输出
    removeUnit () {
      return (val) => {
        if (typeof val === 'string') {
          let realTemp = val.split('')
          realTemp.pop()
          realTemp = Number(realTemp.join(''))
          return realTemp
        } else {
          return val
        }
      }
    },
    // 温度数值预警说明
    warningTemp () {
      return (val) => {
        if (val > 40 | val < -25) {
          return {textShadow: '0 0 0.8rem red'} // 红色预警
        } else if (val > 37 | val < -20) {
          return {textShadow: '0 0 0.8rem orange'} // 橙色预警
        } else if (val > 35 | val < -15) {
          return {textShadow: '0 0 0.8rem yellow'} // 黄色预警
        } else if (val < -10) {
          return {textShadow: '0 0 0.8rem blue'} // 蓝色低温预警
        } else {
          return val
        }
      }
    },
    // 天气图标添加
    weatherIcon: function () {
      let weathercode = this.propdata.weatherimg.slice(0, -4)
      return `icon-tianqi-${weathercode}`
    },
    // 紫外线指数说明
    uvIndex () {
      return (val) => {
        if (val < 3) {
          return '最弱'
        } else if (val < 5) {
          return '弱'
        } else if (val < 7) {
          return '中等'
        } else if (val < 10) {
          return '强'
        } else {
          return '很强'
        }
      }
    },
    // 空气质量指数说明
    aqiIndex () {
      return (val) => {
        if (val < 50) {
          return '优'
        } else if (val < 100) {
          return '良'
        } else if (val < 150) {
          return '轻度污染'
        } else if (val < 200) {
          return '中度污染'
        } else if (val < 300) {
          return '重度污染'
        } else {
          return '严重污染'
        }
      }
    }
  },
  methods: {
    // 判断是否有天气预警
    alarms () {
      if (this.propdata.alarmlist.length > 0) {
        this.alarm = true
        this.alarmlevel = this.propdata.alarmlist[0].level
        this.alarmtype = this.propdata.alarmlist[0].type
        this.alarmcontent = this.propdata.alarmlist[0].content
      } else {
        this.alarm = false
      }
    }
  }
}
</script>

<style>

</style>
