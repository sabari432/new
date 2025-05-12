import React, { useState } from 'react';
import { Select, Button, Spin } from 'antd'; // Import Spin from antd
import moment from 'moment';
import ApexChart2 from './Monthapexchart';
import '../Css/Page1.css';
import { API_BASE_URL1, API_BASE_URL2, API_BASE_URL_LOCAL_HOST } from '../../config';

const { Option } = Select;

const MonthviewTimeline = ({ options }) => {
    const [selectedId, setSelectedId] = useState('');
    const [filteredId, setFilteredId] = useState('');
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);
    const [fetchedData, setFetchedData] = useState(null);
    const [showChart, setShowChart] = useState(false);
    const [loading, setLoading] = useState(false); // New state for loading spinner

    // Check if options and EMPID are defined
    if (!options || !Array.isArray(options.EMPID) || options.EMPID.length === 0) {
        return <div>No employee IDs available.</div>;
    }

    const employeeIds = options.EMPID.map(emp => emp.value);

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const currentYear = moment().year();
    const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

    const handleChange = (value) => {
        setSelectedId(value);
    };

    const handleFilter = async () => {
        if (selectedId && selectedMonth && selectedYear) {
            setFilteredId(selectedId);
            setLoading(true); // Show spinner when filter starts

            const startDate = moment(`${selectedYear}-${selectedMonth}-01`).format('YYYY-MM-DD');
            const endDate = moment(startDate).endOf('month').format('YYYY-MM-DD');

            console.log(`Sending data: Employee ID: ${selectedId}, Start Date: ${startDate}, End Date: ${endDate}`);

            try {
                const response = await fetch(`${API_BASE_URL1}/api/xampp.php`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        EMPID: selectedId,
                        date: startDate,
                        enddate: endDate,
                        userid: userid, // Ensure userid is defined
                    }),
                });

                const data = await response.json();
                console.log('Response from server:', data);
                setFetchedData(data);
                setShowChart(true);
            } catch (error) {
                console.error('Error sending data:', error);
                setFetchedData(null); // Reset data on error
                setShowChart(false);
            } finally {
                setLoading(false); // Hide spinner when fetch completes (success or error)
            }
        } else {
            console.log('Please select an employee ID, month, and year to filter.');
        }
    };

    const handleReset = () => {
        setSelectedId('');
        setFilteredId('');
        setSelectedMonth(null);
        setSelectedYear(null);
        setFetchedData(null);
        setShowChart(false);
        setLoading(false); // Ensure spinner is hidden on reset
        console.log('Filters and chart data have been reset.');
    };

    const empid = localStorage.getItem('empid') || '';
    const uempid = empid.split(',').map(emp => emp.trim());
    const userid = localStorage.getItem('EMPID');

    return (
        <div>
            <div className="card mt-2 mb-2">
                <div className="card-header">
                    <h5>Select an Employee ID:</h5>
                </div>

                <div className="card-body">
                    <div className="row">
                        <div className="col-sm-12"></div>

                        {/* Employee ID Select */}
                        <Select
                            value={selectedId || filteredId || undefined}
                            onChange={handleChange}
                            style={{ width: "200px", fontSize: "10px", padding: "2px 6px" }}
                            dropdownStyle={{ width: "150px" }}
                            placeholder={<span className="bold-placeholder">SELECT EMPID</span>}
                        >
                            {uempid.map(emp => (
                                <Option key={emp} value={emp}>
                                    {emp}
                                </Option>
                            ))}
                        </Select>

                        {/* Month Select */}
                        <Select
                            value={selectedMonth || undefined}
                            onChange={setSelectedMonth}
                            style={{ width: "200px", fontSize: "10px", padding: "2px 6px" }}
                            dropdownStyle={{ width: "150px" }}
                            placeholder={<span className="bold-placeholder">SELECT MONTH</span>}
                        >
                            {monthNames.map((month, index) => (
                                <Option key={index + 1} value={index + 1}>
                                    {month}
                                </Option>
                            ))}
                        </Select>

                        {/* Year Select */}
                        <Select
                            value={selectedYear || undefined}
                            onChange={setSelectedYear}
                            style={{ width: "200px", fontSize: "10px", padding: "2px 6px" }}
                            dropdownStyle={{ width: "150px" }}
                            placeholder={<span className="bold-placeholder">SELECT YEAR</span>}
                        >
                            {years.map(year => (
                                <Option key={year} value={year}>
                                    {year}
                                </Option>
                            ))}
                        </Select>
                    </div>

                    <div className="col-sm-3 mt-2">
                        <Button
                            type="primary"
                            size="small"
                            onClick={handleFilter}
                            style={{ marginRight: 10 }}
                            disabled={loading} // Disable button while loading
                        >
                            Filter
                        </Button>
                        <Button
                            onClick={handleReset}
                            size="small"
                            disabled={loading} // Disable reset while loading
                        >
                            Reset
                        </Button>
                    </div>

                    {/* Spinner and Chart Rendering */}
                    <div className="chart-container" style={{ marginTop: '20px' }}>
                        {loading ? (
                            <Spin tip="Loading data..." /> // Show spinner while loading
                        ) : showChart && fetchedData ? (
                            <ApexChart2 data={fetchedData} /> // Show chart when data is ready
                        ) : showChart ? (
                            <div>No data available to display the chart.</div> // Fallback if no data
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MonthviewTimeline;