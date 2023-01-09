<template>
  <div id="cityChoose">
    <button  @click="list"><span class="iconfont icon-zuobiao"></span></button>
    <div id="list" v-show="active">
      <h4>请选择需要查询天气的城市</h4>
      <div id="listContent">
        <!-- 省级选择框 -->
        <select v-model="proArea" >
          <option disabled value="">--请选择--</option>
          <option v-for="province in this.cityallData" :key="province.provinceCode" :value="province.provinceCode">{{ province.provinceName }}
          </option>
        </select>
        <!-- 市级选择框 -->
        <select v-model="cityArea" v-on:change="$emit('change',$event.target.value)">
          <option disabled value="">--请选择--</option>
          <option v-for="city in this.cityData" :key="city.cityCode" :value="city.cityCode">{{ city.cityName }}</option>
        </select>
        <!-- 区县选择框 -->
        <!-- <select v-on:change="$emit('change',$event.target.value)">
          <option disabled value="">--请选择--</option>
          <option v-for="county in this.countyData" :key="county.countyCode" :value="county.countyCode">{{ county.countyName }}</option>
        </select> -->
      </div>
    </div>
  </div>
</template>

<script>
import cityjson from '../assets/json/city.json'

export default {
  data () {
    return {
      active: false, // list v-show的条件
      flag: 1, // list 切换条件
      proArea: '', // 选择的**省
      cityData: [], // 选择的**省下的所有市
      cityArea: '', // 选择的**市
      // countyData: [],
      cityallData: cityjson // 所有城市数据
    }
  },
  watch: {
    proArea: function (cur, pre) {
      // 避免this指向改变导致数据有误
      let that = this
      if (cityjson.length > 0) {
        let temp = JSON.parse(JSON.stringify(cityjson))
        temp.splice(-1, 1)
        temp.forEach((pro) => {
          if (pro.provinceCode === cur) {
            that.cityData = pro.cities
          }
        })
      }
    },
    cityArea: function (cur, pre) {
      let that = this
      if (this.cityData.length > 0) {
        let temp = JSON.parse(JSON.stringify(this.cityData))
        temp.splice(-1, 1)
        temp.forEach((city) => {
          if (city.cityCode === cur) {
            that.countyData = city.counties
          }
        })
      }
    }
  },
  methods: {
    list (e) {
      if (this.flag === 1) { // list appearance
        e.target.style.textShadow = '0 0 2px rgba(0,191,255,1)'
        e.target.style.color = '#11c1c7'
        this.active = true
        this.flag = 0
      } else {
        e.target.style.textShadow = 'none'
        e.target.style.color = 'inherit'
        this.active = false
        this.flag = 1
      }
    }
  }
}
</script>

<style>
#cityChoose{
  /* 设置定位解决z-index层级显示问题。浮动会导致z-index不可用 */
  position: absolute;
  margin: 10px 0 0 10px;
  width: 30px;
  height: 30px;
}
/* 城市列表打开开关 */
#cityChoose > button{
  box-sizing: border-box;
  background-color: transparent;
  border: none;
  color: inherit;
  animation: rotate3d 2s linear infinite;
  transition: all 0.6s ease-in;
}
@keyframes rotate3d {
  from{transform: rotate3d(0,0,0,0)}
  20%{transform: rotate3d(0,1,0,45deg);}
  40%{transform: rotate3d(0,1,0,90deg);}
  60%{transform: rotate3d(0,1,0,135deg);}
  80%{transform: rotate3d(0,1,0,225deg);}
  to{transform: rotate3d(0,1,0,360deg);}
}
.icon-zuobiao{
  font-size: 2rem;
}
#cityChoose > button:hover{
  text-shadow:0 0 2px rgba(0,191,255,1);
  color: #11c1c7;
  animation: none;
}
/* 城市选择列表样式 */
#list{
  box-sizing: border-box;
  margin: 10% 0 0 0;
  width: 200px;
  min-width: 15rem;
  height: 250px;
  padding: 10px;
  border-radius: 10px;
  background-color: #0e3265;
  font-size: 1rem;
  color: #75c1c4;
}
#listContent{
  display: flex;
  flex-flow: column wrap;
}
/* 下拉选择框样式 */
#listContent > select{
  margin: 10px 0;
  height: 1.5rem;
  border: 2px solid rgba(145, 95, 35, 1);
  border-radius: 5px;
  background-color: transparent;
  color: inherit;
  font-weight: bold;
}
</style>
