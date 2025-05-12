import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { Modal,Card, Col, Row, Spin } from 'antd';

// Utility function to format time strings
const formatTimeString = (timeStr) => {
  const [hours, minutes, seconds] = timeStr.split(':');
  return `${hours}h ${minutes}m ${seconds}s`;
};

const DashboardWeekBarChart = ({ columns, aggregateData, aggregateColumns, totals, employeecount, datadis }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [xAxisLabel, setXAxisLabel] = useState('');
  const [uempid, setUempid] = useState([]);
  const [ACTIVE_YN, setActiveYn] = useState([]);

  // Fetching employee IDs and ACTIVE_YN from localStorage
  useEffect(() => {
    const empIds = (localStorage.getItem('empid') || '').split(',').map(emp => emp.trim());
    const activeYn = (localStorage.getItem('ACTIVE_YN') || '').split(',').map(emp => emp.trim());
    const modifiedActiveYn = activeYn.filter(status => status === 'ACTIVE'); 

    console.log(empIds);
    console.log(activeYn);
    
    setUempid(empIds);
    setActiveYn(empIds);
  }, []);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hrs}hr ${mins}min ${secs}sec`;
  };

  // If there is no data, show a loading spinner
  if (aggregateData.length === 0 || aggregateColumns.length === 0) {
    return <div><Spin size="small" /></div>;
  }

  // Extract x-axis data (dates)
  const xAxisData = aggregateData.map(item => new Date(item.date).getTime()); // Convert date strings to timestamps

  // Generate series for each column (except the first one)
  const series = aggregateColumns.slice(1).map(col => ({
    name: col.title,
    data: aggregateData.map(item => item[col.dataIndex])
  }));

  // Define colors for each series
  const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A6', '#33FFF4']; // Customize these colors as needed

  // Define chart titles and total values
  const chartTitles = [
    'LOGGED HOURS',
    'PRODUCTIVE HOURS',
    'IDLE HOURS',
    'TIME ON SYSTEM',
    'AWAY FROM SYSTEM'
  ];

  // Descriptions for each chart
  const descriptions = [
    "Average total hours recorded, including breaks and meetings, across Filtered users. .", 
    "Average hours users were actively engaged, encompassing both active hours and meeting time.",
    " Average hours users were not actively engaged.",
    "Average hours users were actively using the system.",
    "Average hours users were unavailable, including breaks and meetings.",
  ];

  // Generate chart options for each series
  const chartOptions = (title, data, color) => ({
    series: [{
      name: title,
      data: data
    }],
    chart: {
      type: 'bar',
      height: 350,
      stacked: true,
      toolbar: {
        show: false,
        offsetX: -20  // Adjust the value to move it left
      },
      zoom: { enabled: false },
      events: {
        dataPointSelection: (event, chartContext, config) => {
          const { seriesIndex, dataPointIndex } = config;

          if (data[seriesIndex] && data[seriesIndex][dataPointIndex] !== undefined) {
            const selectedData = data[seriesIndex][dataPointIndex];
            const xAxisValue = xAxisData[dataPointIndex];
            const xAxisLabel = new Date(xAxisValue).toLocaleDateString();

            setModalData({
              data: selectedData,
              xAxisLabel: xAxisLabel
            });
            setModalVisible(true);
          } else {
            console.error('Data not available for the selected point.');
          }
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '60%', // Width of the bars
        endingShape: 'rounded', // Rounded edges for a softer look
        offsetY: 30 // Increased offset value to move bars further down
      }
    },
    fill: {
      opacity: 0.8,
      colors: [color]
    },
    colors: [color],
    xaxis: {
      type: 'datetime',
      categories: xAxisData,
      labels: {
        format: 'dd/MM/yy',
        show: false
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      labels: {
        show: false
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    grid: {
      show: false,
      padding: {
        top: 10, // Top padding
        bottom: -50 // Increased negative padding to move the bars down
      }
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy'
      }
    }
  });

  return (
    <div className="card">
      <div className="ms-2 me-2 mt-2">
        <Row gutter={16}>
          {/* Card with static content */}
          <Col span={8}>
            <Card
              style={{
                height: "250px", // Increased the card height
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <h4 style={{ marginTop: "-90px", textAlign: "center" }}>
                Total Emp: {uempid.length}
              </h4>
              <h4 style={{ marginTop: "10px", textAlign: "center" }}>
                Active Emp: {ACTIVE_YN.length}
              </h4>
            </Card>
          </Col>

          {/* DashboardAllAreaChart with totals as chart titles */}
          {series.map((ser, index) => (
            <Col span={8} key={index} style={{ marginBottom: "16px" }}>
              <Card
                bordered={false}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "250px",
                  overflow: "hidden",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                  position: "relative",
                }}
              >
                {/* Tooltip icon with custom description */}
                <div
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    cursor: "pointer",
                  }}
                  title={descriptions[index]} // Use the descriptions array
                >
                  <span style={{ fontSize: "18px", color: "#1890ff" }}>ℹ️</span>
                </div>

                <p style={{ margin: "-3%" }}>{chartTitles[index]}</p>
                <p>{formatTimeString(totals[Object.keys(totals)[index]])}</p>
                <div
                  style={{
                    marginLeft: "-20%",
                    marginRight: "25%",
                    marginTop: "-10%",
                    height: "100%",
                  }}
                >
                  <div style={{ flexGrow: 1, position: "relative" }}>
                    <ReactApexChart
                      options={chartOptions(
                        ser.name,
                        ser.data,
                        colors[index % colors.length]
                      )}
                      series={chartOptions(
                        ser.name,
                        ser.data,
                        colors[index % colors.length]
                      ).series}
                      type="bar"
                      height="110%"
                      width="140%"
                    />
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Modal to display selected data */}
        
      </div>
    </div>
  );
};

export default DashboardWeekBarChart;
