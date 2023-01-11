<template>
  <div class="boxSet" id="daysTemp">
    <h2>近期气温变化</h2>
    <div id="daysTempChart"></div>
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
      daysWea: this.parentdata.list, // 接收父组件数据，即7日内天气情况
      // 用于echarts图表的数据
      daysChart: {}, // echarts实例化对象
      daysOption: {}, // echarts图表数据
      dates: [], // 7个日期-x轴1
      weekDays: [], // 7个星期-x轴2
      wea: [] // 7个天气-x轴3
    }
  },
  watch: {
    parentdata: {
      handler (cur, pre) {
        this.daysWea = cur.list
        // 在watch中再次调用，保证实时更新
        this.dataSet()
        this.drawDaysTemp()
      },
      deep: true,
      // 强制立即执行回调
      immediate: true
    }
  },
  created () {
    this.dataSet()
  },
  mounted () {
    this.drawDaysTemp()
  },
  computed: {
    // 去除请求数据中温度的单位,将其转换为数字形式
    removeUnit () {
      // 去除监听对象
      let templist = Array.from(this.daysWea)
      // 去除请求数据中温度的单位
      templist.forEach((params) => {
        // 因vue对数据有深层监听，所以还要再去除一次监听对象
        let lowestTemp = params.lowest
        let highestTemp = params.highest
        // 如果数据带单位，就去除单位，返回数字
        if (typeof lowestTemp === 'string') {
          let backlowest = Array.from(lowestTemp)
          backlowest.pop()
          params.lowest = Number(backlowest.join(''))
        }
        if (typeof highestTemp === 'string') {
          let backhighest = Array.from(highestTemp)
          backhighest.pop()
          params.highest = Number(backhighest.join(''))
        }
      })
      return templist
    }
  },
  methods: {
    dataSet () {
      let tempDate = []
      let temWeek = []
      let tempWea = []
      // 拷贝，便于foreach遍历取数据.
      let temDays = Array.from(this.daysWea)
      if (temDays !== undefined) {
        temDays.forEach(function (element) {
          tempDate.push(Object.values(element)[0]) // 从请求数据中获取日期
          temWeek.push(Object.values(element)[1]) // 从请求数据中获取week
          tempWea.push(Object.values(element)[2]) // 从请求数据中获取天气
        })
      }
      this.dayWeathers = temDays
      temDays = null
      this.dates = tempDate // 更新初始日期数据，此时数组内为7个日期
      tempDate = null
      this.weekDays = temWeek // 更新初始week数据，此时数组内为7个week
      temWeek = null
      this.wea = tempWea // 更新初始天气简述数据，此时数组内为7个天气
      tempWea = null
    },
    drawDaysTemp () {
      // 开始渲染echarts图表
      this.daysChart = this.$echarts.init(document.getElementById('daysTempChart'))
      // echarts的图表样式
      this.daysOption = {
        color: ['#d30e06', '#d0dbdb', '#114479'],
        // 数据源
        dataset: {
          dimensions: ['date', 'week', 'weather', 'weatherimg', 'weathercode', 'real', 'lowest', 'highest', 'wind', 'windspeed', 'windsc', 'sunrise', 'sunset', 'moonrise', 'moondown', 'pcpn', 'uv_index', 'vis', 'humidity', 'tips'],
          source: this.removeUnit
        },
        // 多条x轴，指定数据源
        xAxis: [
          // x:date
          {
            id: 'date',
            type: 'category',
            data: this.dates, // 需要指定数据源，否则多条x轴对不齐
            axisLine: {
              show: false, // 不显示坐标轴线
              onZero: false // offset必备条件
            },
            offset: 30,
            axisTick: {
              show: false // 不显示坐标轴刻度
            },
            axisLabel: {
              show: true,
              color: 'rgba(145, 95, 35, 1)',
              fontSize: '0.8rem',
              formatter: function (params) {
                return params.slice(5)
              }
            }
          },
          // x:week
          {
            id: 'week',
            type: 'category',
            data: this.weekDays,
            axisLine: {
              show: false, // 不显示坐标轴线
              onZero: false // offset必备条件
            },
            offset: 10,
            position: 'bottom',
            axisTick: {
              show: false // 不显示坐标轴刻度
            },
            axisLabel: {
              show: true,
              color: 'rgba(145, 95, 35, 1)',
              fontSize: '0.8rem',
              fontWeight: 'bold'
            }
          },
          // x:weather
          {
            id: 'wea',
            type: 'category',
            data: this.wea,
            axisLine: {
              show: false, // 不显示坐标轴线
              onZero: false // offset必备条件
            },
            offset: 20,
            axisTick: {
              show: false // 不显示坐标轴刻度
            },
            axisLabel: {
              show: true,
              color: 'rgba(238,247,242,.8)',
              fontSize: '0.8rem',
              fontWeight: 'bold'
            }
          }
        ],
        series: [
        // 高温线
          {
            name: '最高温度',
            type: 'line',
            yAxisIndex: 0,
            smooth: true,
            lineStyle: {
              width: 3
            },
            label: {
              show: true,
              color: 'inherit',
              fontSize: '0.8rem',
              fontWeight: 600,
              formatter: '{@highest}℃'
            },
            symbolSize: 6,
            encode: {
              x: 'date',
              y: 'highest'
            }
          },
          // 低温线
          {
            name: '最低温度',
            type: 'line',
            yAxisIndex: 0,
            smooth: true,
            lineStyle: {
              width: 3
            },
            label: {
              show: true,
              position: 'bottom',
              color: 'inherit',
              fontSize: '0.8rem',
              fontWeight: 600,
              formatter: '{@lowest}℃'
            },
            symbolSize: 6,
            encode: {
              x: 'date',
              y: 'lowest'
            }
          },
          // 降雨柱状图
          {
            name: '相对湿度',
            type: 'bar',
            yAxisIndex: 1,
            showBackground: true, // 显示柱条的背景色
            backgroundStyle: {
              color: 'rgba(0,191,255,.1)'
            },
            encode: {
              x: 'date',
              y: 'humidity'
            }
          }
        ],
        // 提示框样式
        tooltip: {
          show: true, // 显示提示框
          trigger: 'axis', // 坐标轴触发
          confine: true, // 将 tooltip 框限制在图表的区域内
          axisPointer: {
            type: 'none'
          },
          backgroundColor: 'rgba(255,255,255,0.7)',
          borderColor: 'transparent',
          textStyle: {
            fontWeight: 'bold',
            color: 'black'
          },
          extraCssText: 'width:120px; white-space:pre-wrap',
          formatter: function (params) {
            let diffDate = new Date() - new Date(params[0].name) // 计算实时与data日期的毫秒数差值
            let totalDays = Math.floor(diffDate / (1000 * 60 * 60 * 24)) // 转换毫秒数差值为整数——天数。1为昨天，0为今天，-1为明天，以此类推。
            if (totalDays === 0) {
              return `<div style="text-align:justify;">今日<br>天气：${params[0].value.weather}<br>相对湿度：${params[0].value.humidity}%<br>最高气温${params[0].value.highest}℃<br>最低气温${params[0].value.lowest}℃</div>` // 必须有个html元素才会显示提示框。且可以添加style样式。
            } else if (totalDays === -1) {
              return `<div style="text-align:justify;">明日<br>天气：${params[0].value.weather}<br>相对湿度：${params[0].value.humidity}%<br>最高气温${params[0].value.highest}℃<br>最低气温${params[0].value.lowest}℃</div>`
            } else {
              return `<div style="text-align:justify;"><h3 style="margin-top:0;">${params[0].value.date.slice(5)}</h3>天气：${params[0].value.weather}<br>相对湿度：${params[0].value.humidity}%<br>最高气温${params[0].value.highest}℃<br>最低气温${params[0].value.lowest}℃</div>`
            }
          }
        },
        legend: {
          show: false // 显示图例项
        },
        grid: {
          top: '25%'
        },
        yAxis: [
          {
            type: 'value',
            name: '温度/°C',
            nameTextStyle: {
              align: 'right',
              color: 'rgba(238,247,242,.7)'
            },
            position: 'left',
            // 坐标轴刻度标签设置
            axisLabel: {
              color: function (val) {
                if (val > 40 | val < -25) {
                  return 'red' // 红色气温预警
                } else if (val > 37 | val < -20) {
                  return 'orange' // 橙色气温预警
                } else if (val > 35 | val < -15) {
                  return 'yellow' // 黄色气温预警
                } else if (val < -10) {
                  return 'blue'// 蓝色气温预警
                } else {
                  return 'rgba(238,247,242,.7)'
                }
              },
              formatter: '{value} °C'
            },
            max: function (value) {
              return value.max
            },
            min: function (value) {
              return value.min - 2
            },
            // 分割线（即数据对应的y轴数据线）相关设置
            splitLine: {
              show: true,
              lineStyle: {
                color: 'rgba(238,247,242,.2)'
              }
            }
          },
          {
            type: 'value',
            name: '相对湿度/%',
            nameTextStyle: {
              align: 'left',
              color: 'rgba(238,247,242,.7)'
            },
            position: 'right',
            axisLabel: {
              color: 'rgba(238,247,242,.7)',
              formatter: '{value} %'
            },
            max: function (value) {
              return value.max + 2
            },
            min: 0,
            // 分割线（即数据对应的y轴数据线）相关设置
            splitLine: {
              show: false
            }
          }
        ]
      }
      // 指定图表的配置项和数据
      this.daysChart.setOption(this.daysOption)
    },
    // 图表自适应
    daysResize () {
      this.daysChart.setOption(this.daysOption)
      this.daysChart.resize()
    }
  }
}
</script>

<style>

</style>
