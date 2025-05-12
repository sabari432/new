import React, { useEffect, useState } from 'react';
import { Spin, Alert, message, Select, Row, Col, DatePicker, Button, Table } from 'antd';
import { FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import { API_BASE_URL1, API_BASE_URL2, API_BASE_URL_LOCAL_HOST } from '../../config';
import { Card } from 'antd';
import * as XLSX from 'xlsx'; // Import XLSX library
import { Radius } from 'lucide-react';
const { Option } = Select;
const { RangePicker } = DatePicker;
const EMPID = localStorage.getItem('EMPID') || '';
const DashboardSummaryView = () => {
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

  const uempid = (localStorage.getItem('empid') || '').split(',').map(emp => emp.trim());
  const uempname = (localStorage.getItem('empname') || '').split(',').map(empn => empn.trim());
  const udepartment = (localStorage.getItem('department') || '').split(',').map(dep => dep.trim());
  const urole = (localStorage.getItem('role') || '').split(',').map(rol => rol.trim());
  const uteam = (localStorage.getItem('team') || '').split(',').map(tea => tea.trim());
  const uproject = (localStorage.getItem('project') || '').split(',').map(pro => pro.trim());
  const ushift = (localStorage.getItem('shift') || '').split(',').map(shi => shi.trim());
  const udesignationcategory = (localStorage.getItem('designationcategory') || '').split(',').map(desi => desi.trim());

  useEffect(() => {
    fetch(`${API_BASE_URL2}/api/uniquefilters.php`)
      .then(response => response.json())
      .then(data => {
        setDataSource(data);
        setLoading(false);
        console.log(data);
        
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
    const { dates, EMPID,        // Pass selected EMPID
      EMPNAME,      // Pass selected EMPNAME
      ROLE,         // Pass selected ROLE
      DEPARTMENT,   // Pass selected DEPARTMENT
      TEAM,         // Pass selected TEAM
      PROJECT,      // Pass selected PROJECT
      SHIFT,        // Pass selected SHIFT
      DESIGNATION,  // Pass select
   ...dropdownValues } = selectedData;
  
    // Check if date range is selected
    if (!dates[0] || !dates[1]) {
      message.warning('Please select From date to To Date');
      return;
    }
    //empname 
    
    
    //department 
    
    
    //teams

    //project

   
    //shift 
   
   
    
    // Check if at least one EMPID is selected
    
  
    const userId = localStorage.getItem('EMPID');
    dropdownValues.userid = userId ? userId : 'ALL'; // Include userid
  
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
      const response = await fetch(`${API_BASE_URL2}/api/designation.php`, {
        method:"POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
  
      // Check if the response is OK (status code 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log('API Response:', result);
  
      // Ensure the response data is valid and handle accordingly
      if (result && result.data && Array.isArray(result.data)) {
        setTableData(result.data);
        const groupedData = generateDepartmentRoleShiftData(result.data);
        setDepartmentRoleShiftData(groupedData);
      } else {
        message.error('Invalid data received from server');
      }
    } catch (error) {
      console.error('Error during fetch:', error);
      message.error(`An error occurred: ${error.message}`);
    } finally {
      setFetching(false); // Always stop the fetching spinner
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
          PRODUCTIVITY_STATUS // New field
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
              productiveCount: 0, // Count of productive staff
              nonProductiveCount: 0, // Count of non-productive staff
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
                  productiveCount, // Include productive count
                  nonProductiveCount, // Include non-productive count
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
  const secs = Math.floor(seconds % 60); // Floor to get whole seconds

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

console.log(departmentRoleShiftData);

  if (loading) {
    return <Spin />;
  }

  if (!dataSource) {
    return <Alert message="No data available" type="info" />;
  }
// Function to export the data to Excel
const handleExport = () => {
  const ws = XLSX.utils.json_to_sheet(departmentRoleShiftData); // Convert the data to a sheet
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Department Role Shift Data'); // Append the sheet to the workbook
  XLSX.writeFile(wb, 'Department_Role_Shift_Data.xlsx'); // Download the file
};

if (loading) {
  return <Spin />;
}

if (!dataSource) {
  return <Alert message="No data available" type="info" />;
}
const handleExport1 = () => {
  const ws = XLSX.utils.json_to_sheet(tableData); // Convert the data to a sheet
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Raw Data'); // Append the sheet to the workbook
  XLSX.writeFile(wb, 'Department_Role_Shift_Data.xlsx'); // Download the file
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
    <div style={{
      padding: '24px',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      color: '#333',
    }}>


      <div style={{
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: '10px',
  marginTop: "-20px",
  marginLeft: "-5px"
}}>
  {/* Check if dataSource.data.EMPID exists before rendering */}
  <div style={{ flex: '1 1 200px', minWidth: '150px' }}>
    <Select
      size="small"
      mode="multiple"
      className="custom-select"
      style={{ width: "200px", fontSize: "10px", padding: "2px 6px" }}
      dropdownStyle={{ width: "150px" }}
      placeholder={<span className="bold-placeholder">EMPID</span>}
      onChange={(values) => handleDropdownChange('EMPID', values)}
      allowClear
      value={selectedData.EMPID}
    >
      {uempid.map(empid => (
                  <Option key={empid} value={empid}>
                    {empid}
                  </Option>
                ))}
    </Select>
  </div>

  <div style={{ flex: '1 1 200px', minWidth: '150px' }}>
    <Select
      size="small"
      mode="multiple"
      className="custom-select"
      style={{ width: "200px", fontSize: "10px", padding: "2px 6px" }}
      dropdownStyle={{ width: "150px" }}
      placeholder={<span className="bold-placeholder">EMPNAME</span>}
      onChange={(values) => handleDropdownChange('EMPNAME', values)}
      allowClear
      value={selectedData.EMPNAME}
    >
      {uempname.map(empname => (
                  <Option key={empname} value={empname}>
                    {empname}
                  </Option>
                ))}
    </Select>
  </div>

  <div style={{ flex: '1 1 200px', minWidth: '150px' }}>
    <Select
      size="small"
      mode="multiple"
      className="custom-select"
      style={{ width: "200px", fontSize: "10px", padding: "2px 6px" }}
      dropdownStyle={{ width: "150px" }}
      placeholder={<span className="bold-placeholder">DESIGNATION</span>}
      onChange={(values) => handleDropdownChange('ROLE', values)}
      allowClear
      value={selectedData.ROLE}
    >
      {urole.map(role => (
                  <Option key={role} value={role}>
                    {role}
                  </Option>
                ))}
    </Select>
  </div>

  <div style={{ flex: '1 1 200px', minWidth: '150px' }}>
    <Select
      size="small"
      mode="multiple"
      className="custom-select"
      style={{ width: "200px", fontSize: "10px", padding: "2px 6px" }}
      dropdownStyle={{ width: "150px" }}
      placeholder={<span className="bold-placeholder">DEPARTMENT</span>}
      onChange={(values) => handleDropdownChange('DEPARTMENT', values)}
      allowClear
      value={selectedData.DEPARTMENT}
    >
      {udepartment.map(dep => (
                  <Option key={dep} value={dep}>
                    {dep}
                  </Option>
                ))}
    </Select>
  </div>

  <div style={{ flex: '1 1 200px', minWidth: '150px' }}>
    <Select
      size="small"
      mode="multiple"
      className="custom-select"
      style={{ width: "200px", fontSize: "10px", padding: "2px 6px" }}
      dropdownStyle={{ width: "150px" }}
      placeholder={<span className="bold-placeholder">TEAM</span>}
      onChange={(values) => handleDropdownChange('TEAM', values)}
      allowClear
      value={selectedData.TEAM}
    >
      {uteam.map(team => (
                  <Option key={team} value={team}>
                    {team}
                  </Option>
                ))}
    </Select>
  </div>

  <div style={{ flex: '1 1 200px', minWidth: '150px' }}>
    <Select
      size="small"
      mode="multiple"
      className="custom-select"
      style={{ width: "200px", fontSize: "10px", padding: "2px 6px" }}
      dropdownStyle={{ width: "150px" }}
      placeholder={<span className="bold-placeholder">PROJECT</span>}
      onChange={(values) => handleDropdownChange('PROJECT', values)}
      allowClear
      value={selectedData.PROJECT}
    >
      {uproject.map(project => (
                  <Option key={project} value={project}>
                    {project}
                  </Option>
                ))}
    </Select>
  </div>

  <div style={{ flex: '1 1 200px', minWidth: '150px' }}>
    <Select
      size="small"
      mode="multiple"
      className="custom-select"
      style={{ width: "200px", fontSize: "10px", padding: "2px 6px" }}
      dropdownStyle={{ width: "150px" }}
      placeholder={<span className="bold-placeholder">SHIFT</span>}
      onChange={(values) => handleDropdownChange('SHIFT', values)}
      allowClear
      value={selectedData.SHIFT}
    >
      {ushift.map(shift => (
                  <Option key={shift} value={shift}>
                    {shift}
                  </Option>
                ))}
    </Select>
  </div>

  <div style={{ flex: '1 1 200px', minWidth: '150px' }}>
    <Select
      size="small"
      mode="multiple"
      className="custom-select"
      style={{ width: "200px", fontSize: "10px", padding: "2px 6px" }}
      dropdownStyle={{ width: "150px" }}
      placeholder={<span className="bold-placeholder">DESIGNATION_CATEGORY</span>}
      onChange={(values) => handleDropdownChange('DESIGNATION', values)}
      allowClear
      value={selectedData.DESIGNATION}
    >
      {udesignationcategory.map(designation => (
                  <Option key={designation} value={designation}>
                    {designation}
                  </Option>
                ))}
    </Select>
  </div>
</div>

      <Row gutter={16} style={{ marginBottom: '16px' }}>
        <Col span={24}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: 600,
            fontSize: '16px',
            color: '#555',
          }}></label>
             <RangePicker
              style={{ width: '100%' }}
              onChange={handleDateChange}
              placeholder={['Start Date', 'End Date']}
              value={selectedData.dates} // Set the value for the RangePicker
            />
        </Col>
      </Row>

      <div style={{ marginTop: '16px',padding: '15px' ,display: 'flex', gap: '10px'}}>
        <Button 
          type="primary " 
          onClick={handleFilter} 
          style={{ marginRight: '8px', borderColor: '#4CAF50' }}
          loading={fetching}
        >
          Filter
        </Button>
        <Button 
          onClick={handleReset} 
          style={{ backgroundColor: '#f44336', borderColor: '#f44336', color: '#fff' }}
        >
          Reset
        </Button>
        <Button 
            onClick={handleExport} 
            style={{ backgroundColor: '#9E9E9E', borderColor: '#9E9E9E', color: '#fff' }}
          >
            Export
          </Button>
          <button   
           onClick={handleExport1}
            style={{ backgroundColor: '#9E9E9E', borderColor: '#9E9E9E', color: '#fff' }}

        >
         EXPORT RAW DATA
          
          </button>

      </div>

      {tableData.length > 0 && (
        <>
          <h3 style={{ marginTop: '24px' }}>Departments, Roles, and Shifts</h3>
          <Table 
  dataSource={departmentRoleShiftData} 
  
  
  columns={[
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      width: 130,
      render: department => <div style={{ whiteSpace: 'pre-line' }}>{department}</div>,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      width: 130,
      render: role => <div style={{ whiteSpace: 'pre-line' }}>{role}</div>,
    },
    {
      title: 'Shifts',
      dataIndex: 'shifts',
      key: 'shifts',
      width: 130,
      render: shifts => <div style={{ whiteSpace: 'pre-line' }}>{shifts}</div>,
    },
    {
      title: 'Number of Employees',
      dataIndex: 'employeeCount',
      key: 'employeeCount',
      width: 130,
      render: employeeCount => <div style={{ whiteSpace: 'pre-line' }}>{employeeCount}</div>,
    },
    {
      title: 'Productive Staff Count',
      dataIndex: 'productiveCount', // New column for productive count
      key: 'productiveCount',
      width: 130,
      render: productiveCount => <div style={{ whiteSpace: 'pre-line' }}>{productiveCount}</div>,
    },
    {
      title: 'Non-Productive Staff Count',
      dataIndex: 'nonProductiveCount', // New column for non-productive count
      key: 'nonProductiveCount',
      width: 130,
      render: nonProductiveCount => <div style={{ whiteSpace: 'pre-line' }}>{nonProductiveCount}</div>,
    },
    {
      title: 'Avg Productive Hours',
      dataIndex: 'avgProductiveHours',
      key: 'avgProductiveHours',
      width: 130,
      render: hours => <div style={{ whiteSpace: 'pre-line' }}>{hours}</div>,
    },
    {
      title: 'Avg Logged Hours',
      dataIndex: 'avgLoggedHours',
      key: 'avgLoggedHours',
      width: 130,
      render: hours => <div style={{ whiteSpace: 'pre-line' }}>{hours}</div>,
    },
    {
      title: 'Avg Idle Hours',
      dataIndex: 'avgIdleHours',
      key: 'avgIdleHours',
      width: 130,
      render: hours => <div style={{ whiteSpace: 'pre-line' }}>{hours}</div>,
    },
  ]}
  rowKey={(record, index) => index}
  style={{ marginTop: '1px' }}
  scroll={{ x: 'max-content', y: 500 }} // Enable horizontal and vertical scrolling
  pagination={false} // Disable pagination
/>
        </>
      )}
        </div>
        </div>
    </div>
  );
};

export default DashboardSummaryView;

