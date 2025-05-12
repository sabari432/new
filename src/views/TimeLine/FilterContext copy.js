import React, { useEffect, useState } from 'react';
import { Spin, Alert, message, Select, Row, Col, DatePicker, Button, Table } from 'antd';
import { API_BASE_URL1, API_BASE_URL2, API_BASE_URL_LOCAL_HOST } from '../../config';


const { Option } = Select;
const { RangePicker } = DatePicker;

const Designation = () => {
  const [dataSource, setDataSource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedData, setSelectedData] = useState({
    dates: [],
    EMPID: [],
    EMPNAME: [],
    ROLE: [],
    DEPARTMENT: [],
    TEAM: [],
    PROJECT: [],
    SHIFT: [],
    DESIGNATION: [],
  });
  const [tableData, setTableData] = useState([]);
  const [departmentRoleShiftData, setDepartmentRoleShiftData] = useState([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL1}/api/uniquefilters.php`)
      .then(response => response.json())
      .then(data => {
        setDataSource(data);
        setLoading(false);
      })
      .catch(error => {
        message.error('An error occurred while fetching data');
        console.error(error);
        setLoading(false);
      });
  }, []);

  const handleDateChange = (dates) => {
    setSelectedData((prev) => ({ ...prev, dates }));
  };

  const handleDropdownChange = (label, values) => {
    setSelectedData((prev) => ({
      ...prev,
      [label]: values,
    }));
  };

  const handleFilter = async () => {
    const { dates, ...dropdownValues } = selectedData;

    // Check if date range is selected
    if (!dates[0] || !dates[1]) {
      message.warning('Please select From date to To Date');
      return;
    }

    // Count selected dropdowns
    const selectedCount = Object.values(dropdownValues).filter(values => values.length > 0).length;

    if (selectedCount > 1) {
      message.warning('Please select one select box with the date');
      return;
    }

    const startDate = dates[0].format('YYYY-MM-DD');
    const endDate = dates[1].format('YYYY-MM-DD');

    const requestData = {
      startDate,
      endDate,
      ...dropdownValues,
    };

    setFetching(true);

    try {
      const response = await fetch(`${API_BASE_URL1}/api/designation.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();
      console.log('API Response:', result);

      if (result && result.data && Array.isArray(result.data)) {
        setTableData(result.data);
        const groupedData = generateDepartmentRoleShiftData(result.data);
        setDepartmentRoleShiftData(groupedData);
      } else {
        message.error('Invalid data received from server');
      }
    } catch (error) {
      message.error('An error occurred while fetching data');
      console.error(error);
    } finally {
      setFetching(false);
    }
  };

  const timeStringToSeconds = (timeString) => {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  const generateDepartmentRoleShiftData = (data) => {
    const grouped = {};

    data.forEach(item => {
      const {
        Department,
        DESIGNATION_CATEGORY,
        SHIFTTYPE,
        EmpName,
        TotalLoggedHours,
        TotalIdleHours,
        TotalProductiveHours,
        PRODUCTIVITY_STATUS
      } = item;

      const totalLoggedHoursInSeconds = timeStringToSeconds(TotalLoggedHours);
      const totalIdleHoursInSeconds = timeStringToSeconds(TotalIdleHours);
      const totalProductiveHoursInSeconds = timeStringToSeconds(TotalProductiveHours);

      if (!grouped[Department]) {
        grouped[Department] = {};
      }

      if (!grouped[Department][DESIGNATION_CATEGORY]) {
        grouped[Department][DESIGNATION_CATEGORY] = {};
      }

      if (!grouped[Department][DESIGNATION_CATEGORY][SHIFTTYPE]) {
        grouped[Department][DESIGNATION_CATEGORY][SHIFTTYPE] = {
          employeeCount: 0,
          productiveCount: 0,
          nonProductiveCount: 0,
          totalProductiveHours: 0,
          totalLoggedHours: 0,
          totalIdleHours: 0,
          employees: []
        };
      }

      grouped[Department][DESIGNATION_CATEGORY][SHIFTTYPE].employeeCount++;
      if (PRODUCTIVITY_STATUS === "PRODUCTIVE") {
        grouped[Department][DESIGNATION_CATEGORY][SHIFTTYPE].productiveCount++;
      } else if (PRODUCTIVITY_STATUS === "NON PRODUCTIVE") {
        grouped[Department][DESIGNATION_CATEGORY][SHIFTTYPE].nonProductiveCount++;
      }

      grouped[Department][DESIGNATION_CATEGORY][SHIFTTYPE].totalProductiveHours += totalProductiveHoursInSeconds;
      grouped[Department][DESIGNATION_CATEGORY][SHIFTTYPE].totalLoggedHours += totalLoggedHoursInSeconds;
      grouped[Department][DESIGNATION_CATEGORY][SHIFTTYPE].totalIdleHours += totalIdleHoursInSeconds;

      grouped[Department][DESIGNATION_CATEGORY][SHIFTTYPE].employees.push({ EmpName });
    });

    const flatData = [];

    Object.entries(grouped).forEach(([department, roles]) => {
      Object.entries(roles).forEach(([role, shifts]) => {
        Object.entries(shifts).forEach(([shift, value]) => {
          const {
            employeeCount,
            productiveCount,
            nonProductiveCount,
            totalProductiveHours,
            totalLoggedHours,
            totalIdleHours
          } = value;

          flatData.push({
            department,
            role,
            shifts: shift,
            employeeCount,
            productiveCount,
            nonProductiveCount,
            avgProductiveHours: employeeCount > 0 ? secondsToTimeString(totalProductiveHours / employeeCount) : '00:00:00',
            avgLoggedHours: employeeCount > 0 ? secondsToTimeString(totalLoggedHours / employeeCount) : '00:00:00',
            avgIdleHours: employeeCount > 0 ? secondsToTimeString(totalIdleHours / employeeCount) : '00:00:00',
            employees: value.employees
          });
        });
      });
    });

    return flatData;
  };

  const secondsToTimeString = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return '00:00:00';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return [hours, minutes, secs].map(v => String(v).padStart(2, '0')).join(':');
  };

  const handleReset = () => {
    setSelectedData({
      dates: [],
      EMPID: [],
      EMPNAME: [],
      ROLE: [],
      DEPARTMENT: [],
      TEAM: [],
      PROJECT: [],
      SHIFT: [],
      DESIGNATION: [],
    });
    setTableData([]); // Clear table data
    setDepartmentRoleShiftData([]); // Clear department role shift data
    message.success('Filters reset!'); // Show reset success message
  };

  if (loading) {
    return <Spin />;
  }

  if (!dataSource) {
    return <Alert message="No data available" type="info" />;
  }

  const dropdownOptions = Object.entries(dataSource.data).map(([key, values]) => ({
    label: key,
    options: values.map(value => ({ value })),
  }));

  return (
    <div className="card h-100">
      <div className="card-header">
        <h5>Summary View</h5>
      </div>

      <div className="card-body">
        <div className="row">
          <div className="col-sm-12">
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '16px',
            }}>
              {dropdownOptions.map(({ label, options }) => (
                <div style={{ flex: '1 1 200px', minWidth: '150px' }} key={label}>
                  <Select
                    size="small"
                    mode="multiple"
                    className="custom-select"
                    style={{ width: "200px", fontSize: "10px", padding: "2px 6px" }}
                    dropdownStyle={{ width: "150px" }}
                    placeholder={<span className="bold-placeholder">{label}</span>}
                    onChange={(values) => handleDropdownChange(label, values)}
                    allowClear
                    value={selectedData[label]} // Set the value for the Select component
                  >
                    {options.map(option => (
                      <Option key={option.value} value={option.value}>
                        {option.value}
                      </Option>
                    ))}
                  </Select>
                </div>
              ))}
            </div>
          </div>
          <div className="col-sm-3 mt-2">
            <RangePicker
              style={{ width: '100%' }}
              onChange={handleDateChange}
              placeholder={['Start Date', 'End Date']}
              value={selectedData.dates} // Set the value for the RangePicker
            />
          </div>
          <div className="col-sm-3 mt-2">
            <Button
              className="btn btn-sm btn-primary py-1 w-40"
              onClick={handleFilter}
              loading={fetching}
            >
              Filter
            </Button>

            <Button
              className="btn btn-sm btn-danger text-light py-1 ms-2 w-40"
              onClick={handleReset}
            >
              Reset
            </Button>
          </div>
        </div>
      </div>
    
      {tableData.length > 0 && (
        <>
          <h3 style={{ marginLeft: '10px' }}>Departments, Roles, and Shifts</h3>
          <Table style={{ marginTop:"-100px" ,marginLeft: '10px' }}
            dataSource={departmentRoleShiftData}
            columns={[ 
              {
                title: 'Department',
                dataIndex: 'department',
                key: 'department',
                width: 200,
                render: department => <div style={{ whiteSpace: 'pre-line' }}>{department}</div>,
              },
              {
                title: 'Role',
                dataIndex: 'role',
                key: 'role',
                width: 200,
                render: role => <div style={{ whiteSpace: 'pre-line' }}>{role}</div>,
              },
              {
                title: 'Shifts',
                dataIndex: 'shifts',
                key: 'shifts',
                width: 200,
                render: shifts => <div style={{ whiteSpace: 'pre-line' }}>{shifts}</div>,
              },
              {
                title: 'Number of Employees',
                dataIndex: 'employeeCount',
                key: 'employeeCount',
                width: 200,
                render: employeeCount => <div style={{ whiteSpace: 'pre-line' }}>{employeeCount}</div>,
              },
              {
                title: 'Productive Staff Count',
                dataIndex: 'productiveCount',
                key: 'productiveCount',
                width: 200,
                render: productiveCount => <div style={{ whiteSpace: 'pre-line' }}>{productiveCount}</div>,
              },
              {
                title: 'Non-Productive Staff Count',
                dataIndex: 'nonProductiveCount',
                key: 'nonProductiveCount',
                width: 200,
                render: nonProductiveCount => <div style={{ whiteSpace: 'pre-line' }}>{nonProductiveCount}</div>,
              },
              {
                title: 'Avg Productive Hours',
                dataIndex: 'avgProductiveHours',
                key: 'avgProductiveHours',
                width: 200,
                render: hours => <div style={{ whiteSpace: 'pre-line' }}>{hours}</div>,
              },
              {
                title: 'Avg Logged Hours',
                dataIndex: 'avgLoggedHours',
                key: 'avgLoggedHours',
                width: 200,
                render: hours => <div style={{ whiteSpace: 'pre-line' }}>{hours}</div>,
              },
              {
                title: 'Avg Idle Hours',
                dataIndex: 'avgIdleHours',
                key: 'avgIdleHours',
                width: 200,
                render: hours => <div style={{ whiteSpace: 'pre-line' }}>{hours}</div>,
              },
            ]}
            rowKey={(record, index) => index}           
            scroll={{ x: 'max-content', y: 400 }} // Enable horizontal and vertical scrolling
            pagination={false} // Disable pagination
          />
        </>
      )}
      </div>
 
  );
};

export default Designation; 
