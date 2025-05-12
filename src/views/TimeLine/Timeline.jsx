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
            return (`${seriesObj.name} -${seriesObj.EMPID}`);
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
        const reson1 = opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex].reson;
        const description = opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex].description;
        const status = fillColor === '#00E396' ? 'ACTIVE' : fillColor === '#FF4560' ? 'INACTIVE' :
                       fillColor === '#8c8c8c' ? 'MISSING' : fillColor === '#1890ff' ? reson1 :
                       'UNKNOWN';
        const reson = status === 'ACTIVE' ? 'ACTIVE' : reson1;

        return (
          `<div class="apexcharts-tooltip-rangebar" style="border-left: 4px solid ${fillColor}; padding-left: 8px;">
            <div><span class="series-name" style="color: ${fillColor}">${seriesName}</span></div>
            <div><span class="status"><strong>${status}</strong></span> <span class="category">from ${fromTime} to ${toTime}</span></div>
            <div><strong>REASON:</strong> ${reson}</div>
            ${['INACTIVE', 'Client Meeting', 'Global Meeting', 'Stand-Up Meeting'].includes(status) ? `<div><strong>description:</strong> ${description}</div>` : ''}
          </div>`
        );
      }
    }
  };

  useEffect(() => {
    if (data) {
      const processedSeries = processData(data);
      setSeries(processedSeries);
      adjustChartHeight(processedSeries);
    } else {
      const initialHeight = calculateInitialHeight(data);
      setChartHeight(initialHeight);
    }
  }, [data]);

  const adjustChartHeight = (processedSeries) => {
    let height;
    if (processedSeries.length === 1) {
      height = processedSeries.length * 100;
    } else if (processedSeries.length > 1 && processedSeries.length < 6) {
      height = processedSeries.length * 70;
    } else {
      height = processedSeries.length * 50;
    }
    setChartHeight(height);
  };

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
      const description = item.description;
      const status = item.ACTIVE_INACTIVE;
      const color =
          status === 'ACTIVE' ? '#00E396' :
          status === 'INACTIVE' && (REASON === 'Global Meeting' || REASON === 'Client Meeting' || REASON === 'Stand-Up Meeting') ? '#1890ff' :
          status === 'INACTIVE' ? '#FF4560' :
          status === 'MISSING' ? '#8c8c8c' :
          '#FFFFFF'; // Fallback color if status is not recognized
      if (!series[EMPNAME]) {
        series[EMPNAME] = {
          name: EMPNAME,
          data: [],
          EMPID: EMPID,
          reson: REASON,
          description: description,
        };
      }
      series[EMPNAME].data.push({
        x: EMPNAME,
        y: [
          new Date(item.FROM_TIME_UTC).getTime(),
          new Date(item.TO_TIME_UTC).getTime()
        ],
        fillColor: color,
        reson: REASON,
        description: description,
      });
    });

    return Object.values(series);
  };

  // Define status color legend
  const statusLegend = [
    { color: '#00E396', label: 'Productive' },
    { color: '#FF4560', label: 'Breaks' },
    { color: '#1890ff', label: 'Meetings' },
    { color: '#8c8c8c', label: 'Missing time' },
    // Add more statuses if needed
  ];

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
      {/* Legend Section */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' ,gap:'2%'}} >
        {statusLegend.map((item, index) => (
          <div key={index} className="legend-item">
            <span style={{ backgroundColor: item.color, display: 'inline-block', width: '15px', height: '15px', marginRight: '5px' }}></span>
            {item.label}
          </div>
        ))}
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default ApexChart;
