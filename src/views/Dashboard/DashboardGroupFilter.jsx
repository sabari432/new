import React, { useState, useEffect } from 'react';
import { DatePicker, Select, notification } from 'antd';
import axios from 'axios';
import DashboardGroupBarChart from './DashboardGroupBarChart'; // Adjust path if needed
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Css/Page1.css';
import { API_BASE_URL1, API_BASE_URL2, API_BASE_URL_LOCAL_HOST } from '../../config';

const { RangePicker } = DatePicker;
const { Option } = Select;

const DashboardGroupFilter = () => {
  const [dateRange, setDateRange] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [teams, setTeams] = useState([]);
  const [teamData, setTeamData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showChart, setShowChart] = useState(false);
  
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [projects, setProjects] = useState([]);
  const [projectData, setProjectData] = useState({});
  
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [departmentData, setDepartmentData] = useState({});

  
  const empid= localStorage.getItem('empid') || '';
  const uempid = empid.split(',').map(emp => emp.trim()); // Convert to an arra
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




  
  const fetchAllTeams = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL2}/api/fetch_total_teams.php`);
      setTeamData(response.data.data);
      setTeams(Object.keys(response.data.data));
    } catch (error) {
      console.error('Error fetching team data:', error);
      setError('Failed to fetch team data');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllProjects = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL2}/api/fetch_total_projects.php`);
      setProjectData(response.data.data);
      setProjects(Object.keys(response.data.data));
    } catch (error) {
      console.error('Error fetching project data:', error);
      setError('Failed to fetch project data');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllDepartments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL2}/api/fetch_total_departments.php`);
      setDepartmentData(response.data.data);
      setDepartments(Object.keys(response.data.data));
    } catch (error) {
      console.error('Error fetching department data:', error);
      setError('Failed to fetch department data');
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartmentDataByDate = async (startDate, endDate) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL2}/api/fetch_total_departments.php`, {
        params: {
          'dateRange[start]': startDate,
          'dateRange[end]': endDate,
          'department[]': selectedDepartments, // Pass selected departments
        },
      });
      setDepartmentData(response.data.data);
    } catch (error) {
      console.error("Error fetching department data:", error);
      setError("Failed to fetch department data");
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamDataByDate = async (startDate, endDate) => { 
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL2}/api/fetch_total_teams.php`, {
        params: {
          'dateRange[start]': startDate,
          'dateRange[end]': endDate,
          'team[]': selectedTeams, // Pass selected departments
        },
      });
      setTeamData(response.data.data);
    } catch (error) {
      console.error("Error fetching team data:", error);
      setError("Failed to fetch team data");
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectDataByDate = async (startDate, endDate) => { 
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL2}/api/fetch_total_projects.php`, {
        params: {
          'dateRange[start]': startDate,
          'dateRange[end]': endDate,
          'project[]': selectedProjects, // Pass selected departments
        },
      });
      setProjectData(response.data.data);
    } catch (error) {
      console.error("Error fetching team data:", error);
      setError("Failed to fetch team data");
    } finally {
      setLoading(false);
    }
  };

  

  useEffect(() => {
    fetchAllTeams();
    fetchAllProjects();
    fetchAllDepartments(); // Fetch all departments initially
  }, []);

  useEffect(() => {
    if (dateRange.length === 2) {
      const startDate = dateRange[0].format('YYYY-MM-DD');
      const endDate = dateRange[1].format('YYYY-MM-DD');
      fetchDepartmentDataByDate(startDate, endDate);
      fetchTeamDataByDate(startDate, endDate);
      fetchProjectDataByDate(startDate, endDate);
    }
  }, [dateRange, selectedDepartments]); // Fetch department data when date range or departments change

  const handleFilterClick = () => {
    if (selectedTeams.length > 0 && selectedProjects.length > 0 && selectedDepartments.length > 0) {
      notification.error({
        message: 'Invalid Selection',
        description: 'Please click RESET to change your selection.',
        duration: 3,
      });
      return;
    }

    if ((selectedTeams.length > 0 && selectedProjects.length > 0 && selectedDepartments.length > 0)) {
      notification.error({
        message: 'Invalid Selection',
        description: 'Please select between 2 to 4.',
        duration: 3,
      });
    } else {
      setShowChart(true); // Show the chart if selection is valid
    } 
  };

  const handleReset = () => {
    setDateRange([]);
    setSelectedTeams([]);
    setSelectedProjects([]);
    setSelectedDepartments([]);
    setTeamData({});
    setProjectData({});
    setDepartmentData({});
    fetchAllTeams();
    fetchAllProjects();
    fetchAllDepartments();
    setShowChart(false); // Hide the chart
  };

  const handleTeamSelect = (value) => {
    if (selectedProjects.length > 0 || selectedDepartments.length > 0) {
      notification.error({
        message: 'Invalid Action',
        description: 'Please click RESET to modify the selection.',
        duration: 3,
      });
      return;
    }
    setSelectedTeams(value);
  };

  const handleProjectSelect = (value) => {
    if (selectedTeams.length > 0 || selectedDepartments.length > 0) {
      notification.error({
        message: 'Invalid Action',
        description: 'Please click RESET to modify the selection.',
        duration: 3,
      });
      return;
    }
    setSelectedProjects(value);
  };

  const handleDepartmentSelect = (value) => {
    if (selectedTeams.length > 0 || selectedProjects.length > 0) {
      notification.error({
        message: 'Invalid Action',
        description: 'Please click RESET to modify the selection.',
        duration: 3,
      });
      return;
    }
    setSelectedDepartments(value);
  };

  const getCombinedData = () => {
    const teamDataArray = selectedTeams.map((team) => ({
      name: team,
      ...teamData[team],
    }));
    const projectDataArray = selectedProjects.map((project) => ({
      name: project,
      ...projectData[project],
    }));
    const departmentDataArray = selectedDepartments.map((department) => ({
      name: department,
      ...departmentData[department],
    }));
    return [...teamDataArray, ...projectDataArray, ...departmentDataArray];
  };

  return (
    <div className="card h-100">
      <div className="card-header">
        <h5>Group View</h5>
      </div>
      <div className="card-body">
        <div className="row">
          
          <div className="col-sm-3">
            <RangePicker
              onChange={setDateRange}
              value={dateRange}
              format="YYYY-MM-DD"
            />
          </div>

          <div className="col-sm-3">
            <Select
              size="small"
              mode="multiple"
              className="custom-select"
              style={{ width: "200px", fontSize: "10px", padding: "2px 6px" }}
              dropdownStyle={{ width: "150px" }}
              placeholder={<span className="bold-placeholder">Departments</span>}
              value={selectedDepartments}
              onChange={handleDepartmentSelect}
            >
              {udepartment.map((dep) => (
                <Option key={dep} value={dep}>
                  {dep}
                </Option>
              ))}
            </Select>
          </div>

          <div className="col-sm-3">
            <Select
              size="small"
              mode="multiple"
              className="custom-select"
              style={{ width: "200px", fontSize: "10px", padding: "2px 6px" }}
              dropdownStyle={{ width: "150px" }}
              placeholder={<span className="bold-placeholder">Teams</span>}
              value={selectedTeams}
              onChange={handleTeamSelect}
            >
              {uteam.map((tea) => (
                <Option key={tea} value={tea}>
                  {tea}
                </Option>
              ))}
            </Select>
          </div>

          <div className="col-sm-3">
            <Select
              size="small"
              mode="multiple"
              className="custom-select"
              style={{ width: "200px", fontSize: "10px", padding: "2px 6px" }}
              dropdownStyle={{ width: "150px" }}
              placeholder={<span className="bold-placeholder">Projects</span>}
              value={selectedProjects}
              onChange={handleProjectSelect}
              
            >
              {uproject.map((pro) => (
                <Option key={pro} value={pro}>
                  {pro}
                </Option>
              ))}
            </Select>
          </div>

          <div className="col-sm-3 mt-2">
            <button className="btn btn-sm btn-primary mx-2" onClick={handleFilterClick}>
              Filter
            </button>
            <button className="btn btn-sm btn-danger" onClick={handleReset}>
              Reset
            </button>
          </div>
        </div>

        {showChart && <DashboardGroupBarChart combinedData={getCombinedData()} />}
      </div>
    </div>
  );
};

export default DashboardGroupFilter;
