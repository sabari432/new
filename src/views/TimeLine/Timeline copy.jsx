import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import '../Css/timeline.css';

const ApexChart = ({ data }) => {
  const [series, setSeries] = useState([]);
  const [chartHeight, setChartHeight] = useState(250); // Default height

  const options = {
    chart: {
      height: chartHeight,
      type: 'rangeBar',
      zoom: {
        enabled: false // Disable mouse/scroll zooming
      },
      toolbar: {
        show: true, // Ensure toolbar is visible
        tools: {
          zoom: false,     // Disable general zoom tool (selection zoom)
          zoomin: true,    // Enable zoom-in button
          zoomout: true,   // Enable zoom-out button
          pan: false,      // Disable pan tool
          reset: true      // Enable reset zoom button
        }
      }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '50%',
        rangeBarGroupRows: true
      }
    },
    fill: {
      type: 'solid'
    },
    xaxis: {
      type: 'datetime',
      labels: {
        formatter: function (value) {
          return new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
      }
    },
    yaxis: {
      labels: {
        formatter: function (value) {
          const seriesObj = series.find(s => s.name === value);
          if (seriesObj) {
            return `${seriesObj.name} -${seriesObj.EMPID}`;
          }
          return value;
        }
      }
    },
    legend: {
      show: false // Hide the legend
    },
    tooltip: {
      custom: function (opts) {
        const fromTime = new Date(opts.y1).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const toTime = new Date(opts.y2).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const seriesName = opts.seriesName || '';
        const fillColor = opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex].fillColor;
        const REASON = opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex].REASON;
        const status = fillColor === '#00E396' ? 'ACTIVE' : 'INACTIVE';
  
        return (
          `<div class="apexcharts-tooltip-rangebar" style="border-left: 4px solid ${fillColor}; padding-left: 8px;">
            <div> <span class="series-name" style="color: ${fillColor}">${seriesName}</span></div>
            <div> <span class="status"><strong>${status}</strong> </span> <span class="category">from ${fromTime} to ${toTime}</span></div>
            <div><strong>REASON:</strong> ${REASON}</div>
          </div>`
        );
      }
    }
  };
  
  
  

  useEffect(() => {
    if (data) {
      const processedSeries = processData(data);
      setSeries(processedSeries);
      if(processedSeries.length === 1){
           // Update chart height based on the number of distinct EMPNAME
          const height = processedSeries.length * 100; // 100px per EMPNAME
          setChartHeight(height);
          console.log(processedSeries.length+"   "+height);
      }
      else if(processedSeries.length > 1 && processedSeries.length < 6)
      {
        const height = processedSeries.length * 70; // 100px per EMPNAME
          setChartHeight(height);
          console.log(processedSeries.length+"   "+height);
      }
      else{
        const height = processedSeries.length * 50; // 100px per EMPNAME
          setChartHeight(height);
          console.log(processedSeries.length+"   "+height);
      }
      
      
    } else {
      // Calculate the height initially based on the initial data
      const initialHeight = calculateInitialHeight(data);
      setChartHeight(initialHeight);
    }
  }, [data]);
  

  const calculateInitialHeight = (data) => {
    if (!Array.isArray(data)) {
      return 0; // Default height if data is not valid
    }
    const uniqueEMPNAMEs = new Set(data.map(item => item.EMPNAME));
    return uniqueEMPNAMEs.size * 70; // 100px per unique EMPNAME
  };

  const processData = (data) => {
    if (!Array.isArray(data)) {
      console.error('Invalid data format:', data);
      return [];
    }

    const series = {};

    data.forEach(item => {
      const EMPNAME = item.EMPNAME;
      const EMPID = item.EMPID;
      const REASON = item.REASON;

      const status = item.ACTIVE_INACTIVE;
      const color = status === 'ACTIVE' ? '#00E396' : '#FF4560';

      if (!series[EMPNAME]) {
        series[EMPNAME] = {
          name: EMPNAME,
          data: [],
          EMPID:EMPID,
          REASON:REASON
        };
      }

      series[EMPNAME].data.push({
        x: EMPNAME,
        y: [
          new Date(item.FROM_TIME).getTime(),
          new Date(item.TO_TIME).getTime()
        ],
        fillColor: color
      });
    });

    return Object.values(series);
  };

  return (
    <div>
      <div id="chart">
        <ReactApexChart 
          options={options} 
          series={series} 
          type="rangeBar" 
          height={chartHeight} 
        />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default ApexChart; 
