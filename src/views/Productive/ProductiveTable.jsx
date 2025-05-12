import React, { useState, useRef, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { Chart, registerables } from 'chart.js'; // Import registerables from Chart.js
import { Line } from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.min.css';
import { DatePicker } from 'antd'; // Ant Design DatePicker
import axios from 'axios';
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
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [selectedShifts, setSelectedShifts] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [selectedEMPID, setSelectedEMPID] = useState([]);
  const [selectedEMPNAMES, setSelectedEMPNAMES] = useState([]);
  const [totals, setTotals] = useState({
    total_logged_hours: '00:00:00',
    total_idle_hours: '00:00:00',
    total_productive_hours: '00:00:00',
    total_time_on_system: '00:00:00',
    total_time_away_from_system: '00:00:00'
});
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [projects, setProjects] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [teams, setTeams] = useState([]);
  const [ids, setIds] = useState([]);
  const [names, setNames] = useState([]);

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
    setLoading(true);
    // Combine all filters into a single object
    const filters = {
      dateRange: {
        start: dateRange[0] ? dateRange[0].format('YYYY-MM-DD') : 'Not Set',
        end: dateRange[1] ? dateRange[1].format('YYYY-MM-DD') : 'Not Set'
      },
      department: selectedDepartments,
      role: selectedRoles,
      project: selectedProjects,
      shift: selectedShifts,
      team: selectedTeams,
      ids:selectedEMPID,
      names:selectedEMPNAMES
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
    const filterKeys = ['department', 'role', 'project', 'shift', 'team','ids','names'];
    filterKeys.forEach(key => {
      if (filters[key] && filters[key].length) {
        filters[key].forEach(value => {
          queryParams.append(`${key}[]`, value);
        });
      }
    });

    axios.get(`${API_BASE_URL1}/fetch_employee_activity.php`, {
      params: queryParams
    })
    .then(response => {
      const { data1,data, columns, uniqueDepartments, uniqueProjects, uniqueRoles,uniqueids,uniquename, uniqueShifts, uniqueTeams, aggregateByDate,totals,unique_empid_count } = response.data;

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
          title: 'Total Logged Hours',
          dataIndex: 'total_logged_hours',
          key: 'total_logged_hours'
        },
        {
          title: 'Total Idle Hours',
          dataIndex: 'total_idle_hours',
          key: 'total_idle_hours'
        },
        {
          title: 'Total Productive Hours',
          dataIndex: 'total_productive_hours',
          key: 'total_productive_hours'
        },
        {
          title: 'Total Time Away From System',
          dataIndex: 'total_time_away_from_system',
          key: 'total_time_away_from_system'
        },
        {
          title: 'Total Time On System',
          dataIndex: 'total_time_on_system',
          key: 'total_time_on_system'
        }
      ];
      

      setColumns(tableColumns);
      setAggregateColumns(aggregateTableColumns);
      setAggregateData(aggregateTableData);
      setTotals(totals);
      setDepartments(uniqueDepartments || []);
      setProjects(uniqueProjects || []);
      setRoles(uniqueRoles || []);
      setShifts(uniqueShifts || []);
      setTeams(uniqueTeams || []);
      setIds(uniqueids||[]);
      setNames(uniquename||[]);
      setUniqueEmpIDCount(unique_empid_count);

      setLoading(false);
    })
    .catch(error => {
      setError(error);
      setLoading(false);
    });
  };
  useEffect(() => {
    fetchFilteredData(); // Fetch data initially when component mounts
  }, []);
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
<div className="container ">
  {" "}
  {/* Form Section */}
  <div className="card">
  <div className="card-header">
          <h5>Select Employee ID</h5>
        </div>
  <div className="card-body">
    <div className="row">
      <div className="col-sm-2">
        <Select
          size="small"
          mode="multiple"
          className="custom-select"
          style={{ width: "200px", fontSize: "10px", padding: "2px 6px" }}
          dropdownStyle={{ width: "150px" }}
          placeholder={<span className="bold-placeholder">Emp_Id</span>}
          value={selectedEMPID}
          onChange={setSelectedEMPID}
          loading={loading}
          >
          {ids.map((ids) => (
            <Option key={ids} value={ids}>
              {ids}
            </Option>
          ))}
        </Select>
      </div>

      <div className="col-sm-3 ">
        <RangePicker
          size="small"
          onChange={handleDateRangeChange}
          value={dateRange}
          format="YYYY-MM-DD"
        />
      </div>

      <div className="col-sm-4 ">
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
          onClick={() => exportToCSV(filteredData, columns)}
        >
          UPDATE PRODUCTIVE WEBSITE
        </button>
      </div>
    </div>
  </div>
</div>


<div className="row">
      <div className="col-md-6 mt-2">
        <div className="card">
          {/* Bootstrap's table-responsive class for horizontal and vertical scrolling */}
          <div className="table-responsive" style={{ maxHeight: "400px" }}>
            <table className="table table-bordered table-striped table-hover">
              <thead className="table-primary">
                <tr>
                  <th scope="col">RESTRICTED WEBSITES</th>
                </tr>
              </thead>
              <tbody>            
                    <tr>
                      <td>chartgpt.com</td>              
                    </tr>
                    <tr>
                      <td>yahoo.com</td>               
                    </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

</div>

  );
};

export default DashboardIndex; 