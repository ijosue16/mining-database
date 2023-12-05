import React from "react";
import TestChart from "./charts/TestChart";

const DashboardPage=()=>{
    // OPTION FOR LINE CHART

    const optionLine = {
        title: {
          text: 'My Chart',
        },
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line',
          },
        ],
      };

    // CONFIGURATION FOR THE STACKED BAR CHARTS

    let xAxisData = [];
    let data1 = [];
    let data2 = [];
    let data3 = [];
    let data4 = [];
    for (let i = 0; i < 10; i++) {
      xAxisData.push('Class' + i);
      data1.push(+(Math.random() * 2).toFixed(2));
      data2.push(+(Math.random() * 5).toFixed(2));
      data3.push(+(Math.random() + 0.3).toFixed(2));
      data4.push(+Math.random().toFixed(2));
    }
    var emphasisStyle = {
      itemStyle: {
        shadowBlur: 10,
        shadowColor: 'rgba(0,0,0,0.3)'
      }
    };

    // OPTION FOR STACKED BAR CHARTS

     const optionStackedBar = {
        legend: {
          data: ['bar', 'bar2', 'bar3', 'bar4'],
          left: '10%'
        },
        brush: {
          toolbox: ['rect', 'polygon', 'lineX', 'lineY', 'keep', 'clear'],
          xAxisIndex: 0
        },
        toolbox: {
          feature: {
            magicType: {
              type: ['stack']
            },
            dataView: {}
          }
        },
        tooltip: {},
        xAxis: {
          data: xAxisData,
          name: 'X Axis',
          axisLine: { onZero: true },
          splitLine: { show: false },
          splitArea: { show: false }
        },
        yAxis: {},
        grid: {
          bottom: 100
        },
        series: [
          {
            name: 'bar',
            type: 'bar',
            stack: 'one',
            emphasis: emphasisStyle,
            data: data1
          },
          {
            name: 'bar2',
            type: 'bar',
            stack: 'one',
            emphasis: emphasisStyle,
            data: data2
          },
          {
            name: 'bar3',
            type: 'bar',
            stack: 'two',
            emphasis: emphasisStyle,
            data: data3
          },
          {
            name: 'bar4',
            type: 'bar',
            stack: 'two',
            emphasis: emphasisStyle,
            data: data4
          }
        ]
      };

    //   OPTION FOR THE PIE CHART GRAPH

    const optionPie = {
        title: {
          text: 'My Pie Chart',
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} kg ({d}%)',
        },
        legend: {
          orient: 'horizontal',
          left: 'left',
          top:'10%',
          data: ['Coltan', 'Cassiterite', 'Wolframite', 'Lithuim','Beryllium'],
        },
        series: [
          {
            name: 'Pie Chart',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
              { value: 335, name: 'Coltan' },
              { value: 310, name: 'Cassiterite' },
              { value: 234, name: 'Wolframite' },
              { value: 135, name: 'Lithuim' },
              { value: 105, name: 'Beryllium' },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      };
    
return(
    <>
    <p className=" font-bold text-lg mb-2">Dashboard Page</p>
    <div className=" grid grid-cols-1 md:grid-cols-8 lg:grid-cols-12 gap-3">
        <div className=" col-span-full md:col-span-4 lg:col-span-4 p-2 min-h-[180px] rounded-md shadow-lg bg-white space-y-2">
            {/* <p className=" text-base font-semibold">Weekly reports</p> */}
            <TestChart options={optionLine} />
        </div>
        <div className=" col-span-full md:col-span-4 lg:col-span-4 p-2 min-h-[180px] rounded-md shadow-lg bg-white  space-y-2">
            {/* <p className=" text-base font-semibold">Monthly reports</p> */}
            <TestChart options={optionPie} />
        </div>
        <div className=" col-span-full md:col-span-4 lg:col-span-4 p-2 min-h-[180px] rounded-md shadow-lg bg-white  space-y-2">
            <p className=" text-base font-semibold">priodic reports</p>
        </div>
        <div className=" col-span-full p-2 min-h-[180px] rounded-md shadow-lg bg-white  space-y-2">
            <p className=" text-base font-semibold">Yearly reports</p>
            <TestChart options={optionStackedBar} />
        </div>
        <div className=" col-span-full md:col-span-4 lg:col-span-4 p-2 min-h-[180px] rounded-md shadow-lg bg-white  space-y-2">
            <p className=" text-base font-semibold">Weekly reports</p>
        </div>
        <div className=" col-span-full md:col-span-4 lg:col-span-4 p-2 min-h-[180px] rounded-md shadow-lg bg-white  space-y-2"></div>
    {/* <p>yooola</p> */}
    </div>
    </>
)
}
export default DashboardPage;