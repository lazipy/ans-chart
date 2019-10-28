import AnsChart from './index.vue';
import AnsVenn from './venn.vue';

const install = (Vue) => {
  Vue.component(AnsChart.name, AnsChart);
  Vue.component(AnsVenn.name, AnsVenn);
};

export default {
  install,
  AnsChart,
  AnsVenn
};
