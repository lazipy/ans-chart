<template>
  <div id="app">
    <div class="left" id="left" :style="{ width: width }"></div>
    <div class="right">
      <ans-chart watcher="left" width="100%" height="400px" :options="options" />
      <ans-venn :data="venn"></ans-venn>
    </div>

    <button @click="change">改变高度</button>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      options: {
        tooltip: {
          trigger: 'item',
          formatter: (params) => {
            return `${params.marker}${params.name}: ${params.percent}%`;
          },
        },
        legend: {
          data: ['1次', '2次', '3次', '4次', '5次'],
        },
        series: [
          {
            type: 'pie',
            data: [
              { value: 1548, name: '1次' },
              { value: 535, name: '2次' },
              { value: 510, name: '3次' },
              { value: 634, name: '4次' },
              { value: 735, name: '5次' }
            ]
          }
        ],
      },
      venn: [
        {
          sets: ['腾讯视频'],
          size: 48874.4218542,
        }, {
          sets: ['QQ'],
          size: 71478.5320853,
        }, {
          sets: ['腾讯视频', 'QQ'],
          size: 37516.0092206173,
        }
      ],
      width: '200px'
    }
  },
  methods: {
    change() {
      if (this.width === '200px') {
        this.width = '60px';
      } else {
        this.width = '200px';
      }
    }
  }
};
</script>

<style lang="scss">
#app {
  display: flex;
  align-items: center;

  .left {
    width: 200px;
    height: 1000px;
    background: gray;
  }
  .right {
    flex: 1;
  }
}
</style>

