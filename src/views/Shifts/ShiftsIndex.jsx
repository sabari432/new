import React, { useState } from 'react';
import { message, Select, Modal, Button, Card, DatePicker, Spin } from 'antd';  // Import Spin for spinner
import axios from 'axios';
import moment from 'moment';
import ShiftsAdd from './ShiftsAdd';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL1, API_BASE_URL2, API_BASE_URL_LOCAL_HOST } from '../../config';

const { Option } = Select;
const { RangePicker } = DatePicker;

const ShiftsIndex = () => {
  const [data, setData] = useState([]); // Initialize state for data
  const [loading, setLoading] = useState(false); // Initialize state for loading
  const [showModal, setShowModal] = useState(false); // State to control EmployeeDBAdd modal visibility
  const [formData, setFormData] = useState({}); // State for form data  
  const [errors, setErrors] = useState({}); // State for form errors

  // States for filter dropdowns
  const [filters, setFilters] = useState({
    empId: [],
    empName: [],
    role: [],
    dept: [],
    project: [],
    team: [],
    shift: [],
    dateRange: [], // make sure it's initialized as an empty array
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteEmpId, setDeleteEmpId] = useState(null);
  const [dateRange, setDateRange] = useState([]);

  const navigate = useNavigate();

  // Ensure no null or undefined value is passed into the array
  const handleSubmit = async () => {
    setLoading(true);  // Start loading

    const formattedFilters = Object.keys(filters).reduce((acc, key) => {
      if (key !== 'dateRange') {
        // Use empty array check for filters before using .join()
        acc[key] = Array.isArray(filters[key]) && filters[key].length ? filters[key].join(',') : 'ALL';
      }
      return acc;
    }, {});

    const [startDate, endDate] = filters.dateRange || [];
    formattedFilters.startDate = startDate && endDate
      ? startDate.format('YYYY-MM-DD')
      : moment().format('YYYY-MM-DD');
    formattedFilters.endDate = endDate
      ? endDate.format('YYYY-MM-DD')
      : moment().format('YYYY-MM-DD');  

    // Retrieve user ID from localStorage
    const userId = localStorage.getItem('EMPID');
    formattedFilters.userid = userId ? userId : 'ALL'; // Include userid
    
    try {
      const response = await fetch(`${API_BASE_URL1}/api/Shifts.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedFilters),
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
    } finally {
      setLoading(false);  // End loading
    }
  };

  const showDeleteConfirm = (EMPID) => {
    setDeleteEmpId(EMPID);
    setIsModalVisible(true);
  };

  const deleteEmployee = async () => {
    try {
      const response = await axios.delete(`${API_BASE_URL1}/api/deleteshifts.php?EMPID=${deleteEmpId}`, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.data.status === "success") {
        message.success('Employee deleted successfully!');
        setData(prevData => prevData.filter(item => item.EMPID !== deleteEmpId));
      } else {
        message.error(response.data.message || 'Failed to delete employee');
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Error deleting employee');
    } finally {
      setIsModalVisible(false);
    }
  };

  const handleEditClick = (item) => {
    navigate(`/shifts-edit/${item.EMPID}`);
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    setFilters(prev => ({ ...prev, dateRange: dates || [] }));
  };

  const handleReset = () => {
    setFilters({
      empId: [],
      empName: [],
      role: [],
      dept: [],
      project: [],
      team: [],
      shift: [],
      dateRange: [], // Reset date range to empty array
    });
    setData([]);
    setDateRange([]); // Clear the date range as well
  };

  const handleFilterChange = (key, values) => {
    setFilters(prev => ({ ...prev, [key]: values || [] })); // Ensuring no null or undefined values
  };

  const empid = localStorage.getItem('empid')?.split(',') || [];
  const empname = localStorage.getItem('empname')?.split(',') || [];
  const role = localStorage.getItem('role')?.split(',') || [];
  const department = localStorage.getItem('department')?.split(',') || [];
  const project = localStorage.getItem('project')?.split(',') || [];
  const team = localStorage.getItem('team')?.split(',') || [];
  const shift = localStorage.getItem('shift')?.split(',') || [];

  return (
    <div className="container">
      {/* Filter Form Section */}
      <div className="card mt-2">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Filters</h5>
          <Button type="primary" onClick={() => setShowModal(true)}>
            Add Form
          </Button>
        </div>

        <div className="row mt-2 mb-2 ms-2 me-2">
          <div className="col-md-12">
            <div className="row mb-2">
              {/* Employee ID Select */}
              <div className="col-12 col-md-3 mt-2">
                <Select
                  size="small"
                  mode="multiple"
                  className="custom-select"
                  style={{ width: "150px" }}
                  placeholder={<span className="bold-placeholder">Emp_Id</span>}
                  value={filters.empId}
                  onChange={(values) => handleFilterChange('empId', values)}
                  allowClear
                >
                  {empid.map((emp) => (
                    <Option key={emp} value={emp}>{emp}</Option>
                  ))}
                </Select>
              </div>

              {/* Employee Name Select */}
              <div className="col-12 col-md-3 mt-2">
                <Select
                  size="small"
                  mode="multiple"
                  className="custom-select"
                  style={{ width: "150px" }}
                  placeholder={<span className="bold-placeholder">Emp_Name</span>}
                  value={filters.empName}
                  onChange={(values) => handleFilterChange('empName', values)}
                  allowClear
                >
                  {empname.map((empn) => (
                    <Option key={empn} value={empn}>{empn}</Option>
                  ))}
                </Select>
              </div>

              {/* Role Select */}
              <div className="col-12 col-md-3 mt-2">
                <Select
                  size="small"
                  mode="multiple"
                  className="custom-select"
                  style={{ width: "150px" }}
                  placeholder={<span className="bold-placeholder">Designation_Category</span>}
                  value={filters.role}
                  onChange={(values) => handleFilterChange('role', values)}
                  allowClear
                >
                  {role.map((rol) => (
                    <Option key={rol} value={rol}>{rol}</Option>
                  ))}
                </Select>
              </div>

              {/* Department Select */}
              <div className="col-12 col-md-3 mt-2">
                <Select
                  size="small"
                  mode="multiple"
                  className="custom-select"
                  style={{ width: "150px" }}
                  placeholder={<span className="bold-placeholder">Department</span>}
                  value={filters.dept}
                  onChange={(values) => handleFilterChange('dept', values)}
                  allowClear
                >
                  {department.map((dep) => (
                    <Option key={dep} value={dep}>{dep}</Option>
                  ))}
                </Select>
              </div>

              {/* Project Select */}
              <div className="col-12 col-md-3 mt-2">
                <Select
                  size="small"
                  mode="multiple"
                  className="custom-select"
                  style={{ width: "150px" }}
                  placeholder={<span className="bold-placeholder">Project</span>}
                  value={filters.project}
                  onChange={(values) => handleFilterChange('project', values)}
                  allowClear
                >
                  {project.map((pro) => (
                    <Option key={pro} value={pro}>{pro}</Option>
                  ))}
                </Select>
              </div>

              {/* Team Select */}
              <div className="col-12 col-md-3 mt-2">
                <Select
                  size="small"
                  mode="multiple"
                  className="custom-select"
                  style={{ width: "150px" }}
                  placeholder={<span className="bold-placeholder">Team</span>}
                  value={filters.team}
                  onChange={(values) => handleFilterChange('team', values)}
                  allowClear
                >
                  {team.map((tea) => (
                    <Option key={tea} value={tea}>{tea}</Option>
                  ))}
                </Select>
              </div>

              {/* Shift Select */}
              <div className="col-12 col-md-4 mt-2">
                <Select
                  size="small"
                  mode="multiple"
                  className="custom-select"
                  style={{ width: "150px" }}
                  placeholder={<span className="bold-placeholder">Shift</span>}
                  value={filters.shift}
                  onChange={(values) => handleFilterChange('shift', values)}
                  allowClear
                >
                  {shift.map((shi) => (
                    <Option key={shi} value={shi}>{shi}</Option>
                  ))}
                </Select>
              </div>

              <div className="col-12 col-md-6 mt-2">
                <RangePicker
                  size="small"
                  style={{ width: "300px" }}
                  onChange={handleDateRangeChange}
                  value={dateRange}
                  format="YYYY-MM-DD"
                />
              </div>

              <div className="col-12 col-md-4 mt-2" style={{ marginLeft: "-105px" }}>
                <button
                  className="btn btn-sm btn-primary w-40"
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
              <Spin spinning={loading}>  {/* Show spinner if loading */}
                <table className="table table-bordered table-striped table-hover">
                  <thead className="table-primary">
                    <tr>
                      <th>Emp_Id</th>
                      <th>Emp_Name</th>
                      <th>SYS_User_Name</th>
                      <th>Shift_Type</th>
                      <th>Shift_Start_Time</th>
                      <th>Shift_End_Time</th>
                      <th>Shift_Start_DT</th>
                      <th>Shift_End_DT</th>
                      <th>Time_Zone</th>
                      <th>Week_Off</th>
                      <th>Comments</th>
                      <th>Updated_By</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.length > 0 ? data.map((item) => (
                      <tr key={item.EMPID}>
                        <td>{item.EMPID}</td>
                        <td>{item.EMPNAME}</td>
                        <td>{item.SYS_USER_NAME}</td>
                        <td>{item.SHIFTTYPE}</td>
                        <td>{item.SHIFT_START_TIME}</td>
                        <td>{item.SHIFT_END_TIME}</td>
                        <td>{item.SHIFTSTART_DT}</td>
                        <td>{item.SHIFTEND_DT}</td>
                        <td>{item.TIME_ZONE}</td>
                        <td>{item.WEEKOFF}</td>
                        <td>{item.COMMENTS}</td>
                        <td>{item.UPDATED_BY}</td>
                        <td>
                          <div className="btn-group" role="group">
                            <button
                              type="button"
                              className="btn btn-warning text-light"
                              onClick={() => handleEditClick(item)}
                            >
                              <i className="fa fa-pen"></i>
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger ms-2"
                              onClick={() => showDeleteConfirm(item.EMPID)}
                            >
                              <i className="fa fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="13" className="text-center">
                          No data available, please select filter values.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </Spin>
            </div>
          </div>
        </div>
      </div>

      {/* Add Form Modal */}
      <ShiftsAdd showModal={showModal} setShowModal={setShowModal} />

      {/* Modal for delete confirmation */}
      <Modal
        title="Confirm Deletion"
        visible={isModalVisible}
        onOk={deleteEmployee}
        onCancel={() => setIsModalVisible(false)}
        okText="Yes"
        cancelText="No"
      >
        <p>Are you sure you want to delete this employee?</p>
      </Modal>
    </div>
  );
};

export default ShiftsIndex;
