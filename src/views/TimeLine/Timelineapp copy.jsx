import React, { useEffect, useState } from 'react';
import { Spin } from 'antd'; // Import Spin from Ant Design
import ApexChart1 from './Timelineappchart';
import { API_BASE_URL1, API_BASE_URL2, API_BASE_URL_LOCAL_HOST } from '../../config';

const Timelineapp = ({ selectedDate, selectedEmployees }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchData = async () => {
      console.log("Selected Date:", selectedDate);
      console.log("Selected Employees:", selectedEmployees);
      setLoading(true); // Set loading to true before fetching
      try {
        const response = await fetch(`${API_BASE_URL1}/api/timelineapp.php`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            date: selectedDate,
            EMPID: selectedEmployees, // Assuming EMPID expects comma-separated values
          }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchData();
  }, [selectedDate, selectedEmployees]);

  if (loading) {
    return <Spin tip="Loading..." />; // Show spinner while loading
  }

  if (error) {
    return <div>Error: {error}</div>; // Display error if there is one
  }

  return (
    <div>
      <ApexChart1 data={data} />
    </div>
  );
};

export default Timelineapp; 
