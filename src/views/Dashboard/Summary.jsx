import React, { useState } from 'react';
import { DatePicker, Select, notification, Spin } from 'antd';
import DashboardGroupBarChart from './DashboardGroupBarChart'; // Import your component
import { API_BASE_URL1, API_BASE_URL2, API_BASE_URL_LOCAL_HOST } from '../../config';

const { RangePicker } = DatePicker;
const { Option } = Select;

const Summary = () => {
  const EMPID = localStorage.getItem('EMPID');
  const [dateRange, setDateRange] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [selectedShift, setSelectedShift] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [filterSummary, setFilterSummary] = useState([]);
  const [loading, setLoading] = useState(false);  // New state for loading

  const empid = localStorage.getItem('empid') || '';
  const uempid = empid.split(',').map(emp => emp.trim());
  const empname = localStorage.getItem('empname') || '';
  const uempname = empname.split(',').map(empn => empn.trim());
  const department = localStorage.getItem('department') || '';
  const udepartment = department.split(',').map(dep => dep.trim());
  const team = localStorage.getItem('team') || '';
  const uteam = team.split(',').map(tea => tea.trim());
  const project = localStorage.getItem('project') || '';
  const uproject = project.split(',').map(pro => pro.trim());
  const shift = localStorage.getItem('shift') || '';
  const ushift = shift.split(',').map(shi => shi.trim());

  const handleCategoryChange = (type, value) => {
    if (value.length === 0) {
      setActiveCategory(null);
      setSelectedDepartments([]);
      setSelectedTeams([]);
      setSelectedProjects([]);
      setSelectedShift([]);
      return;
    }

    setActiveCategory(type);
    if (type === 'departments') {
      setSelectedDepartments(value);
      setSelectedTeams([]);
      setSelectedProjects([]);
      setSelectedShift([]);
    }
    if (type === 'teams') {
      setSelectedTeams(value);
      setSelectedDepartments([]);
      setSelectedProjects([]);
      setSelectedShift([]);
    }
    if (type === 'projects') {
      setSelectedProjects(value);
      setSelectedDepartments([]);
      setSelectedTeams([]);
      setSelectedShift([]);
    }
    if (type === 'shifts') {
      setSelectedShift(value);
      setSelectedDepartments([]);
      setSelectedTeams([]);
      setSelectedProjects([]);
    }
  };

  const handleFilterClick = async () => {
    if (!dateRange.length || !activeCategory) {
      notification.error({ message: 'Please select a date range and at least one category.' });
      return;
    }

    const startDate = dateRange[0].format('YYYY-MM-DD');
    const endDate = dateRange[1].format('YYYY-MM-DD');

    const filterData = { startDate, endDate, EMPID };

    if (selectedDepartments.length > 0) filterData.selectedDepartments = selectedDepartments;
    if (selectedTeams.length > 0) filterData.selectedTeams = selectedTeams;
    if (selectedProjects.length > 0) filterData.selectedProjects = selectedProjects;
    if (selectedShift.length > 0) filterData.selectedShift = selectedShift;

    setLoading(true);  // Start loading

    try {
      const response = await fetch(`${API_BASE_URL2}/api/groupdata.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filterData),
      });

      if (response.ok) {
        const result = await response.json();
        setFilteredData(result);
        notification.success({ message: 'Data filtered successfully!' });

        const summary = [];
        if (selectedDepartments.length > 0) {
          summary.push('Departments');
        }
        if (selectedTeams.length > 0) {
          summary.push('Team');
        }
        if (selectedProjects.length > 0) {
          summary.push('Projects');
        }
        if (selectedShift.length > 0) {
          summary.push('Shifts');
        }
        setFilterSummary(summary);
      } else {
        notification.error({ message: 'Failed to filter data.' });
      }
    } catch (error) {
      notification.error({ message: 'An error occurred while filtering data.' });
    } finally {
      setLoading(false);  // Stop loading
    }
  };

  const handleReset = () => {
    setDateRange([]);
    setSelectedDepartments([]);
    setSelectedTeams([]);
    setSelectedProjects([]);
    setSelectedShift([]);
    setActiveCategory(null);
    setFilteredData([]);
    setFilterSummary([]);
  };

  const isDisabled = (type) => {
    return activeCategory && activeCategory !== type;
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
              onChange={(value) => handleCategoryChange('departments', value)}
              disabled={isDisabled('departments')}
            >
              {udepartment.map(dep => (
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
              onChange={(value) => handleCategoryChange('teams', value)}
              disabled={isDisabled('teams')}
            >
              {uteam.map(tea => (
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
              placeholder={<span className="bold-placeholder">Shifts</span>}
              value={selectedShift}
              onChange={(value) => handleCategoryChange('shifts', value)}
              disabled={isDisabled('shifts')}
            >
              {ushift.map(shi => (
                <Option key={shi} value={shi}>
                  {shi}
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
              onChange={(value) => handleCategoryChange('projects', value)}
              disabled={isDisabled('projects')}
            >
              {uproject.map(pro => (
                <Option key={pro} value={pro}>
                  {pro}
                </Option>
              ))}
            </Select>
          </div>

          <div className="col-sm-3 ">
            <button className="btn btn-primary" onClick={handleFilterClick}>Filter</button>
            <button className="btn btn-secondary ms-2" onClick={handleReset}>Reset</button>
          </div>
        </div>

        {/* Display the loading spinner when fetching data */}
        {loading ? (
          <div className="text-center" style={{ marginTop: '20px' }}>
            <Spin size="large" />
          </div>
        ) : (
          <DashboardGroupBarChart 
            filteredData={filteredData} 
            filterSummary={filterSummary} 
          />
        )}

      </div>
    </div>
  );
};

export default Summary;
