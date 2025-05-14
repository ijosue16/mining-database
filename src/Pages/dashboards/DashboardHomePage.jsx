import React, {useEffect, useState} from "react";
import TestChart from "./charts/TestChart";
import {ImSpinner2} from "react-icons/im";
import {
    useGetStockSummaryQuery,
    useGetYearStockSummaryQuery,
    useShipmentSuppliersGraphQuery
} from "@/states/apislice.js";
import companyLogo from "../../assets/companyLogo.png";
import {useSelector} from "react-redux";
import {hasPermission} from "@/components/helperFunctions.js";
import CompanyInfoPage from "../CompanyInfoPage.jsx";

const DashboardPage = () => {
    const {permissions: userPermissions } = useSelector(state => state.persistedReducer?.global);
    const [pieArray, SetPieArray] = useState([]);
    const [optionPie, setOptionPie] = useState({});
    const [optionStack, setOptionStack] = useState({});
    const {data, isLoading, isSuccess, isError, error} = useGetStockSummaryQuery();
    const {
        data: yearData,
        isLoading: isGetting,
        isSuccess: isDone,
        isError: isFail,
        error: fail
    } = useGetYearStockSummaryQuery("2023");
    // const{data:shipData,isLoading:isCalculating,isSuccess:isFetched,isError:isDown,error:down}=useShipmentSuppliersGraphQuery(shipmentId);

    useEffect(() => {
        if (isDone) {
            const {currentStock} = yearData.data;
            const xAxisData = Object.keys(currentStock);
            const series = Object.entries(currentStock).map(([name, data], index) => {
                let stackValue = index < 2 ? 'one' : 'two';
                return {
                    name,
                    type: 'bar',
                    stack: stackValue,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowColor: 'rgba(0,0,0,0.3)'
                        }
                    },
                    data,
                }

            });
            setOptionStack(
                {
                    title: {
                        text: 'Mineral amount received per month',
                        top: '0%',

                    },
                    legend: {
                        data: ['coltan', 'cassiterite', 'wolframite', 'lithium', 'beryllium'],
                        left: '5%',
                        top: '5%',
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
                        optionToContent: function (opt) {
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
                    series: series,
                }
            )
        }
    }, [isDone]);

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



    //   OPTION FOR THE PIE CHART GRAPH
    useEffect(() => {
        if (isSuccess) {
            const {stock} = data.data;
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

    if (!hasPermission(userPermissions, "dashboard:view")) return <CompanyInfoPage/>

    return (
        <div className="py-5">
            <p className=" font-bold text-lg mb-2">Dashboard Page</p>
            <div className="relative w-full h-[40vh] flex items-center justify-center bg-gray-200">
                <h1 className="text-6xl font-bold text-gray-800">SOEMC LTD</h1>
            </div>
            <div className=" grid grid-cols-1 md:grid-cols-8 lg:grid-cols-12 gap-3">

                <div
                    className=" col-span-full lg:col-span-4 p-2 min-h-[180px] rounded-md shadow-lg bg-white flex justify-center items-center  space-y-2">
                    {/* <p className=" text-base font-semibold">Monthly reports</p> */}
                    {isLoading ? (<ImSpinner2 className="h-[80px] w-[80px] animate-spin text-gray-500 text-center"/>) :
                        <TestChart showLoading={true} options={optionPie}/>}
                </div>

                <div
                    className=" col-span-full lg:col-span-8 p-2 min-h-[180px] rounded-md shadow-lg bg-white flex space-y-2">
                    {/* <p className=" text-base font-semibold">Yearly reports</p> */}
                    {isLoading ? (<ImSpinner2 className="h-[80px] w-[80px] animate-spin text-gray-500 text-center"/>) :
                        <TestChart showLoading={true} options={optionStack}/>}
                </div>
            </div>
        </div>
    )
}
export default DashboardPage;