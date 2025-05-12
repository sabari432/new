import React, { useState, useRef, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { Chart, registerables } from 'chart.js'; // Import registerables from Chart.js
import { Line } from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.min.css';
import { DatePicker } from 'antd'; // Ant Design DatePicker
import axios from 'axios';
import DashboardStatusCard from './DashboardStatusCard';
import Summary from './Summary';

import DashboardColumnChart from './DashboardColumnChart';
import DashboardGroupFilter from './DashboardGroupFilter';
import DashboardWeekBarChart from './DashboardWeekBarChart'; // Adjust the path according to your file structure
import DashboardSummaryView from './DashboardSummaryView';
import { Select } from 'antd';
import '../Css/Page1.css';
import { Card, Row, Col, Typography, Table, Spin, Alert, Pagination, Button, Dropdown, Menu, Space ,Collapse,Tag} from 'antd';
import { ReloadOutlined, FilterOutlined, DownloadOutlined } from '@ant-design/icons';
import { API_BASE_URL1, API_BASE_URL2, API_BASE_URL_LOCAL_HOST } from '../../config';


const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;


const DashboardIndex = () => {
  // State management for filters and data
  const [uniqueEmpIDCount, setUniqueEmpIDCount] = useState(0);
  const [dateRange, setDateRange] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedDesignations, setSelectedDesignations] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [selectedShifts, setSelectedShifts] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [selectedEMPID, setSelectedEMPID] = useState([]);
  const [selectedEMPNAMES, setSelectedEMPNAMES] = useState([]);
  const [c, setC] = useState(1); // Declare c as state

  
///dropdown data
const EMPID = localStorage.getItem('EMPID');
const totalemp=localStorage.getItem('empid')
  const uempid = (localStorage.getItem('empid') || '').split(',').map(emp => emp.trim());
  const uempname = (localStorage.getItem('empname') || '').split(',').map(empn => empn.trim());
  const udepartment = (localStorage.getItem('department') || '').split(',').map(dep => dep.trim());
  const urole = (localStorage.getItem('role') || '').split(',').map(rol => rol.trim());
  const uteam = (localStorage.getItem('team') || '').split(',').map(tea => tea.trim());
  const uproject = (localStorage.getItem('project') || '').split(',').map(pro => pro.trim());
  const ushift = (localStorage.getItem('shift') || '').split(',').map(shi => shi.trim());
  const udesignationcategory = (localStorage.getItem('designationcategory') || '').split(',').map(desi => desi.trim());

  const [totals, setTotals] = useState({
  
});
//dropdoen---11111
  // State management for table data and pagination
  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const [columns, setColumns] = useState([]);
  const [aggregateData, setAggregateData] = useState([]);
  const [aggregateColumns, setAggregateColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // Set your desired page size here
  const [filteredData, setFilteredData] = useState([]);

  

  // Fetch filtered data
  const fetchFilteredData = () => {
    setLoading(false);
    // Combine all filters into a single object
    const filters = {
      dateRange: {
        start: dateRange[0] ? dateRange[0].format('YYYY-MM-DD') : 'Not Set',
        end: dateRange[1] ? dateRange[1].format('YYYY-MM-DD') : 'Not Set'
      },
      department: selectedDepartments,
      role: selectedRoles,
      designation: selectedDesignations, 
      project: selectedProjects,
      shift: selectedShifts,
      team: selectedTeams,
      ids:selectedEMPID,
      names:selectedEMPNAMES,
      userid:EMPID,
    };

    // Construct query parameters
    const queryParams = new URLSearchParams();

    // Add date range
    if (filters.dateRange.start !== 'Not Set') {
      queryParams.append('dateRange[start]', filters.dateRange.start);
    }
    if (filters.dateRange.end !== 'Not Set') {
      queryParams.append('dateRange[end]', filters.dateRange.end);
    }

    // Add array filters
    const filterKeys = ['department', 'role', 'designation', 'project', 'shift', 'team','ids','names'];
    filterKeys.forEach(key => {
      if (filters[key] && filters[key].length) {
        filters[key].forEach(value => {
          queryParams.append(`${key}[]`, value);
        });
      }
    });
      // Include empid directly
  if (filters.userid) {
    queryParams.append('userid', filters.userid);
  }

    axios.get(`${API_BASE_URL2}/api/fetch_employee_activity.php`, {
      params: queryParams
    })
    .then(response => {
      const { data1,data, columns, uniqueDepartments, uniqueProjects, uniqueRoles,uniqueids,uniquename, uniqueShifts, uniqueTeams, aggregateByDate,totals,unique_empid_count ,uniqueDesignation} = response.data;

      // Format aggregate data for table
      const aggregateTableData = Object.keys(aggregateByDate).map(date => ({
        date,
        ...aggregateByDate[date]
      }));

      setData(data);
      setData1(data1);
      setFilteredData(data);

      // Generate table columns from response data
      const tableColumns = columns.map(col => ({
        title: col,
        dataIndex: col,
        key: col,
        render: text => text || 'N/A'
      }));

      // Add columns for aggregated data
      const aggregateTableColumns = [
        {
          title: 'Date',
          dataIndex: 'date',
          key: 'date'
        },
        {
          title: 'Logged Hours',
          dataIndex: 'total_logged_hours',
          key: 'total_logged_hours'
        },
        {
          title: 'Productive Hours',
          dataIndex: 'total_productive_hours',
          key: 'total_productive_hours'
        },
        {
          title: 'Idle Hours',
          dataIndex: 'total_idle_hours',
          key: 'total_idle_hours'
        },
        {
          title: 'Time On System',
          dataIndex: 'total_time_on_system',
          key: 'total_time_on_system'
        },
        {
          title: 'Away From System',
          dataIndex: 'total_time_away_from_system',
          key: 'total_time_away_from_system'
        },
       
      ];
      

      setColumns(tableColumns);
      setAggregateColumns(aggregateTableColumns);
      setAggregateData(aggregateTableData);
      setTotals(totals);
      setUniqueEmpIDCount(unique_empid_count);

      setLoading(false);
    })
    .catch(error => {
      setError(error);
      setLoading(false);
    });
  };
  useEffect(() => {
    if (c === 1) {
      fetchFilteredData(); // Fetch data only if c is 1
      setC(2);
    }
  }, [c]);

  const handleFilterClick = () => {
    fetchFilteredData(); // Fetch data when filter button is clicked
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  const handleReset = () => {
    setDateRange([]);
    setSelectedDepartments([]);
    setSelectedRoles([]);
    setSelectedDesignations([]);
    setSelectedProjects([]);
    setSelectedShifts([]);
    setSelectedTeams([]);
    setSelectedEMPID([]);
    setSelectedEMPNAMES([]);
  };

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };
  const exportToCSV = (data, columns) => {
    if (!data.length) return;

    // Convert columns to CSV header
    const headers = columns.map(col => col.title).join(',');
    
    
    // Convert data to CSV rows
    const rows = data.map(row =>
        columns.map(col => row[col.dataIndex] || '').join(',')
    );
    
    // Combine headers and rows
    const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows.join('\n')}`;

    // Create a link element and click it to trigger download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'data.csv');
    document.body.appendChild(link); // Required for Firefox

    link.click();
};
if (loading) {
  return (
  <div style={{display:"flex",justifyContent:"center"}}><Spin size="small" /></div>);
}


  return (
<div className="container"> 
<div className="col-9 col-sm-9 col-md-9">
  <div className="card">
  <div className="card-body">
    <div className="row">
      <div className="col-12 col-sm-12 col-md-3 mt-2">
        <Select
          size="small"
          mode="multiple"
          className="custom-select"
          style={{ width: "150px", fontSize: "10px", padding: "2px 6px" }}
          dropdownStyle={{ width: "150px" }}
          placeholder={<span className="bold-placeholder">Emp_Id</span>}       
          value={selectedEMPID}
          onChange={setSelectedEMPID}
          loading={loading}
        >
          {uempid.map(empid => (
                  <Option key={empid} value={empid}>
                    {empid}
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
          placeholder={<span className="bold-placeholder">Emp_Names</span>}
          value={selectedEMPNAMES}
          onChange={setSelectedEMPNAMES}
          loading={loading}
        >
          {uempname.map(empname => (
                  <Option key={empname} value={empname}>
                    {empname}
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
          placeholder={<span className="bold-placeholder">Departments</span>}
          value={selectedDepartments}
          onChange={setSelectedDepartments}
          loading={loading}
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
          placeholder={<span className="bold-placeholder">Designation</span>}
          value={selectedRoles}
          onChange={setSelectedRoles}
          loading={loading}
        >
          {urole.map(role => (
                  <Option key={role} value={role}>
                    {role}
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
          placeholder={<span className="bold-placeholder">Designation category</span>}
          value={selectedDesignations}
          onChange={setSelectedDesignations}
          loading={loading}
        >
          {udesignationcategory.map(designation => (
                  <Option key={designation} value={designation}>
                    {designation}
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
          placeholder={<span className="bold-placeholder">Projects</span>}
          value={selectedProjects}
          onChange={setSelectedProjects}
          loading={loading}
        >
          {uproject.map(project => (
                  <Option key={project} value={project}>
                    {project}
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
          placeholder={<span className="bold-placeholder">Shifts</span>}
          value={selectedShifts}
          onChange={setSelectedShifts}
          loading={loading}
        >
          {ushift.map(shift => (
                  <Option key={shift} value={shift}>
                    {shift}
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
          placeholder={<span className="bold-placeholder">Teams</span>}
          value={selectedTeams}
          onChange={setSelectedTeams}
          loading={loading}
        >
          {uteam.map(team => (
                  <Option key={team} value={team}>
                    {team}
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
          onClick={handleFilterClick}
        >
          Filter
        </button>
        <button
          className="btn btn-sm btn-danger text-light py-1 ms-2 w-40"
          onClick={handleReset}
        >
          Reset
        </button>
        <button
          className="btn btn-sm btn-secondary text-light  py-1 ms-2 w-40"
          onClick=  {() => exportToCSV(data1, columns)}
        >
          Export
        </button>
      </div>
    </div>
  </div>
</div>
</div>

<div className="row mt-2">
  <div className="col-9 col-sm-9 col-md-9">
    <DashboardWeekBarChart
      totals={totals}
      aggregateData={aggregateData}
      aggregateColumns={aggregateColumns}
      employeecount={uniqueEmpIDCount}
      datadis={data1}
      columns={columns}
    />
  </div>
  <div className="col-9 col-sm-9 col-md-9 mt-2">
  <DashboardColumnChart />
  </div>
  <div className="col-9 col-sm-9 col-md-9 mt-2" style={{ height:"800px" }}>   
      <DashboardSummaryView /> 
 
</div>

  <div className="col-9 col-sm-9 col-md-9 mt-2">
  <Summary /> 
  </div>

  <div className="col-3 col-sm-3 col-md-3 "  style={{ marginTop:"-2100px" }}>
    <DashboardStatusCard />   

  </div>
  
    {/*<Summary />   */}

  
</div>

</div>

  );
};

export default DashboardIndex;  