import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Select, message, DatePicker } from 'antd'; // Ant Design components
import ShiftsAdd from './ShiftsAdd'; // Import the Add component
import '../Css/Page1.css';
import { API_BASE_URL1, API_BASE_URL2, API_BASE_URL_LOCAL_HOST } from '../../config';

const { RangePicker } = DatePicker;
const { Option } = Select;

const ShiftsFilterAndTable = () => {
  // State for managing filter selections
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [dateRange, setDateRange] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // State for employee data and fetched filter values
  const [employeeData, setEmployeeData] = useState({
    empIds: [],
    empNames: [],
    departments: [],
    roles: [],
    projects: [],
    teams: [],
    shifts: [],
  });

  // State for form data
  const [formData, setFormData] = useState({
    empId: [],
    empName: [],
    department: [],
    role: [],
    project: [],
    team: [],
  });

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_BASE_URL1}/api/Shifts.php`)
      .then((response) => {
        const data = response.data;
        setEmployeeData({
          empIds: data.uniqueEmpIds || [],
          empNames: data.uniqueEmpNames || [],
          departments: data.uniqueDepts || [],
          roles: data.uniqueRoles || [],
          projects: data.uniqueProjects || [],
          teams: data.uniqueTeams || [],
          shifts: data.uniqueShifts || [],
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        message.error('Failed to fetch data');
        setLoading(false);
      });
  }, []);

  // Function to handle form input change for multi-selects
  const handleInputChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Function to submit filtered data
  const submitUser = () => {
    // Apply filtering logic here based on formData
    // For example, you can use formData to filter the employeeData.allData.
  };

  // Function to reset form data and clear the table
  const resetForm = () => {
    setFormData({
      empId: [],
      empName: [],
      department: [],
      role: [],
      project: [],
      team: [],
    });
  };

  return (
    <div>
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
            <div className="col-sm-3">
              <RangePicker
                onChange={setDateRange}
                value={dateRange}
                format="YYYY-MM-DD"
              />
            </div>
  
            <div className="col-sm-1">
              <Select
                size="small"
                mode="multiple"
                className="custom-select"
                style={{ width: "90px", fontSize: "10px", padding: "2px 6px" }}
                placeholder={<span className="bold-placeholder">Emp_Id</span>}
                dropdownStyle={{ width: "150px" }}
                value={formData.empId}
                loading={loading}
                onChange={(value) => handleInputChange("empId", value)}
              >
                {employeeData.empIds.map((empId) => (
                  <Option key={empId} value={empId}>
                    {empId}
                  </Option>
                ))}
              </Select>
            </div>
  
            <div className="col-sm-1">
              <Select
                size="small"
                className="custom-select"
                mode="multiple"
                style={{ width: "90px", fontSize: "10px", padding: "2px 6px" }}
                placeholder={<span className="bold-placeholder">Emp_Name</span>}
                dropdownStyle={{ width: "150px" }}
                value={formData.empName}
                loading={loading}
                onChange={(value) => handleInputChange("empName", value)}
              >
                {employeeData.empNames.map((empName) => (
                  <Option key={empName} value={empName}>
                    {empName}
                  </Option>
                ))}
              </Select>
            </div>
  
            <div className="col-sm-1">
              <Select
                size="small"
                className="custom-select"
                mode="multiple"
                style={{ width: "90px", fontSize: "10px", padding: "2px 6px" }}
                placeholder={<span className="bold-placeholder">Department</span>}
                dropdownStyle={{ width: "150px" }}
                value={formData.department}
                loading={loading}
                onChange={(value) => handleInputChange("department", value)}
              >
                {employeeData.departments.map((department) => (
                  <Option key={department} value={department}>
                    {department}
                  </Option>
                ))}
              </Select>
            </div>
  
            <div className="col-sm-1">
              <Select
                size="small"
                className="custom-select"
                mode="multiple"
                style={{ width: "90px", fontSize: "10px", padding: "2px 6px" }}
                placeholder={<span className="bold-placeholder">Role</span>}
                dropdownStyle={{ width: "150px" }}
                value={formData.role}
                loading={loading}
                onChange={(value) => handleInputChange("role", value)}
              >
                {employeeData.roles.map((role) => (
                  <Option key={role} value={role}>
                    {role}
                  </Option>
                ))}
              </Select>
            </div>
  
            <div className="col-sm-1">
              <Select
                size="small"
                className="custom-select"
                mode="multiple"
                style={{ width: "90px", fontSize: "10px", padding: "2px 6px" }}
                placeholder={<span className="bold-placeholder">Project</span>}
                dropdownStyle={{ width: "150px" }}
                value={formData.project}
                loading={loading}
                onChange={(value) => handleInputChange("project", value)}
              >
                {employeeData.projects.map((project) => (
                  <Option key={project} value={project}>
                    {project}
                  </Option>
                ))}
              </Select>
            </div>
  
            <div className="col-sm-1">
              <Select
                size="small"
                className="custom-select"
                mode="multiple"
                style={{ width: "90px", fontSize: "10px", padding: "2px 6px" }}
                placeholder={<span className="bold-placeholder">Team</span>}
                dropdownStyle={{ width: "150px" }}
                value={formData.team}
                loading={loading}
                onChange={(value) => handleInputChange("team", value)}
              >
                {employeeData.teams.map((team) => (
                  <Option key={team} value={team}>
                    {team}
                  </Option>
                ))}
              </Select>
            </div>
  
            <div className="col-sm-1">
              <button className="btn btn-primary py-1 w-100" onClick={submitUser}>
                Filter
              </button>
            </div>
  
            <div className="col-sm-1">
              <button className="btn btn-danger py-1 w-100" onClick={resetForm}>
                Reset
              </button>
            </div>
          </div>
        </div>
  
        {/* Table Section */}
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
                      <th scope="col">Email</th>
                      <th scope="col">SYS_User_Name</th>
                      <th scope="col">Role</th>
                      <th scope="col">Reporting_1</th>
                      <th scope="col">Reporting_2</th>
                      <th scope="col">Department</th>
                      <th scope="col">Team</th>
                      <th scope="col">Project</th>
                      <th scope="col">Shift</th>
                      <th scope="col">Alloted_Break</th>
                      <th scope="col">Active_YN</th>
                      <th scope="col">Holiday_Country</th>
                      <th scope="col">Region</th>
                      <th scope="col">Updated_By</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Hardcoded row */}
  
                    <tr>
                      <td colSpan="17" className="text-center">
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
    </div>
  </div>
  
  );
};

export default ShiftsFilterAndTable;
