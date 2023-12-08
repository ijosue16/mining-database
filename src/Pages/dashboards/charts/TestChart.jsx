import React from 'react';
import ReactECharts from 'echarts-for-react';
// import { ECharts } from 'echarts';

const TestChart = ({ options }) => {
  return (
    <ReactECharts
      option={options}
      style={{ height: '400px', width: '100%' }}
    />
  );
};

export default TestChart;