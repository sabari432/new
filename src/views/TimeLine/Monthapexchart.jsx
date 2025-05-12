import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import '../Css/timeline.css';

const ApexChart2 = ({ data }) => {
  const [chartsData, setChartsData] = useState([]);
  const [chartHeight, setChartHeight] = useState(350);  // Base height

  const [xAxisRange, setXAxisRange] = useState({ min: null, max: null });

  // Function to convert time (hh:mm) to total minutes from midnight
  const convertTimeToMinutes = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const commonOptions = {
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
      bar: { horizontal: true, barHeight: '50%', rangeBarGroupRows: true },
    },
    fill: { type: 'solid' },
    xaxis: {
      type: 'numeric',  // Use numeric for time in minutes
      min: xAxisRange.min,
      max: xAxisRange.max,
      labels: {
        formatter: (value) => {
          // Convert minutes back to hh:mm format
          const hours = Math.floor(value / 60);
          const minutes = value % 60;
          return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        },
      },
    },
    legend: { show: false },
    tooltip: {
      custom: function (opts) {
        const { y1, y2, seriesName } = opts;
        const fromTime = convertMinutesToTime(y1);
        const toTime = convertMinutesToTime(y2);
        const fillColor = opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex].fillColor;
        const reson1 = opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex].reson;
        const description = opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex].description;
        const status = fillColor === '#00E396' ? 'ACTIVE' : fillColor === '#FF4560' ? 'INACTIVE' :
          fillColor === '#8c8c8c' ? 'MISSING' : fillColor === '#1890ff' ? reson1 : 'UNKNOWN';
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
      const groupedData = processDataByDate(data);
      setChartsData(groupedData);
    }
  }, [data]);

  const processDataByDate = (data) => {
    const groupedByDate = {};
    let minTime = Infinity;
    let maxTime = -Infinity;
    let uniqueDates = new Set();

    data.forEach(item => {
      const DATE = item.DATE;
      uniqueDates.add(DATE);
      if (!groupedByDate[DATE]) groupedByDate[DATE] = [];

      const EMPNAME = item.EMPNAME;
      const EMPID = item.EMPID;
      const REASON = item.REASON;
      const description = item.description;
      const status = item.ACTIVE_INACTIVE;
      const color =
        status === 'ACTIVE' ? '#00E396' :
        status === 'INACTIVE' && ['Global Meeting', 'Client Meeting', 'Stand-Up Meeting'].includes(REASON) ? '#1890ff' :
        status === 'INACTIVE' ? '#FF4560' :
        status === 'MISSING' ? '#8c8c8c' :
        '#FFFFFF';

      const fromTimeInMinutes = convertTimeToMinutes(item.FROM_TIME);  // Convert to minutes
      const toTimeInMinutes = convertTimeToMinutes(item.TO_TIME);      // Convert to minutes

      minTime = Math.min(minTime, fromTimeInMinutes);
      maxTime = Math.max(maxTime, toTimeInMinutes);

      groupedByDate[DATE].push({
        x: DATE,
        y: [fromTimeInMinutes, toTimeInMinutes],  // Use minutes as the range
        fillColor: color,
        reson: REASON,
        description: description,
      });
    });

    // Update the X-axis range based on the global min and max times (in minutes)
    setXAxisRange({ min: minTime, max: maxTime });
    const uniqueDateCount = uniqueDates.size;
    let height;

    // Dynamically set height based on the number of unique dates
    if (uniqueDateCount === 1) {
      height = uniqueDateCount * 100;
    } else if (uniqueDateCount > 1 && uniqueDateCount < 6) {
      height = uniqueDateCount * 70;
    } else {
      height = uniqueDateCount * 50;
    }
    setChartHeight(height);


    // Flatten the grouped data into a single series for the chart
    const allSeries = Object.keys(groupedByDate).map(date => ({
      name: date,
      data: groupedByDate[date],
    }));

    return allSeries;
  };

  const statusLegend = [
    { color: '#00E396', label: 'Productive' },
    { color: '#FF4560', label: 'Breaks' },
    { color: '#1890ff', label: 'Meetings' },
    { color: '#8c8c8c', label: 'Missing time' },
  ];

  // Function to convert minutes back to hh:mm format
  const convertMinutesToTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <ReactApexChart
          options={commonOptions}
          series={chartsData}
          type="rangeBar"
          height={chartHeight}
        />
      </div>
      {/* Legend Section */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2%' }}>
        {statusLegend.map((item, index) => (
          <div key={index} className="legend-item">
            <span
              style={{
                backgroundColor: item.color,
                display: 'inline-block',
                width: '15px',
                height: '15px',
                marginRight: '5px',
              }}
            ></span>
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApexChart2;
