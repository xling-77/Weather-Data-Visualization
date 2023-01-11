<template>
<div class="boxSet" id="wind">
  <h2>实时风向图</h2>
  <div id="windChart"></div>
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
      // 用于echarts雷达图的数据
      windChart: {}, // echarts实例化对象
      windOption: {}, // echarts图表数据
      windradius: '75%', // echarts radar图表半径
      optionVal: [1, 1, 1, 1, 1, 1, 1, 1], // echarts系列数据。因采用的是雷达图模拟风向图，共8个方位，数组元素代表风级。
      optionSpeed: 0, // echarts系列数据-元素，主要用于构建optionVal数组。根据【父组件数据的风速windspeed】来确认，最小1，最大12。避免‘3-4级’此类数据，不方便在图表上显示。
      optionStr: '' // echarts提示框数据。依次为 【父组件数据的风向wind】【父组件数据的风级windsc】【父组件数据的风速windspeed】
    }
  },
  watch: {
    parentdata: {
      handler (cur, pre) {
        this.propdata = cur
        // echarts系列数据 初始化，避免前后数据交叉造成图表显示不准确。
        this.optionVal = [1, 1, 1, 1, 1, 1, 1, 1]
        // 在watch中再次调用，保证实时更新
        this.windData()
        this.drawRadar()
      },
      deep: true,
      // 强制立即执行回调
      immediate: true
    }
  },
  created () {
    this.windData()
  },
  mounted () {
    this.drawRadar()
  },
  methods: {
    // 数据预处理
    windData () {
      // 根据【父组件数据的风速windspeed】构建optionSpeed数据
      this.propdata.windspeed = Number(this.propdata.windspeed)
      if (this.propdata.windspeed < 5) {
        this.optionSpeed = 2
      } else if (this.propdata.windspeed < 11) {
        this.optionSpeed = 3
      } else if (this.propdata.windspeed < 19) {
        this.optionSpeed = 4
      } else if (this.propdata.windspeed < 28) {
        this.optionSpeed = 5
      } else if (this.propdata.windspeed < 38) {
        this.optionSpeed = 6
      } else if (this.propdata.windspeed < 49) {
        this.optionSpeed = 7
      } else if (this.propdata.windspeed < 61) {
        this.optionSpeed = 8
      } else if (this.propdata.windspeed < 74) {
        this.optionSpeed = 9
      } else if (this.propdata.windspeed < 88) {
        this.optionSpeed = 10
      } else if (this.propdata.windspeed < 102) {
        this.optionSpeed = 11
      } else {
        this.optionSpeed = 12
      }
      // 根据【父组件数据的风向wind】构建图表所需数据：optionStr'...'；根据【父组件数据的风向wind】、optionSpeed构建optionVal[...]
      switch (this.propdata.wind) {
        case '北风':
          this.optionVal.splice(0, 1, this.optionSpeed)
          // 示例如下——北风：1-2级\n风速：8km/h
          this.optionStr = `<div><p>${this.propdata.wind}：${this.propdata.windsc}</p><p>风速：${this.propdata.windspeed}km/h</p></div>`
          break
        case '西北风':
          this.optionVal.splice(1, 1, this.optionSpeed)
          this.optionStr = `<div><p>${this.propdata.wind}：${this.propdata.windsc}</p><p>风速：${this.propdata.windspeed}km/h</p></div>`
          break
        case '西风':
          this.optionVal.splice(2, 1, this.optionSpeed)
          this.optionStr = `<div><p>${this.propdata.wind}：${this.propdata.windsc}</p><p>风速：${this.propdata.windspeed}km/h</p></div>`
          break
        case '西南风':
          this.optionVal.splice(3, 1, this.optionSpeed)
          this.optionStr = `<div><p>${this.propdata.wind}：${this.propdata.windsc}</p><p>风速：${this.propdata.windspeed}km/h</p></div>`
          break
        case '南风':
          this.optionVal.splice(4, 1, this.optionSpeed)
          this.optionStr = `<div><p>${this.propdata.wind}：${this.propdata.windsc}</p><p>风速：${this.propdata.windspeed}km/h</p></div>`
          break
        case '东南风':
          this.optionVal.splice(5, 1, this.optionSpeed)
          this.optionStr = `<div><p>${this.propdata.wind}：${this.propdata.windsc}</p><p>风速：${this.propdata.windspeed}km/h</p></div>`
          break
        case '东风':
          this.optionVal.splice(6, 1, this.optionSpeed)
          this.optionStr = `<div><p>${this.propdata.wind}：${this.propdata.windsc}</p><p>风速：${this.propdata.windspeed}km/h</p></div>`
          break
        default:
          this.optionVal.splice(7, 1, this.optionSpeed)
          this.optionStr = `<div><p>${this.propdata.wind}：${this.propdata.windsc}</p><p>风速：${this.propdata.windspeed}km/h</p></div>`
          break
      }
    },
    // 画图
    drawRadar () {
      this.windChart = this.$echarts.init(document.getElementById('windChart'))
      this.windOption = {
        series: [
          {
            type: 'radar',
            lineStyle: {
              color: 'rgba(239,94,31,1)',
              shadowColor: 'rgba(0,191,255, 0.5)',
              shadowBlur: 20
            },
            symbol: 'none',
            itemStyle: {
              color: 'rgba(239,94,31,1)'
            },
            data: [
              {
                value: this.optionVal, // 即代表8个方位的数组[1, 1, 1, 1, 1, 1, 1, 1]——已通过方法windData（）进行处理。
                name: '风力等级',
                tooltip: {
                  formatter: this.optionStr
                }
              }
            ]
          }
        ],
        // 全局提示框样式
        tooltip: {
          show: true, // 显示提示框
          trigger: 'item', // 坐标轴触发
          confine: true, // 将 tooltip 框限制在图表的区域内
          backgroundColor: 'rgba(255,255,255,0.7)',
          borderColor: 'transparent',
          textStyle: {
            fontWeight: 'bold',
            color: 'black'
          },
          extraCssText: 'width:150px; white-space:pre-wrap',
          formatter: ''
        },
        radar: {
          indicator: [
            { name: '北风', max: 13 },
            { name: '西北风', max: 13 },
            { name: '西风', max: 13 },
            { name: '西南风', max: 13 },
            { name: '南风', max: 13 },
            { name: '东南风', max: 13 },
            { name: '东风', max: 13 },
            { name: '东北风', max: 13 }
          ],
          // 雷达线设置
          splitNumber: 13,
          splitLine: {
            lineStyle: {
              color: [
                'rgba(0,191,255, 0.1)',
                'rgba(0,191,255, 0.2)',
                'rgba(0,191,255, 0.4)',
                'rgba(0,191,255, 0.6)',
                'rgba(0,191,255, 0.8)',
                'rgba(0,191,255, 1)'
              ]
            }
          },
          splitArea: {
            show: false
          },
          // 轴线设置
          axisLine: {
            lineStyle: {
              color: 'rgba(0,191,255, 0.5)'
            }
          },
          // 轴线标签设置
          axisName: {
            color: 'rgba(145, 95, 35, 1)',
            fontWeight: 'bold',
            fontSize: '0.8rem',
            lineHeight: 0
          },
          radius: this.windradius
        }
      }
      this.windChart.setOption(this.windOption)
    },
    // 图表自适应
    radarResize () {
      this.windChart.setOption(this.windOption)
      this.windChart.resize()
    }
  }
}
</script>

<style>

</style>
