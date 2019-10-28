<template>
  <div class="venn-box">
    <p class="app-name">
      <span class="app-name-desc" v-for="(name, index) in appNames"
        ><span class="app-circle" :style="{ 'background-color': appTagColor[name] }"></span>{{ name }}</span
      >
    </p>
    <div id="venn"></div>
    <div class="venn-tip"></div>
  </div>
</template>

<script>
import * as d3 from 'd3';
import * as venn from 'venn.js';
import theme from './helpers/default-theme';

export default {
  name: 'ans-venn',
  props: {
    data: {
      default: () => []
    }
  },
  data() {
    return {
      appNames: [],
      colors: theme.color,
      appTagColor: {}
    }
  },
  watch: {
    data(val) {
      this.vennChart(val);
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.data.length > 0) {
        this.vennChart(this.data);
      }
    });
  },
  methods: {
    vennName(data) {
      this.appNames = [...data[data.length - 1].sets];
    },
    vennChart(data) {
      const self = this;
      // 重合个数
      this.vennName(data);

      const tempArr = data.map((item) => ({
        sets: item.sets,
        size: (item.size - 0).toFixed(4)
      }));
      const chart = venn
        .VennDiagram()
        .width(400)
        .height(350);
      const div = d3.select('#venn');
      div.datum(tempArr).call(chart);

      const tooltip = d3.select('.venn-tip');

      div
        .selectAll('path')
        .style('stroke-opacity', 0)
        .style('stroke', '#fff')
        .style('stroke-width', 0)
        .style('fill', (d, i) => {
          const color = this.colors[i];
          if (d.sets.length === 1) {
            const appName = d.sets[0];
            this.appTagColor[appName] = color;
          }
          return color;
        });

      div
        .selectAll('g')
        .on('mouseover', function(d, i) {
          // sort all the areas relative to the current item
          venn.sortAreas(div, d);
          // Display a tooltip with the current size
          tooltip
            .transition()
            .duration(400)
            .style('opacity', 0.9);
          tooltip.text((+d.size).toFixed(2)); // tooltip.text(d.size);
          // highlight the current path
          const selection = d3
            .select(this)
            .transition('tooltip')
            .duration(400);
          selection
            .select('path')
            .style('stroke-width', 3)
            .style('fill-opacity', d.sets.length === 1 ? 0.4 : 0.1)
            .style('stroke-opacity', 0.5);
        })
        .on('mousemove', function() {
          tooltip.style('left', d3.event.offsetX + 'px').style('top', d3.event.offsetY - 28 + 'px');
        })
        .on('mouseout', function(d, i) {
          tooltip
            .transition()
            .duration(400)
            .style('opacity', 0);
          const selection = d3
            .select(this)
            .transition('tooltip')
            .duration(400);
          selection
            .select('path')
            .style('stroke-width', 0)
            .style('fill-opacity', d.sets.length === 1 ? 0.25 : 0.0)
            .style('stroke-opacity', 0);
        });
      this.$nextTick(() => {
        this.$emit('vennChartDraw');
      });
    }
  }
}
</script>
