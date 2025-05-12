import React, { useState, useEffect } from 'react';
import { message, Select, Button, Card, DatePicker,ConfigProvider } from 'antd';
import moment from 'moment';
import { API_BASE_URL1, API_BASE_URL2, API_BASE_URL_LOCAL_HOST } from '../../config';
import ShiftsAdd from './ShiftsAdd';

const { Option } = Select;
const { RangePicker } = DatePicker;

const ShiftsIndex = () => {
  const [data, setData] = useState([]); // Initialize state for data
  const [loading, setLoading] = useState(false); // Initialize state for loading
  const [showModal, setShowModal] = useState(false); // State to control EmployeeDBAdd modal visibility
  const [formData, setFormData] = useState({}); // State for form data  
  const [errors, setErrors] = useState({}); // State for form errors
  const [dateRange, setDateRange] = useState([]);
  // States for filter dropdowns
  const [filters, setFilters] = useState({
    empId: [],
    empName: [],
    role: [],
    dept: [],
    project: [],
    team: [],
    shift: [],
    dateRange: [], // State for date range
  });

  // Unique data for filters
  const [uniqueData, setUniqueData] = useState({
    empIds: [],
    empNames: [],
    roles: [],
    depts: [],
    projects: [],
    teams: [],
    shifts: [],
  });


  // Handle form submission to send filters to the backend
  const handleSubmit = async () => {
    // Convert arrays to comma-separated strings or default to 'ALL' if empty
    const formattedFilters = Object.keys(filters).reduce((acc, key) => {
      if (key !== 'dateRange') {
        acc[key] = filters[key].length ? filters[key].join(',') : 'ALL';
      }
      return acc;
    }, {});

    // Handle date range separately
    const [startDate, endDate] = filters.dateRange;
    if (startDate && endDate) {
      formattedFilters.startDate = startDate.format('YYYY-MM-DD');
      formattedFilters.endDate = endDate.format('YYYY-MM-DD');
    } else {
      const today = moment().format('YYYY-MM-DD');
      formattedFilters.startDate = today;
      formattedFilters.endDate = today;
    }

    try {
      const response = await fetch(`${API_BASE_URL1}/api/Shifts.php`, {
        method: 'POST', // Using POST to send filtered data
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedFilters), // Send the filters in the request body
      });

      if (response.ok) {
        const result = await response.json(); 
        setData(result.data);
        message.success('Filters applied successfully!');
      } else {
        message.error('Failed to apply filters.');
      }
    } catch (error) {
      console.error('Error applying filters:', error);
      message.error('Error applying filters.');
    }
  };

  
  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  const handleReset = () => {
    // Reset all filter states
    setFilters({
      empId: [],
      empName: [],
      role: [],
      dept: [],
      project: [],
      team: [],
      shift: [],
      dateRange: [], 
    });
    setData([]);

  };





  // Handle filter changes
  const handleFilterChange = (key, values) => {
    setFilters((prev) => ({ ...prev, [key]: values }));
  };
  const empid = localStorage.getItem('empid') || '';
const uempid = empid.split(',').map(emp => emp.trim());
const empname= localStorage.getItem('empname') || '';
  const uempname = empname.split(',').map(empn => empn.trim()); // Convert to an arra
  const department= localStorage.getItem('department') || '';
  const udepartment = department.split(',').map(dep => dep.trim()); // Convert to an arra
  const role= localStorage.getItem('role') || '';
  const urole = role.split(',').map(rol => rol.trim()); // Convert to an arra
  const team= localStorage.getItem('team') || '';
  const uteam = team.split(',').map(tea => tea.trim()); // Convert to an arra
  const project= localStorage.getItem('project') || '';
  const uproject = project.split(',').map(pro => pro.trim()); // Convert to an array
  const shift= localStorage.getItem('shift') || '';
  const ushift = shift.split(',').map(shi => shi.trim()); // Convert to an array
  const designationcategory= localStorage.getItem('designationcategory') || '';
  const udesignationcategory = designationcategory.split(',').map(desi => desi.trim()); // Convert to an array

  return (
<div className="container"> 
  {/* Filter Form Section */}
  <div className="card mt-2">
    <div className="card-header d-flex justify-content-between align-items-center">
      <h5 className="mb-0">Filters</h5>
      <button className="btn btn-primary" onClick={() => setShowModal(true)}>
        Add Form
      </button>
    </div>
    
    <div className="row mt-2 mb-2 ms-2 me-2">
      <div className="col-md-12">
        <div className="row mb-2">

          {/* Employee ID Select */}
          <div className="col-12 col-sm-12 col-md-3 mt-2">
            <Select
              size="small"
              mode="multiple"
              className="custom-select"
              style={{ width: "150px", fontSize: "10px", padding: "2px 6px" }}
              dropdownStyle={{ width: "150px" }}
              placeholder={<span className="bold-placeholder">Emp_Id</span>}
              value={filters.empId}
              onChange={(values) => handleFilterChange('empId', values)}
              allowClear
            >
              <Option value="ALL">All</Option>
              {uempid.map(emp => (
                <Option key={emp} value={emp}>
                  {emp}
                </Option>
              ))}
            </Select>
          </div>

          {/* Employee Name Select */}
          <div className="col-12 col-sm-12 col-md-3 mt-2">
            <Select
              size="small"
              mode="multiple"
              className="custom-select"
              style={{ width: "150px", fontSize: "10px", padding: "2px 6px" }}
              dropdownStyle={{ width: "150px" }}
              placeholder={<span className="bold-placeholder">Emp_Name</span>}
              value={filters.empName}
              onChange={(values) => handleFilterChange('empName', values)}
              allowClear
            >
              <Option value="ALL">All</Option>
              {uempname.map(empn => (
                <Option key={empn} value={empn}>
                  {empn}
                </Option>
              ))}
            </Select>
          </div>

          {/* Role Select */}
          <div className="col-12 col-sm-12 col-md-3 mt-2">
            <Select
              size="small"
              mode="multiple"
              className="custom-select"
              style={{ width: "150px", fontSize: "10px", padding: "2px 6px" }}
              dropdownStyle={{ width: "150px" }}
              placeholder={<span className="bold-placeholder">Designation_Category</span>}
              value={filters.role}
              onChange={(values) => handleFilterChange('role', values)}
              allowClear
            >
              <Option value="ALL">All</Option>
              {urole.map(rol => (
                <Option key={rol} value={rol}>
                  {rol}
                </Option>
              ))}
            </Select>
          </div>

          {/* Department Select */}
          <div className="col-12 col-sm-12 col-md-3 mt-2">
            <Select
              size="small"
              mode="multiple"
              className="custom-select"
              style={{ width: "150px", fontSize: "10px", padding: "2px 6px" }}
              dropdownStyle={{ width: "150px" }}
              placeholder={<span className="bold-placeholder">Department</span>}
              value={filters.dept}
              onChange={(values) => handleFilterChange('dept', values)}
              allowClear
            >
              <Option value="ALL">All</Option>
              {udepartment.map(dep => (
                <Option key={dep} value={dep}>
                  {dep}
                </Option>
              ))}
            </Select>
          </div>

          {/* Project Select */}
          <div className="col-12 col-sm-12 col-md-3 mt-2">
            <Select
              size="small"
              mode="multiple"
              className="custom-select"
              style={{ width: "150px", fontSize: "10px", padding: "2px 6px" }}
              dropdownStyle={{ width: "150px" }}
              placeholder={<span className="bold-placeholder">Project</span>}
              value={filters.project}
              onChange={(values) => handleFilterChange('project', values)}
              allowClear
            >
              <Option value="ALL">All</Option>
              {uproject.map(pro => (
                <Option key={pro} value={pro}>
                  {pro}
                </Option>
              ))}
            </Select>
          </div>

          {/* Team Select */}
          <div className="col-12 col-sm-12 col-md-3 mt-2">
            <Select
              size="small"
              mode="multiple"
              className="custom-select"
              style={{ width: "150px", fontSize: "10px", padding: "2px 6px" }}
              dropdownStyle={{ width: "150px" }}
              placeholder={<span className="bold-placeholder">Team</span>}
              value={filters.team}
              onChange={(values) => handleFilterChange('team', values)}
              allowClear
            >
              <Option value="ALL">All</Option>
              {uteam.map(tea => (
                <Option key={tea} value={tea}>
                  {tea}
                </Option>
              ))}
            </Select>
          </div>

          {/* Shift Select */}
          <div className="col-12 col-sm-12 col-md-3 mt-2">
            <Select
              size="small"
              mode="multiple"
              className="custom-select"
              style={{ width: "150px", fontSize: "10px", padding: "2px 6px" }}
              dropdownStyle={{ width: "150px" }}
              placeholder={<span className="bold-placeholder">Shift</span>}
              value={filters.shift}
              onChange={(values) => handleFilterChange('shift', values)}
              allowClear
            >
              <Option value="ALL">All</Option>
              {ushift.map(shi => (
                <Option key={shi} value={shi}>
                  {shi}
                </Option>
              ))}
            </Select>
          </div>


          <div className="col-12 col-sm-12 col-md-3 mt-2 ms-2">
        <RangePicker
          size="small"
          style={{ width: "200px", fontSize: "10px", padding: "2px 6px" }}
          onChange={handleDateRangeChange}
          value={dateRange}
          format="YYYY-MM-DD"
        />
      </div>

      <div className="col-12 col-sm-12 col-md-7 mt-2">
        <button
          className="btn btn-sm btn-primary py-1 w-40"
          onClick={handleSubmit} 
        >
          Filter
        </button>
        <button
          className="btn btn-sm btn-danger text-light py-1 ms-2 w-40"
          onClick={handleReset}
        >
          Reset
        </button>
       
      </div>

          

         
        </div>
      </div>
    </div>
  </div>

  {/* Table Section */}
  <div className="row">
    <div className="col-md-12 mt-2">
      <div className="card">
        <div className="table-responsive" style={{ maxHeight: "400px" }}>
          <table className="table table-bordered table-striped table-hover">
            <thead className="table-primary">
              <tr>
                <th scope="col">Emp_Id</th>
                <th scope="col">Emp_Name</th>
                <th scope="col">SYS_User_Name</th>
                <th scope="col">Shift_Type</th>
                <th scope="col">Shift_Start_Time</th>
                <th scope="col">Shift_End_Time</th>
                <th scope="col">Shift_Start_DT</th>
                <th scope="col">Shift_End_DT</th>
                <th scope="col">Time_Zone</th>
                <th scope="col">Week_Off</th>
                <th scope="col">Comments</th>
                <th scope="col">Updated_By</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="13" className="text-center">
                  No data available, please select filter values.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  {/* Add Form Modal */}
  <ShiftsAdd
    showModal={showModal}
    setShowModal={setShowModal}
    formData={formData}
    handleInputChange={handleInputChange}
  />
</div>

  );
};

export default ShiftsIndex;
