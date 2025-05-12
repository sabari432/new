import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Select, Modal, message, Spin } from 'antd';
import UsersEdit from './UsersEdit';
import '../Css/Page1.css';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL1, API_BASE_URL2, API_BASE_URL_LOCAL_HOST } from '../../config';

const { Option } = Select;

const UsersFilterAndTable = () => {
  // State declarations
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteEmpId, setDeleteEmpId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [rows, setRows] = useState([]);

  // Local storage data
  const empid = localStorage.getItem('empid') || '';
  const uempid = empid.split(',').map(emp => emp.trim());
  const empname = localStorage.getItem('empname') || '';
  const uempname = empname.split(',').map(empn => empn.trim());
  const department = localStorage.getItem('department') || '';
  const udepartment = department.split(',').map(dep => dep.trim());
  const role = localStorage.getItem('role') || '';
  const urole = role.split(',').map(rol => rol.trim());
  const team = localStorage.getItem('team') || '';
  const uteam = team.split(',').map(tea => tea.trim());
  const project = localStorage.getItem('project') || '';
  const uproject = project.split(',').map(pro => pro.trim());
  const shift = localStorage.getItem('shift') || '';
  const ushift = shift.split(',').map(shi => shi.trim());
  const designationcategory = localStorage.getItem('designationcategory') || '';
  const udesignationcategory = designationcategory.split(',').map(desi => desi.trim());

  // Form and employee data state
  const [formData, setFormData] = useState({
    empId: [],
    empName: [],
    department: [],
    role: [],
    project: [],
    team: [],
    sysUserName: [],
    activeYn: [],
  });

  const [employeeData, setEmployeeData] = useState({
    allData: [],
    filteredData: [],
    empIds: [],
    empNames: [],
    departments: [],
    roles: [],
    projects: [],
    teams: [],
    sysUserNames: [],
    activeStatuses: [],
  });

  const headers = [
    { label: 'Emp_Name', key: 'EMPNAME' },
    { label: 'Department', key: 'DEPARTMENT' },
    { label: 'Designation', key: 'ROLE' },
    { label: 'Project', key: 'PROJECT' },
    { label: 'Emp_Id', key: 'EMPID' },
    { label: 'Team', key: 'TEAM' },
    { label: 'SYS_User_Name', key: 'SYS_USER_NAME' },
    { label: 'Active_YN', key: 'ACTIVE_YN' },
    { label: 'Email', key: 'EMAIL' },
    { label: 'Designation_Category', key: 'DESIGNATION_CATEGORY' },
    { label: 'Required_Productive_Hrs', key: 'REQUIRED_PRODUCTIVE_HRS' },
    { label: 'Reporting_1', key: 'REPORTING_1' },
    { label: 'Reporting_2', key: 'REPORTING_2' },
    { label: 'Shift', key: 'SHIFT' },
    { label: 'Alloted_Break', key: 'ALLOTED_BREAK' },
    { label: 'Holiday_Country', key: 'HOLIDAY_COUNTRY' },
    { label: 'Region', key: 'REGION' },
    { label: 'Updated_By', key: 'UPDATED_BY' },
  ];

  const navigate = useNavigate();
  const userid = localStorage.getItem('EMPID');

  // Fetch initial data
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_BASE_URL1}/api/fetch_data1.php`, {
        params: { userid }
      })
      .then((response) => {
        const { data, uniqueValues } = response.data;
        if (data && Array.isArray(data)) {
          setEmployeeData({
            allData: data,
            filteredData: data, // Show all data initially
            empIds: uniqueValues.EMPID || [],
            empNames: uniqueValues.EMPNAME || [],
            departments: uniqueValues.DEPARTMENT || [],
            roles: uniqueValues.ROLE || [],
            projects: uniqueValues.PROJECT || [],
            teams: uniqueValues.TEAM || [],
            sysUserNames: uniqueValues.SYS_USER_NAME || [],
            activeStatuses: uniqueValues.ACTIVE_YN || [],
          });
          setRows(data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  const handleEditClick = (employee) => {
    navigate(`/users-edit/${employee.EMPID}`);
  };

  const exportToCSV = (data) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      message.error('No data available to export');
      return;
    }

    const csvRows = [];
    const headerValues = headers.map(header => `"${header.label}"`);
    csvRows.push(headerValues.join(','));

    data.forEach(row => {
      const values = headers.map(header => {
        const value = row[header.key] !== undefined ? row[header.key] : '';
        return `"${String(value).replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'users_data.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const submitUser = () => {
    setLoading(true);
    const filtered = employeeData.allData.filter((item) => {
      return (
        (formData.empId.length === 0 || formData.empId.includes(item.EMPID)) &&
        (formData.empName.length === 0 || formData.empName.includes(item.EMPNAME)) &&
        (formData.department.length === 0 || formData.department.includes(item.DEPARTMENT)) &&
        (formData.role.length === 0 || formData.role.includes(item.ROLE)) &&
        (formData.project.length === 0 || formData.project.includes(item.PROJECT)) &&
        (formData.team.length === 0 || formData.team.includes(item.TEAM)) &&
        (formData.sysUserName.length === 0 || formData.sysUserName.includes(item.SYS_USER_NAME)) &&
        (formData.activeYn.length === 0 || formData.activeYn.includes(item.ACTIVE_YN))
      );
    });

    setEmployeeData(prev => ({
      ...prev,
      filteredData: filtered,
    }));
    setRows(filtered);
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      empId: [],
      empName: [],
      department: [],
      role: [],
      project: [],
      team: [],
      sysUserName: [],
      activeYn: [],
    });
    setEmployeeData(prev => ({
      ...prev,
      filteredData: prev.allData, // Reset to show all data
    }));
    setRows(employeeData.allData);
  };

  return (
    <div>
      {/* Filter Form Section */}
      <div className="card mt-2">
        <div className="row mt-2 mb-2 ms-2 me-2">
          <div className="col-md-12">
            <div className="row mb-2">
              <div className="col-12 col-sm-12 col-md-3 mt-2">
                <Select
                  size="small"
                  mode="multiple"
                  className="custom-select"
                  style={{ width: "150px", fontSize: "10px", padding: "2px 6px" }}
                  dropdownStyle={{ width: "150px" }}
                  placeholder={<span className="bold-placeholder">Emp_Id</span>}
                  value={formData.empId}
                  onChange={(value) => setFormData(prev => ({ ...prev, empId: value }))}
                >
                  {uempid.map(emp => (
                    <Option key={emp} value={emp}>{emp}</Option>
                  ))}
                </Select>
              </div>
               <div className="col-12 col-sm-12 col-md-3 mt-2">
                            <Select
                              size="small"
                              mode="multiple"
                              className="custom-select"
                              style={{ width: "150px", fontSize: "10px", padding: "2px 6px" }}
                              dropdownStyle={{ width: "150px" }}
                              placeholder={<span className="bold-placeholder">Emp_Name</span>}
                              value={formData.empName}
                              onChange={(value) =>
                                setFormData((prev) => ({ ...prev, empName: value }))
                              }
                            >
                              {uempname.map(empn => (
                              <Option key={empn} value={empn}>
                                {empn}
                              </Option>
                            ))}
                            </Select>
                          </div>
                
                          <div className="col-12 col-sm-12 col-md-3 mt-2">
                            <Select
                              size="small"
                              mode="multiple"
                              className="custom-select"
                              style={{ width: "150px", fontSize: "10px", padding: "2px 6px" }}
                              dropdownStyle={{ width: "150px" }}
                              placeholder={<span className="bold-placeholder">Department</span>}
                              value={formData.department}
                              onChange={(value) =>
                                setFormData((prev) => ({ ...prev, department: value }))
                              }
                            >
                              {udepartment.map(dep => (
                                <Option key={dep} value={dep}>
                                  {dep}
                                </Option>
                            ))}
                            </Select>
                          </div>
                
                          <div className="col-12 col-sm-12 col-md-3 mt-2">
                            <Select
                              size="small"
                              mode="multiple"
                              className="custom-select"
                              style={{ width: "150px", fontSize: "10px", padding: "2px 6px" }}
                              dropdownStyle={{ width: "150px" }}
                              placeholder={<span className="bold-placeholder">DESIGNATION</span>}
                              value={formData.role}
                              onChange={(value) =>
                                setFormData((prev) => ({ ...prev, role: value }))
                              }
                            >
                              {urole.map(rol => (
                              <Option key={rol} value={rol}>
                                {rol}
                              </Option>
                            ))}
                            </Select>
                          </div>
                
                          <div className="col-12 col-sm-12 col-md-3 mt-2">
                            <Select
                              size="small"
                              mode="multiple"
                              className="custom-select"
                              style={{ width: "150px", fontSize: "10px", padding: "2px 6px" }}
                              dropdownStyle={{ width: "150px" }}
                              placeholder={<span className="bold-placeholder">Project</span>}
                              value={formData.project}
                              onChange={(value) =>
                                setFormData((prev) => ({ ...prev, project: value }))
                              }
                            >
                              {uproject.map(pro => (
                              <Option key={pro} value={pro}>
                                {pro}
                              </Option>
                            ))}
                            </Select>
                          </div>
                
                          <div className="col-12 col-sm-12 col-md-3 mt-2">
                            <Select
                              size="small"
                              mode="multiple"
                              className="custom-select"
                              style={{ width: "150px", fontSize: "10px", padding: "2px 6px" }}
                              dropdownStyle={{ width: "150px" }}
                              placeholder={<span className="bold-placeholder">Team</span>}
                              value={formData.team}
                              onChange={(value) =>
                                setFormData((prev) => ({ ...prev, team: value }))
                              }
                            >
                              {uteam.map(tea => (
                                <Option key={tea} value={tea}>
                                  {tea}
                                </Option>
                              ))}
                            </Select>
                          </div>
                
                          <div className="col-12 col-sm-12 col-md-3 mt-2">
                            <Select
                              size="small"
                              mode="multiple"
                              className="custom-select"
                              style={{ width: "150px", fontSize: "10px", padding: "2px 6px" }}
                              dropdownStyle={{ width: "150px" }}
                              placeholder={ <span className="bold-placeholder">SYS_User_Name</span>}
                              value={formData.sysUserName}
                              onChange={(value) =>
                                setFormData((prev) => ({ ...prev, sysUserName: value }))
                              }
                            >
                              {employeeData.sysUserNames.map((userName) => (
                                <Option key={userName} value={userName}>
                                  {userName}
                                </Option>
                              ))}
                            </Select>
                          </div>
                          <div className="col-12 col-sm-12 col-md-3 mt-2">
                            <Select
                              size="small"
                              mode="multiple"
                              className="custom-select"
                              style={{ width: "150px", fontSize: "10px", padding: "2px 6px" }}
                              dropdownStyle={{ width: "150px" }}
                              placeholder={<span className="bold-placeholder">Active_YN</span>}
                              value={formData.activeYn}
                              onChange={(value) =>
                                setFormData((prev) => ({ ...prev, activeYn: value }))
                              }
                            >
                              {employeeData.activeStatuses.map((status) => (
                                <Option key={status} value={status}>
                                  {status}
                                </Option>
                              ))}
                            </Select>
                          </div>
              {/* ... (other Select components remain the same) */}
              <div className="col-12 col-sm-12 col-md-6 mt-2">
                <button
                  className="btn btn-sm btn-primary py-1 ms-1 w-40"
                  onClick={submitUser}
                >
                  Filter
                </button>
                <button
                  className="btn btn-sm btn-danger text-light py-1 ms-2 w-40"
                  onClick={resetForm}
                >
                  Reset
                </button>
                <button
                  className="btn btn-sm btn-success text-light py-1 ms-2 w-40"
                  onClick={() => exportToCSV(employeeData.filteredData)}
                >
                  Export
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
            <Spin spinning={loading}>
              <div className="table-responsive" style={{ maxHeight: "400px" }}>
                <table className="table table-bordered table-striped table-hover">
                  <thead className="table-body">
                    <tr>
                      <th scope="col">Emp_Id</th>
                      <th scope="col">Emp_Name</th>
                      <th scope="col">Email</th>
                      <th scope="col">SYS_User_Name</th>
                      <th scope="col">Designation</th>
                      <th scope="col">Designation_Category</th>
                      <th scope="col">Required_Productive_Hrs</th>
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
                    {employeeData.filteredData.length > 0 ? (
                      employeeData.filteredData.map((employee) => (
                        <tr key={employee.EMPID}>
                          <td>{employee.EMPID}</td>
                          <td>{employee.EMPNAME}</td>
                          <td>{employee.EMAIL}</td>
                          <td>{employee.SYS_USER_NAME}</td>
                          <td>{employee.ROLE}</td>
                          <td>{employee.DESIGNATION_CATEGORY}</td>
                          <td>{employee.REQUIRED_PRODUCTIVE_HRS}</td>
                          <td>{employee.REPORTING_1}</td>
                          <td>{employee.REPORTING_2}</td>
                          <td>{employee.DEPARTMENT}</td>
                          <td>{employee.TEAM}</td>
                          <td>{employee.PROJECT}</td>
                          <td>{employee.SHIFT}</td>
                          <td>{employee.ALLOTED_BREAK}</td>
                          <td>{employee.ACTIVE_YN}</td>
                          <td>{employee.HOLIDAY_COUNTRY}</td>
                          <td>{employee.REGION}</td>
                          <td>{employee.UPDATED_BY}</td>
                          <td>
                            <div className="btn-group" role="group">
                              <button
                                type="button"
                                className="btn btn-warning text-light"
                                onClick={() => handleEditClick(employee)}
                              >
                                <i className="fa fa-pen"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="19" className="text-center">
                          No data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Spin>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersFilterAndTable;