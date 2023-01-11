<template>
<div class="boxSet" id="riseSet">
  <h2>日出日落</h2>
  <div class="sunChart">
    <!-- 日出时间 -->
    <div>
      <p><span class="iconfont icon-sunrise"></span></p>
      <p>{{ propdata.sunrise }}</p>
    </div>
    <!-- 太阳进度条 -->
    <div id="sunbar" class="bar" :style="sunbar">
      <div class="barIcon" :style="sunIcon">
        <div class="iconfont icon-090sun"></div>
      </div>
    </div>
    <!-- 日落时间 -->
    <div>
      <p><span class="iconfont icon-sunset"></span></p>
      <p>{{ propdata.sunset }}</p>
    </div>
  </div>
  <!-- 月亮组 -->
  <div class="sunChart">
    <!-- 月出时间 -->
    <div>
      <p><span class="iconfont icon-wi-moonrise"></span></p>
      <p>{{ moonriseTime }}</p>
    </div>
    <!-- 月亮进度条 -->
    <div class="bar" :style="moonbar">
      <div class="barIcon" :style="moonIcon">
        <span class="iconfont icon-moon"></span>
      </div>
    </div>
    <!-- 月落时间 -->
    <div>
      <p><span class="iconfont icon-wi-moonset"></span></p>
      <p>{{ moonsetTime }}</p>
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
      sunDiff: '', // 存放日出进度条数值
      moonDiff: '' // 存放月出进度条数值
    }
  },
  watch: {
    parentdata: {
      handler (cur, pre) {
        this.propdata = cur
        // 在watch中再次调用，保证实时更新
        this.sunDiff = this.nowTime(this.propdata.sunrise, this.propdata.sunset)
        this.moonDiff = this.nowTime(this.moonriseTime, this.moonsetTime)
      },
      deep: true,
      // 强制立即执行回调
      immediate: true
    }
  },
  created () {
    this.sunDiff = this.nowTime(this.propdata.sunrise, this.propdata.sunset)
    this.moonDiff = this.nowTime(this.moonriseTime, this.moonsetTime)
  },
  computed: {
    // 后端数据bug：月升月落时间可能为空，故增加计算属性判断
    moonriseTime () {
      return this.propdata.moonrise === '' ? '06:00' : this.propdata.moonrise
    },
    moonsetTime () {
      return this.propdata.moondown === '' ? '16:00' : this.propdata.moondown
    },
    // 日出进度条样式
    sunbar () {
      let step = this.sunDiff
      return {
        backgroundImage: `linear-gradient(90deg, #fac043 ${step}%,rgba(0,191,255,.1) 1%)`
      }
    },
    // 太阳图标（日出进度条图标）样式
    sunIcon () {
      let step = this.sunDiff
      if (step === 98 || step === 0) {
        return {
          marginLeft: `${step}%`,
          animation: 'none'
        }
      } else {
        return {
          marginLeft: `${step}%`,
          animation: 'sunRotate 2s linear infinite'
        }
      }
    },
    // 月出进度条样式
    moonbar () {
      let step = this.moonDiff
      return {
        backgroundImage: `linear-gradient(90deg, #1383c2 ${step}%,rgba(0,191,255,.1) 1%)`
      }
    },
    // 月亮图标（月出进度条图标）样式
    moonIcon () {
      let step = this.moonDiff
      if (step === 98 || step === 0) {
        return {
          marginLeft: `${step}%`,
          animation: 'none'
        }
      } else {
        return {
          marginLeft: `${step}%`,
          animation: 'rotate 2s linear infinite alternate'
        }
      }
    }
  },
  methods: {
    // 进度条数值计算，传入（升起时间，落下时间）
    nowTime (risetime, settime) {
      let now = new Date()
      let start = ''
      let end = ''
      if (risetime === '' || settime === '') {
        start = new Date('2000-1-1 '.concat('06:00'))
        end = new Date('2000-1-1 '.concat('16:00'))
      } else {
        start = new Date('2000-1-1 '.concat(risetime))
        end = new Date('2000-1-1 '.concat(settime))
      }
      // 进度条长度% = （现在的小时数-日/月出时间的小时数）*100/（日/月落时间的小时数-日/月出时间的小时数）
      let diff = (now.getHours() - start.getHours()) * 100 / (end.getHours() - start.getHours())
      // 调节进度条显示：没到开始时间显示0，过了结束时间显示满格。
      if (diff < 0) {
        return 0
      } else if (diff > 98) {
        return 98
      } else {
        return diff
      }
    }
  }
}
</script>

<style>
/* 进度条容器布局 */
.sunChart{
  display: flex;
  flex-flow: row wrap;
  align-items: baseline;
}
/* 进度条 */
.bar{
  margin: 20% auto;
  width: 60%;
  height: 10px;
  border-radius: 5px;
  box-shadow: 0 0 1px 2px rgba(1, 32, 123, 1);
}
/* 进度条图标 */
.barIcon{
  float:left;
  box-sizing: border-box;
  margin-top: -2%;
  left: -3%;
  width: 20px;
  height: 20px;
  font-size: 1.25rem;
  transform-origin: center;
  text-align: center;
  position: relative;
}
/* 太阳图标样式及动画 */
.barIcon > .icon-090sun{
  box-sizing: border-box;
  position: absolute;
  left: -50%;
  top: 50%;
  color: rgba(239,94,31,1);
}
@keyframes sunRotate {
  from{transform: rotate(0);}
  to{transform: rotate(360deg);}
}
/* 月亮图标样式及动画 */
.barIcon > .icon-moon{
  box-sizing: border-box;
  color: rgba(32,194,241,1);
}
@keyframes rotate {
  from{transform: rotate(15deg);}
  to{transform: rotate(30deg);}
}
</style>
