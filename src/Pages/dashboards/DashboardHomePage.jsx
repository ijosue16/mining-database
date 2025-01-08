import React, { useEffect, useState } from "react";
import TestChart from "./charts/TestChart";
import {ImSpinner2} from "react-icons/im";
import { useGetStockSummaryQuery, useGetYearStockSummaryQuery, useShipmentSuppliersGraphQuery } from "../../states/apislice";
import companyLogo from "../../assets/companyLogo.png";
const DashboardPage = () => {
  // const shipmentId="658046954a131843477411b0"
  const[pieArray,SetPieArray]=useState([]);
  const [optionPie, setOptionPie] = useState({});
  const [optionStack, setOptionStack] = useState({});
  const{data,isLoading,isSuccess,isError,error}=useGetStockSummaryQuery();
  const{data:yearData,isLoading:isGetting,isSuccess:isDone,isError:isFail,error:fail}=useGetYearStockSummaryQuery("2023");
  // const{data:shipData,isLoading:isCalculating,isSuccess:isFetched,isError:isDown,error:down}=useShipmentSuppliersGraphQuery(shipmentId);

useEffect(()=>{
  if(isDone){
    const{currentStock}=yearData.data;
    const xAxisData = Object.keys(currentStock);
    const series = Object.entries(currentStock).map(([name, data],index) => {
      let stackValue = index < 2 ? 'one' : 'two';
      return{
        name,
        type: 'bar',
        stack: stackValue,
        emphasis:{ 
          itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0,0,0,0.3)'
        }},
        data,
      }
      
    });
    setOptionStack(
      {
        title: {
          text: 'Mineral amount received per month',
          top:'0%',
          
        },
        legend: {
          data: ['coltan', 'cassiterite', 'wolframite', 'lithium', 'beryllium'],
          left: '5%',
          top:'5%',
        },
        color: [
          '#D9420B',
          '#F26D3D',
          '#730202',
          '#400505',
          '#D9D9D9',
          '#D0C0A7',
          '#DECCA6',
          '#DBD3C6',
          '#6e7074',
          '#546570',
          '#c4ccd3'
        ],
        brush: {
          // toolbox: ['rect', 'polygon', 'lineX', 'lineY', 'keep', 'clear'],
          toolbox: ['clear'],
          xAxisIndex: 0
        },
        toolbox: {
          show: true,
          feature: {
            dataZoom: {
              yAxisIndex: "none"
            },
            dataView: {
              readOnly: false
            },
            magicType: {
              type: ['stack']
            },
            // restore: {},
            saveAsImage: {}
          },
          optionToContent: function(opt) {
          var axisData = opt.xAxis[0].data;
          var series = opt.series;
          var table = '<table style="width:100%;height:85%;text-align:center;"><tbody><tr  style="font-weight:20">'
                      + '<td>Month:</td>'
                      + '<td>' + series[0].name + '</td>'
                      + '<td>' + series[1].name + '</td>'
                      + '<td>' + series[2].name + '</td>'
                      + '<td>' + series[3].name + '</td>'
                      + '<td>' + series[4].name + '</td>'
                      + '</tr>';
          for (var i = 0, l = axisData.length; i < l; i++) {
              table += '<tr style="border-bottom:1px solid #ddd;padding:8px;">'
                      + '<td>' + axisData[i] + '</td>'
                      + '<td>' + series[0].data[i] + '</td>'
                      + '<td>' + series[1].data[i] + '</td>'
                      + '<td>' + series[2].data[i] + '</td>'
                      + '<td>' + series[3].data[i] + '</td>'
                      + '<td>' + series[4].data[i] + '</td>'
                      + '</tr>';
          }
          table += '</tbody></table>';
          return table;
      }
        },
        tooltip: {},
        xAxis: [
          {
            type: 'category',
            // prettier-ignore
            data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        grid: {
          bottom: 60
        },
        series:series,
      }
    )
  }
},[isDone]);

// useEffect(()=>{
//   if(isFetched){
//   }
// },[])

    // OPTION FOR LINE CHART

    const optionLine = {
        title: {
          text: 'My Chart',
        },
        tooltip: {
          trigger: 'item',
          // formatter: '{a} <br/>{b} : {c} kg ({d}%)',
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

    // let xAxisData = [];
    // let data1 = [];
    // let data2 = [];
    // let data3 = [];
    // let data4 = [];
    // for (let i = 0; i < 10; i++) {
    //   xAxisData.push('Class' + i);
    //   data1.push(+(Math.random() * 2).toFixed(2));
    //   data2.push(+(Math.random() * 5).toFixed(2));
    //   data3.push(+(Math.random() + 0.3).toFixed(2));
    //   data4.push(+Math.random().toFixed(2));
    // }
    // var emphasisStyle = {
    //   itemStyle: {
    //     shadowBlur: 10,
    //     shadowColor: 'rgba(0,0,0,0.3)'
    //   }
    // };

    // OPTION FOR STACKED BAR CHARTS

    //  const optionStackedBar = {
    //     legend: {
    //       data: ['bar', 'bar2', 'bar3', 'bar4'],
    //       left: '10%'
    //     },
    //     brush: {
    //       toolbox: ['rect', 'polygon', 'lineX', 'lineY', 'keep', 'clear'],
    //       xAxisIndex: 0
    //     },
    //     toolbox: {
    //       feature: {
    //         magicType: {
    //           type: ['stack']
    //         },
    //         dataView: {}
    //       }
    //     },
    //     tooltip: {},
    //     xAxis: {
    //       data: xAxisData,
    //       name: 'X Axis',
    //       axisLine: { onZero: true },
    //       splitLine: { show: false },
    //       splitArea: { show: false }
    //     },
    //     yAxis: {},
    //     grid: {
    //       bottom: 100
    //     },
    //     series: [
    //       {
    //         name: 'bar',
    //         type: 'bar',
    //         stack: 'one',
    //         emphasis: emphasisStyle,
    //         data: data1
    //       },
    //       {
    //         name: 'bar2',
    //         type: 'bar',
    //         stack: 'one',
    //         emphasis: emphasisStyle,
    //         data: data2
    //       },
    //       {
    //         name: 'bar3',
    //         type: 'bar',
    //         stack: 'two',
    //         emphasis: emphasisStyle,
    //         data: data3
    //       },
    //       {
    //         name: 'bar4',
    //         type: 'bar',
    //         stack: 'two',
    //         emphasis: emphasisStyle,
    //         data: data4
    //       }
    //     ]
    //   };

    //   OPTION FOR THE PIE CHART GRAPH
    useEffect(() => {
      if (isSuccess) {
        const { stock } = data.data;
        SetPieArray(stock);
  
        // Update the optionPie state based on the fetched data
        setOptionPie({
          title: {
            text: 'Stock minerals status',
          },
          color: [
            '#F2D022',
            '#F28705',
            '#BFBAA3',
            '#BF1304',
            '#0D0D0D',
            '#D0C0A7',
            '#DECCA6',
            '#BF6836',
            '#6e7074',
            '#546570',
            '#c4ccd3'
          ],
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} kgs ({d}%)',
          },
          legend: {
            orient: 'horizontal',
            left: 'left',
            top: '10%',
            // data: [ 'coltan', 'cassiterite' ,'wolframite', 'lithium', 'beryllium'],
          },
          series: [
            {
              name: 'Pie Chart',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: pieArray,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)',
                },
              },
            },
          ],
        });
      }
    }, [data, isSuccess, pieArray]);

    // function onChartReady(echarts) {
    //   timer = setTimeout(function() {
    //     echarts.hideLoading();
    //   }, 8000);
    // };  
    const loadingOption = {
      text: '加载中...',
      color: '#4413c2',
      textColor: '#270240',
      maskColor: 'rgba(194, 88, 86, 0.3)',
      zlevel: 0
    };
    
return(
    <div className="py-5">
    <p className=" font-bold text-lg mb-2">Dashboard Page</p>
    <img className="mb-3 w-full border rounded-[4px]" src={"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAlgAAAGQCAYAAAByNR6YAAAAAXNSR0IArs4c6QAAIABJREFUeF7t3etXE1nWB2AhXLyhCKK2Cl7adtaa+f//i/nyfpheM7aKKIhyUfGOJPCuHbtipkhSFdiZRn381k1lp+qpvVZ+65xTp8b++X///HTKPwIECBAgQIAAgTSBMQErzVIhAgQIECBAgEBbQMDSCAQIECBAgACBZAEBKxlUOQIECBAgQICAgKUHCBAgQIAAAQLJAgJWMqhyBAgQIECAAAEBSw8QIECAAAECBJIFBKxkUOUIECBAgAABAgKWHiBAgAABAgQIJAsIWMmgyhEgQIAAAQIEBCw9QIAAAQIECBBIFhCwkkGVI0CAAAECBAgIWHqAAAECBAgQIJAsIGAlgypHgAABAgQIEBCw9AABAgQIECBAIFlAwEoGVY4AAQIECBAgIGDpAQIECBAgQIBAsoCAlQyqHAECBAgQIEBAwNIDBAgQIECAAIFkAQErGVQ5AgQIECBAgICApQcIECBAgAABAskCAlYyqHIECBAgQIAAAQFLDxAgQIAAAQIEkgUErGRQ5QgQIECAAAECApYeIECAAAECBAgkCwhYyaDKESBAgAABAgQELD1AgAABAgQIEEgWELCSQZUjQIAAAQIECAhYeoAAAQIECBAgkCwgYCWDKkeAAAECBAgQELD0AAECBAgQIEAgWUDASgZVjgABAgQIECAgYOkBAgQIECBAgECygICVDKocAQIECBAgQEDA0gMECBAgQIAAgWQBASsZVDkCBAgQIECAgIClBwgQIECAAAECyQICVjKocgQIECBAgAABAUsPECBAgAABAgSSBQSsZFDlCBAgQIAAAQIClh4gQIAAAQIECCQLCFjJoMoRIECAAAECBAQsPUCAAAECBAgQSBYQsJJBlSNAgAABAgQICFh6gAABAgQIECCQLCBgJYMqR4AAAQIECBAQsPQAAQIECBAgQCBZQMBKBlWOAAECBAgQICBg6QECBAgQIECAQLKAgJUMqhwBAgQIECBAQMDSAwQIECBAgACBZAEBKxlUOQIECBAgQICAgKUHCBAgQIAAAQLJAgJWMqhyBAgQIECAAAEBSw8QIECAAAECBJIFBKxkUOUIECBAgAABAgKWHiBAgAABAgQIJAsIWMmgyhEgQIAAAQIEBCw9QIAAAQIECBBIFhCwkkGVI0CAAAECBAgIWHqAAAECBAgQIJAsIGAlgypHgAABAgQIEBCw9AABAgQIECBAIFlAwEoGVY4AAQIECBAgIGDpAQIECBAgQIBAsoCAlQyqHAECBAgQIEBAwNIDBAgQIECAAIFkAQErGVQ5AgQIECBAgICApQcIECBAgAABAskCAlYyqHIECBAgQIAAAQFLDxAgQIAAAQIEkgUErGRQ5QgQIECAAAECApYeIECAAAECBAgkCwhYyaDKESBAgAABAgQELD1AgAABAgQIEEgWELCSQZUjQIAAAQIECAhYeoAAAQIECBAgkCwgYCWDKkeAAAECBAgQELD0AAECBAgQIEAgWUDASgZVjgABAgQIECAgYOkBAgQIECBAgECygICVDKocAQIECBAgQEDA0gMECBAgQIAAgWQBASsZVDkCBAgQIECAgIClBwgQIECAAAECyQICVjKocgQIECBAgAABAUsPECBAgAABAgSSBQSsZFDlCBAgQIAAAQIClh4gQIAAAQIECCQLCFjJoMoRIECAAAECBAQsPUCAAAECBAgQSBYQsJJBlSNAgAABAgQICFh6gAABAgQIECCQLCBgJYMqR4AAAQIECBAQsPQAAQIECBAgQCBZQMBKBlWOAAECBAgQICBg6QECBAgQIECAQLKAgJUMqhwBAgQIECBAQMDSAwQIECBAgACBZAEBKxlUOQIECBAgQICAgKUHCBAgQIAAAQLJAgJWMqhyBAgQIECAAAEBSw8QIECAAAECBJIFBKxkUOUIECBAgAABAgKWHiBAgAABAgQIJAsIWMmgyhEgQIAAAQIEBCw9QIAAAQIECBBIFhCwkkGVI0CAAAECBAgIWHqAAAECBAgQIJAsIGAlgypHgAABAgQIEBCw9AABAgQIECBAIFlAwEoGVY4AAQIECBAgIGDpAQIECBAgQIBAsoCAlQyqHAECBAgQIEBAwNIDBAgQIECAAIFkAQErGVQ5AgQIECBAgICApQcIECBAgAABAskCAlYyqHIECBAgQIAAAQFLDxAgQIAAAQIEkgUErGRQ5QgQIECAAAECApYeIECAAAECBAgkCwhYyaDKESBAgAABAgQELD1AgAABAgQIEEgWELCSQZUjQIAAAQIECAhYeoAAAQIECBAgkCwgYCWDKkeAAAECBAgQELD0AAECBAgQIEAgWUDASgZVjgAB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WMmgyhEgQIAAAQIEBCw9QIAAAQIECBBIFhCwkkGVI0CAAAECBAgIWHqAAAECBAgQIJAsIGAlgypHgAABAgQIEBCw9AABAgQIECBAIFlAwEoGVY4AAQIECBAgIGDpAQIECBAgQIBAsoCAlQyqHAECBAgQIEBAwNIDBAgQIECAAIFkAQErGVQ5AgQIECBAgICApQcIECBAgAABAskCAlYyqHIECBAgQIAAAQFLDxAgQIAAAQIEkgUErGRQ5QgQIECAAAECApYeIECAAAECBAgkCwhYyaDKESBAgAABAgQELD1AgAABAgQIEEgWELCSQZUjQIAAAQIECAhYeoAAAQIECBAgkCwgYCWDKkeAAAECBAgQELD0AAECBAgQIEAgWUDASgZVjgABAgQIECAgYOkBAgQIECBAgECygICVDKocAQIECBAgQEDA0gMECBAgQIAAgWQBASsZVDkCBAgQIECAgIClBwgQIECAAAECyQICVjKocgQIECBAgAABAUsPECBAgAABAgSSBQSsZFDlCBAgQIAAAQIClh4gQIAAAQIECCQLCFjJoMoRIECAAAECBAQsPUCAAAECBAgQSBYQsJJBlSNAgAABAgQICFh6gAABAgQIECCQLCBgJYMqR4AAAQIECBAQsPQAAQIECBAgQCBZQMBKBlWOAAECBAgQICBg6QECBAgQIECAQLKAgJUMqhwBAgQIECBAQMDSAwQIECBAgACBZAEBKxlUOQIECBAgQICAgKUHCBAgQIAAAQLJAgJWMqhyBAgQIECAAAEBSw8QIECAAAECBJIFBKxkUOUIECBAgAABAgKWHiBAgAABAgQIJAsIWMmgyhEgQIAAAQIEBCw9QIAAAQIECBBIFhCwkkGVI0CAAAECBAgIWHqAAAECBAgQIJAsIGAlgypHgAABAgQIEBCw9AABAgQIECBAIFlAwEoGVY4AAQIECBAgIGDpAQIECBAgQIBAsoCAlQyqHAECBAgQIEBAwNIDBAgQIECAAIFkAQErGVQ5AgQIECBAgICApQcIECBAgAABAskCAlYyqHIECBAgQIAAAQFLDxAgQIAAAQIEkgUErGRQ5QgQIECAAAECApYeIECAAAECBAgkCwhYyaDKESBAgAABAgQELD1AgAABAgQIEEgWELCSQZUjQIAAAQIECAhYeoAAAQIECBAgkCwgYCWDKkeAAAECBAgQELD0AAECBAgQIEAgWUDASgZVjgABAgQIECAgYOkBAgQIECBAgECygICVDKocAQIECBAgQEDA0gMECBAgQIAAgWQBASsZVDkCBAgQIECAgIClBwgQIECAAAECyQICVjKocgQIECBAgAABAUsPECBAgAABAgSSBQSsZFDlCBAgQIAAAQIClh4gQIAAAQIECCQLCFjfScRTAAAC0klEQVTJoMoRIECAAAECBAQsPUCAAAECBAgQSBYQsJJBlSNAgAABAgQICFh6gAABAgQIECCQLCBgJYMqR4AAAQIECBAQsPQAAQIECBAgQCBZQMBKBlWOAAECBAgQICBg6QECBAgQIECAQLKAgJUMqhwBAgQIECBAQMDSAwQIECBAgACBZAEBKxlUOQIECBAgQICAgKUHCBAgQIAAAQLJAgJWMqhyBAgQIECAAAEBSw8QIECAAAECBJIFBKxkUOUIECBAgAABAgKWHiBAgAABAgQIJAsIWMmgyhEgQIAAAQIEBCw9QIAAAQIECBBIFhCwkkGVI0CAAAECBAgIWHqAAAECBAgQIJAsIGAlgypHgAABAgQIEBCw9AABAgQIECBAIFlAwEoGVY4AAQIECBAgIGDpAQIECBAgQIBAsoCAlQyqHAECBAgQIEBAwNIDBAgQIECAAIFkAQErGVQ5AgQIECBAgICApQcIECBAgAABAskCAlYyqHIECBAgQIAAAQFLDxAgQIAAAQIEkgUErGRQ5QgQIECAAAECApYeIECAAAECBAgkCwhYyaDKESBAgAABAgQELD1AgAABAgQIEEgWELCSQZUjQIAAAQIECAhYeoAAAQIECBAgkCwgYCWDKkeAAAECBAgQELD0AAECBAgQIEAgWUDASgZVjgABAgQIECAgYOkBAgQIECBAgECygICVDKocAQIECBAgQEDA0gMECBAgQIAAgWQBASsZVDkCBAgQIECAgIClBwgQIECAAAECyQICVjKocgQIECBAgAABAUsPECBAgAABAgSSBQSsZFDlCBAgQIAAAQIClh4gQIAAAQIECCQLCFjJoMoRIECAAAECBAQsPUCAAAECBAgQSBYQsJJBlSNAgAABAgQICFh6gAABAgQIECCQLCBgJYMqR4AAAQIECBAQsPQAAQIECBAgQCBZQMBKBlWOAAECBAgQIPD/Ri5VrjSon+kAAAAASUVORK5CYII="} alt="Company Logo"/>
    <div className=" grid grid-cols-1 md:grid-cols-8 lg:grid-cols-12 gap-3">

        <div className=" col-span-full lg:col-span-4 p-2 min-h-[180px] rounded-md shadow-lg bg-white flex justify-center items-center  space-y-2">
            {/* <p className=" text-base font-semibold">Monthly reports</p> */}
           {isLoading?( <ImSpinner2 className="h-[80px] w-[80px] animate-spin text-gray-500 text-center"/>): <TestChart  showLoading={true} options={optionPie} />}
        </div>

        <div className=" col-span-full lg:col-span-8 p-2 min-h-[180px] rounded-md shadow-lg bg-white flex space-y-2">
            {/* <p className=" text-base font-semibold">Yearly reports</p> */}
            {isLoading?( <ImSpinner2 className="h-[80px] w-[80px] animate-spin text-gray-500 text-center"/>): <TestChart  showLoading={true} options={optionStack} />}
        </div>
    {/* <p>yooola</p> */}
    </div>
    </div>
)
}
export default DashboardPage;