import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import PropTypes from 'prop-types';

// AveragesBarChart component to display the bar chart
const AveragesBarChart = ({ averagesData }) => {
  return (
    <BarChart width={600} height={400} data={averagesData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="uniqueField" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="TotalIdleHours" fill="#8884d8" name="Avg Idle Hours" />
      <Bar dataKey="TotalProductiveHours" fill="#82ca9d" name="Avg Productive Hours" />
      <Bar dataKey="TotalLoggedHours" fill="#ffc658" name="Avg Logged Hours" />
      <Bar dataKey="TOTAL_ON_SYSTEM" fill="#ff7300" name="Avg On System" />
      <Bar dataKey="AwayFromSystem" fill="#d0ed57" name="Avg Away From System" />
    </BarChart>
  );
};

AveragesBarChart.propTypes = {
  averagesData: PropTypes.arrayOf(
    PropTypes.shape({
      uniqueField: PropTypes.string.isRequired,
      TotalIdleHours: PropTypes.string.isRequired,
      TotalProductiveHours: PropTypes.string.isRequired,
      TotalLoggedHours: PropTypes.string.isRequired,
      TOTAL_ON_SYSTEM: PropTypes.string.isRequired,
      AwayFromSystem: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default AveragesBarChart;
