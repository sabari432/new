import React, { useEffect, useState } from 'react';
import { Card, Select, message, Button, DatePicker, Spin, Tabs } from 'antd';
import { FilterOutlined, ReloadOutlined, ExportOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useFilterContext } from './FilterContext';
import ApexChart from './Timeline';
import Timelineapp from './Timelineapp.jsx';
import MonthviewTimeline from './MonthviewTimeline.jsx';
import '../Css/Page1.css';
import { API_BASE_URL1, API_BASE_URL2, API_BASE_URL_LOCAL_HOST } from '../../config';

const { Option } = Select;
const { TabPane } = Tabs;

const Page3 = () => {
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState({});
  const [employeeid, setEmployeeid] = useState([]);
  const [tempSelectedEmployees, setTempSelectedEmployees] = useState([]);
  const [showTimelineApp, setShowTimelineApp] = useState(false);
  const [shouldFetchData, setShouldFetchData] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [exportEnabled, setExportEnabled] = useState(false);
  const [selectedTab, setSelectedTab] = useState('1'); // Track the selected tab
  const [data, setData] = useState([]); // Store the fetched data

  const {
    selectedValues,
    setSelectedValues,
    selectedDate,
    setSelectedDate,
    selectedEmployees,
    setSelectedEmployees,
    resetFilters
  } = useFilterContext();

  // Fetch initial unique filter options on mount
  useEffect(() => {
    fetch(`${API_BASE_URL1}/api/uniquefilters.php`)
      .then(response => response.json())
      .then(data => {
        if (data.data) {
          const allOptions = Object.entries(data.data).reduce((acc, [key, values]) => {
            acc[key] = values.map(value => ({ value, label: value }));
            return acc;
          }, {});
          setOptions(allOptions);
        } else {
          message.error('Failed to fetch data');
        }
        setLoading(false);
      })
      .catch(error => {
        message.error('An error occurred while fetching data');
        setLoading(false);
      });
  }, []);

  // Fetch filtered data when shouldFetchData changes
  useEffect(() => {
    if (shouldFetchData) {
      setDataLoading(true);
      const filterParams = Object.entries(selectedValues)
        .map(([key, values]) => `${encodeURIComponent(key)}=${encodeURIComponent(values.join(','))}`)
        .concat(selectedDate ? [`date=${encodeURIComponent(selectedDate)}`] : [])
        .concat([`userid=${encodeURIComponent(userid)}`]) // Add userid
        .join('&'); const encodedParams = new URLSearchParams(filterParams).toString();

        
      fetch(`${API_BASE_URL2}/api/timeline.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: filterParams
      })
        .then(response => response.json())
        .then(data => {
          setData(data);
          const employeeid = Array.from(new Set(data.map(item => item.EMPID)));
          setEmployeeid(employeeid);
          message.success('Data fetched successfully');
          setExportEnabled(true); // Enable the export button
        })
        .catch(error => {
          // Check if the error has a response and data
              if (error.response && error.response.data && error.response.data.error) {
                // Display the specific error message from the backend
                message.error(error.response.data.error);
            } else {
                // Fallback message for general errors
                message.error('No Data Found');
            }
        })

        
        .finally(() => {
          setShouldFetchData(false);
          setDataLoading(false);
        });
    }
  }, [shouldFetchData, selectedValues, selectedDate]);

  // Handle change for filter values
  const handleChange = (value, key) => {
    setSelectedValues(prev => ({ ...prev, [key]: value }));
  };

  const handleDateChange = (date) => {
    setSelectedDate(date ? date.format('YYYY-MM-DD') : null);
  };

  const handleReset = () => {
    resetFilters();
    setShowTimelineApp(false);
    setData([]); // Clear data on reset
    setExportEnabled(false);
    setSelectedDate(null); // Clear DatePicker value
    setTempSelectedEmployees([]); // Clear temporary employee selections
    setSelectedEmployees([]); // Clear selected employees
    setSelectedValues({}); // Reset all selected values
  };

  const handleApplyFilters = () => {
    setShouldFetchData(true);
  };

  const handleSubmit = () => {
    if (tempSelectedEmployees.length > 0) {
      setSelectedEmployees(tempSelectedEmployees);
      setShowTimelineApp(true);
    } else {
      message.error('Please select at least one employee');
    }
  };

  const handleEmployeeChange = (value) => {
    setTempSelectedEmployees(value);
  };


  const handleResetEmployees = () => {
    setTempSelectedEmployees([]); // Clear temporary employee selections
    setSelectedEmployees([]); // Clear selected employees
    setEmployeeid([]); // Clear employee IDs if necessary
    setShowTimelineApp(false);
    setData([]); // Clear data on reset
  };
  

  
  // Rest of your component code...
  

  const fetchExportData = () => {
    const filterParams = Object.entries(selectedValues)
      .map(([key, values]) => `${encodeURIComponent(key)}=${encodeURIComponent(values.join(','))}`)
      .concat(selectedDate ? [`date=${encodeURIComponent(selectedDate)}`] : [])
      .concat([`userid=${encodeURIComponent(userid)}`]) // Add userid
      .join('&');

    fetch(`${API_BASE_URL1}/api/usertimeagg.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: filterParams
    })
      .then(response => response.json())
      .then(data => {
        if (data && data.length > 0) {
          // Generate CSV
          const csvData = data.map(row => Object.values(row));
          const csvContent = [
            Object.keys(data[0]).join(','), // Header row
            ...csvData.map(e => e.join(',')) // Data rows
          ].join('\n');

          // Create and download the CSV file
          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
          const link = document.createElement('a');
          const url = URL.createObjectURL(blob);
          link.setAttribute('href', url);
          link.setAttribute('download', 'exported_data.csv');
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          message.error('No data found for export');
        }
      })
      .catch(error => {
        message.error('An error occurred while fetching export data');
      });
  };

  const getFilteredOptions = (columnName) => {
    const selected = selectedValues;
    return options[columnName]?.filter(option => {
      return !Object.keys(selected).some(key => 
        key !== columnName && selected[key].includes(option.value)
      );
    }) || [];
  };
  const userid = localStorage.getItem('EMPID') || '';

  const filtersToExclude = ['SHIFT', 'DESIGNATION_CATEGORY'];
  const empid = localStorage.getItem('empid') || '';
const uempid = empid.split(',').map(emp => emp.trim());
  const empname = localStorage.getItem('empname') || '';
  const uempname = empname.split(',').map(empn => empn.trim()); // Convert to an array
  const department = localStorage.getItem('department') || '';
  const udepartment = department.split(',').map(dep => dep.trim()); // Convert to an array
  const role = localStorage.getItem('role') || '';
  const urole = role.split(',').map(rol => rol.trim()); // Convert to an array
  const team = localStorage.getItem('team') || '';
  const uteam = team.split(',').map(tea => tea.trim()); // Convert to an array
  const project = localStorage.getItem('project') || '';
  const uproject = project.split(',').map(pro => pro.trim()); // Convert to an array
  const shift = localStorage.getItem('shift') || '';
  const ushift = shift.split(',').map(shi => shi.trim()); // Convert to an array
  const designationcategory = localStorage.getItem('designationcategory') || '';
  const udesignationcategory = designationcategory.split(',').map(desi => desi.trim()); // Convert to an array

  return (
    <div className="container ">
      <Tabs defaultActiveKey="1" activeKey={selectedTab} onChange={setSelectedTab}>
        <TabPane tab="Activity Timeline" key="1">
          <div className="card">
            <div className="card-header">
              <h5>Activity Timeline:</h5>
            </div>
            <div className="card-body">
              <div className="row">
              <div className="col-sm-12">
  <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
    <DatePicker
      size="small"
      onChange={handleDateChange}
      placeholder={selectedDate ? moment(selectedDate).format('YYYY-MM-DD') : 'Select date'}
      style={{ marginRight: '10px' }} // Add margin here
    />
 <div style={{ flex: '1 1 auto', margin: '0 10px' }}>
                      <Select
                        className="custom-select"
                        dropdownStyle={{ width: "150px" }}
                        mode="multiple"
                        size="small"
                        style={{ width: '100%' }}
                        placeholder={<span className="bold-placeholder">EMPID</span>}
                        value={selectedValues['EMPID'] || []}
                        onChange={(value) => handleChange(value, 'EMPID')}
                      >
                        {uempid.map(emp => (
                          <Option key={emp} value={emp}>
                            {emp}
                          </Option>
                        ))}
                      </Select>
                    </div>

                    <div style={{ flex: '1 1 auto', margin: '0 10px' }}>
                      <Select
                        className="custom-select"
                        dropdownStyle={{ width: "150px" }}
                        mode="multiple"
                        size="small"
                        style={{ width: '100%' }}
                        placeholder={<span className="bold-placeholder">EMPNAME</span>}
                        value={selectedValues['EMPNAME'] || []}
                        onChange={(value) => handleChange(value, 'EMPNAME')}
                      >
                        {uempname.map(empn => (
                          <Option key={empn} value={empn}>
                            {empn}
                          </Option>
                        ))}
                      </Select>
                    </div>

                    <div style={{ flex: '1 1 auto', margin: '0 10px' }}>
                      <Select
                        className="custom-select"
                        dropdownStyle={{ width: "150px" }}
                        mode="multiple"
                        size="small"
                        style={{ width: '100%' }}
                        placeholder={<span className="bold-placeholder">DESIGNATION</span>}
                        value={selectedValues['ROLE'] || []}
                        onChange={(value) => handleChange(value, 'ROLE')}
                      >
                        {urole.map(rol => (
                          <Option key={rol} value={rol}>
                            {rol}
                          </Option>
                        ))}
                      </Select>
                    </div>

                    {/*<div style={{ flex: '1 1 auto', margin: '0 10px' }}>
                      <Select
                        className="custom-select"
                        dropdownStyle={{ width: "150px" }}
                        mode="multiple"
                        size="small"
                        style={{ width: '100%' }}
                        placeholder={<span className="bold-placeholder">DEPARTMENT</span>}
                        value={selectedValues['DEPARTMENT'] || []}
                        onChange={(value) => handleChange(value, 'DEPARTMENT')}
                      >
                        {udepartment.map(dep => (
                          <Option key={dep} value={dep}>
                            {dep}
                          </Option>
                        ))}
                      </Select>
                    </div> */}

                    <div style={{ flex: '1 1 auto', margin: '0 10px' }}>
                      <Select
                        className="custom-select"
                        dropdownStyle={{ width: "150px" }}
                        mode="multiple"
                        size="small"
                        style={{ width: '100%' }}
                        placeholder={<span className="bold-placeholder">TEAMS</span>}
                        value={selectedValues['TEAMS'] || []}
                        onChange={(value) => handleChange(value, 'TEAMS')}
                      >
                        {uteam.map(tea => (
                          <Option key={tea} value={tea}>
                            {tea}
                          </Option>
                        ))}
                      </Select>
                    </div>

                    <div style={{ flex: '1 1 auto', margin: '0 10px' }}>
                      <Select
                        className="custom-select"
                        dropdownStyle={{ width: "150px" }}
                        mode="multiple"
                        size="small"
                        style={{ width: '100%' }}
                        placeholder={<span className="bold-placeholder">PROJECTS</span>}
                        value={selectedValues['PROJECTS'] || []}
                        onChange={(value) => handleChange(value, 'PROJECTS')}
                      >
                        {uproject.map(pro => (
                          <Option key={pro} value={pro}>
                            {pro}
                          </Option>
                        ))}
                      </Select>
                    </div>
                  </div>
                </div>


                <div className="col-sm-3 mt-2">
                  <button className="btn btn-sm btn-primary py-1 w-40" onClick={handleApplyFilters}>
                    Filter
                  </button>
                  <button className="btn btn-sm btn-danger text-light py-1 ms-2 w-40" onClick={handleReset}>
                    Reset
                  </button>
                  <button className="btn btn-sm btn-secondary text-light py-1 ms-2 w-40" onClick={fetchExportData} disabled={!exportEnabled}>
                    Export
                  </button>
                </div>
              </div>
            </div>
            <Spin spinning={dataLoading}>
              {data.length > 0 && <ApexChart data={data} />}
            </Spin>
          </div>

          {data.length > 0 && (
            <div className="card mt-2">
              <div className="card-header">
                <h5>Application Usage Timeline:</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-sm-12">
                    <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                      <Select
                        size="small"
                        className="custom-select"
                        style={{ width: "200px", fontSize: "10px", padding: "2px 6px" }}
                        dropdownStyle={{ width: "150px" }}
                        placeholder={<span className="bold-placeholder">SELECT EMPLOYEES</span>}
                        value={tempSelectedEmployees}
                        onChange={handleEmployeeChange}
                      >
                        {employeeid.map(name => (
                          <Option key={name} value={name}>
                            {name}
                          </Option>
                        ))}
                      </Select>
                    </div>
                  </div>
                  <div className="col-sm-3 ms-2">
                    <button className="btn btn-sm btn-primary py-1 w-40" onClick={handleSubmit}>
                      Submit
                    </button>
                    <button className="btn btn-sm btn-danger text-light py-1 ms-2 w-40" onClick={handleResetEmployees}>
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <Spin spinning={dataLoading}>
            {showTimelineApp && (
              <Timelineapp selectedDate={selectedDate} selectedEmployees={selectedEmployees || []} />
            )}
          </Spin>
        </TabPane>

        <TabPane tab="Month View Timeline" key="2">
          <MonthviewTimeline options={options} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Page3;
