/** * 图表通用组件 */
<template>
  <div class="ans-chart" :class="classes" :id="produceId" :style="{ width: width, height: height }"></div>
</template>

<script>
import echarts from 'echarts';
import _ from 'lodash';
import uuid from 'uuid/v4';
import defaultOptions from './helpers/default-options';
import defaultTheme from './helpers/default-theme';
import colors from './helpers/color-list';
import { on, off, MutationObserver } from './helpers/assist';

export default {
  name: 'ans-chart',
  props: {
    id: {
      type: String
    },
    width: {
      type: String,
      required: true
    },
    height: {
      type: String,
      required: true
    },
    align: {
      type: String,
      defalut: 'center',
      validator: (value) => ['left', 'center', 'right'].includes(value)
    },
    watcher: {
      type: String,
    },
    initOptions: {
      type: Object,
      default: () => defaultOptions
    },
    options: {
      required: true
    },
    theme: {
      type: Object,
      default: () => defaultTheme
    },
    themeName: {
      type: String,
      default: 'defaultTheme'
    },
    colors: {
      type: Object,
      default: () => colors
    },
    legendVisible: {
      type: Boolean,
      default: true
    },
    tooltipVisible: {
      type: Boolean,
      default: true
    },
    resizeable: {
      type: Boolean,
      default: true
    },
    resizeDelay: {
      type: Number,
      default: 200
    },
    debug: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      chart: null,
      source: null,
      observer: null,
      config: { attributes: true, childList: false, subtree: false },
      callback: (mutationsList) => {
        console.log(mutationsList);
        for(var mutation of mutationsList) {
          if (mutation.type == 'attributes') {
            if (this.chart) {
              this.chart.resize();
            }
          }
        }
      },
      resizeHandler: null
    }
  },
  computed: {
    produceId() {
      return this.id || uuid();
    },
    classes() {
      return [`ans-chart__${this.align}`];
    }
  },
  watch: {
    options(val) {
      this.updateChart(val);
    }
  },
  created() {
    this.registerAllTheme();
  },
  mounted() {
    // 合并配置项
    this.initSource();
    // 控制台打印内部生成的echarts options
    if (this.debug) {
      console.log(this.source);
    }
    // 初始化图表
    this.initChart();
    // 初始化监听对象
    if (this.watcher) {
      this.observer = new MutationObserver(this.callback);
      this.observer.observe(document.getElementById(this.watcher), this.config);
    }
    // 浏览器 resize
    if (this.resizeable) {
      this.addResizeableHandler();
    }
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    // 卸载图表
    this.chart.dispose();
    this.chart = null;

    // 移除监听
    if (this.observer) {
      this.observer.disconnect();
      this.observer.takeRecords();
    }

    // 卸载事件
    if (this.resizeable) {
      this.removeResizeableHandler();
    }
  },
  methods: {
    // 注册所有主题
    registerAllTheme() {
      echarts.registerTheme(this.themeName, this.theme);
      Object.keys(this.colors).forEach((key) => {
        const theme = {
          ...this.theme,
          color: this.colors[key],
        };
        echarts.registerTheme(key, theme);
      });
    },

    initSource() {
      const options = _.cloneDeep(this.options);
      const initOptions = _.cloneDeep(this.initOptions);

      const source = _.merge(options, {
        legend: { show: this.legendVisible },
        tooltip: { show: this.tooltipVisible },
      });

      this.source = _.merge(initOptions, source);
    },

    // 初始化图表
    initChart() {
      this.chart = echarts.init(document.getElementById(this.produceId), this.themeName);
      this.chart.setOption(this.source);
    },

    // 更新图表
    updateChart(val) {
      if (this.chart) {
        this.chart.clear();
        const initOptions = _.cloneDeep(this.initOptions);
        this.source = _.merge(initOptions, val);
        this.chart.setOption(this.source);
      } else {
        this.initChart();
      }
    },

    // 换肤
    changeColor(color) {
      if (!Object.keys(this.colors).includes(color)) {
        console.error(`该颜色未在可选颜色值表中，请修改！`);
        return;
      }
      // 切换主题
      this.chart = echarts.init(document.getElementById(this.produceId), color);
    },

    // 窗口改变事件监听
    addResizeableHandler() {
      this.resizeHandler = _.debounce(() => {
        if (this.chart) {
          this.chart.resize();
        }
      }, this.resizeDelay);
      on(window, 'resize', this.resizeHandler);
    },

    // 移除窗口改变事件监听
    removeResizeableHandler() {
      off(window, 'resize', this.resizeHandler);
    }
  }
}
</script>
