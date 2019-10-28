<template>
  <div id="app">
    <ans-chart width="100%" height="400px" :options="options" />
    <ans-venn :data="venn"></ans-venn>
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
      ]
    }
  }
};
</script>
