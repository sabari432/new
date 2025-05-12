import React from 'react';
import PropTypes from 'prop-types';
import ReactApexChart from 'react-apexcharts';

// Helper function to convert time string (HH:MM:SS) to seconds
const parseTimeToSeconds = (timeString) => {
  const [hours, minutes, seconds] = timeString.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

// Helper function to convert seconds back to time string (HH:MM:SS)
const formatSecondsToTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

// Function to calculate averages by group (e.g., Team or Department)
const calculateAveragesByGroup = (dataSource, filterSummary) => {
  const groupData = {};

  dataSource.forEach(item => {
    const groupKey = item[filterSummary]; // Dynamically use filterSummary

    if (!groupKey) {
      console.warn(`Undefined group key for item:`, item);
      return; // Skip if groupKey is undefined
    }

    const { TotalLoggedHours, TotalIdleHours, TotalProductiveHours, TOTAL_ON_SYSTEM, AwayFromSystem } = item;

    if (!groupData[groupKey]) {
      groupData[groupKey] = {
        totalLoggedSeconds: 0,
        totalIdleSeconds: 0,
        totalProductiveSeconds: 0,
        totalOnSystemSeconds: 0,
        totalAwaySeconds: 0,
        count: 0,
      };
    }

    // Accumulate the times in seconds
    groupData[groupKey].totalLoggedSeconds += parseTimeToSeconds(TotalLoggedHours);
    groupData[groupKey].totalIdleSeconds += parseTimeToSeconds(TotalIdleHours);
    groupData[groupKey].totalProductiveSeconds += parseTimeToSeconds(TotalProductiveHours);
    groupData[groupKey].totalOnSystemSeconds += parseTimeToSeconds(TOTAL_ON_SYSTEM);
    groupData[groupKey].totalAwaySeconds += parseTimeToSeconds(AwayFromSystem);
    groupData[groupKey].count += 1;
  });

  const averages = {
    AverageTotalLoggedHours: {},
    AverageTotalIdleHours: {},
    AverageTotalProductiveHours: {},
    AverageTotalOnSystem: {},
    AverageAwayFromSystem: {},
  };

  Object.keys(groupData).forEach((key) => {
    const {
      totalLoggedSeconds,
      totalIdleSeconds,
      totalProductiveSeconds,
      totalOnSystemSeconds,
      totalAwaySeconds,
      count,
    } = groupData[key];

    // Convert total seconds to hours (seconds / 3600) and round to the nearest whole number
    averages.AverageTotalLoggedHours[key] = Math.round((totalLoggedSeconds / count) / 3600); // Rounded to nearest hour
    averages.AverageTotalIdleHours[key] = Math.round((totalIdleSeconds / count) / 3600); // Rounded to nearest hour
    averages.AverageTotalProductiveHours[key] = Math.round((totalProductiveSeconds / count) / 3600); // Rounded to nearest hour
    averages.AverageTotalOnSystem[key] = Math.round((totalOnSystemSeconds / count) / 3600); // Rounded to nearest hour
    averages.AverageAwayFromSystem[key] = Math.round((totalAwaySeconds / count) / 3600); // Rounded to nearest hour
  });

  return averages;
};

const DashboardGroupBarChart = ({ filteredData, filterSummary }) => {
  // Ensure filteredData.data is an array
  const dataSource = Array.isArray(filteredData?.data) ? filteredData.data : [];
  const entryCount = dataSource.length;
  console.log(filteredData);

  // Calculate averages
  const averages = calculateAveragesByGroup(dataSource, filterSummary);

  // Prepare data for the chart (group names and values for each category)
  const groups = Object.keys(averages.AverageTotalLoggedHours);
  const series = groups.map((group, index) => ({
    name: group,
    data: [
      averages.AverageTotalLoggedHours[group], // Rounded to hours
      averages.AverageTotalIdleHours[group], // Rounded to hours
      averages.AverageTotalProductiveHours[group], // Rounded to hours
      averages.AverageTotalOnSystem[group], // Rounded to hours
      averages.AverageAwayFromSystem[group], // Rounded to hours
    ],
    key: `${group}-${index}`,  // Ensure unique key by appending index
  }));

  const options = {
    chart: {
      type: 'bar',
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: [
        'LoggedHours',
        'IdleHours',
        'ProductiveHours',
        'OnSystem',
        'breaks',
      ],
    },
    yaxis: {
      title: {
        text: 'Time (Hours)', // Changed to Hours
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          // Show value in hours
          return `${val} hrs`;
        },
      },
    },
  };

  return (
    <div>
      <div id="chart">
        <ReactApexChart options={options} series={series} type="bar" height={350} />
      </div>
    </div>
  );
};

DashboardGroupBarChart.propTypes = {
  filteredData: PropTypes.shape({
    data: PropTypes.array.isRequired, // filteredData must be an object with 'data' key being an array
  }).isRequired,
  filterSummary: PropTypes.oneOf(['Team', 'Department','Project']).isRequired,
   // Ensure it's either 'Team' or 'Department'
};


export default DashboardGroupBarChart;
