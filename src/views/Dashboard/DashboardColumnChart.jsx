import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactApexChart from 'react-apexcharts';
import { Table, Select, Space, Button, Spin, Alert, Modal } from 'antd';
import { SearchOutlined, ResetOutlined ,DownloadOutlined} from '@ant-design/icons';
import moment from 'moment';
import '../Css/Page3.css';
import { API_BASE_URL1, API_BASE_URL2, API_BASE_URL_LOCAL_HOST } from '../../config';

const months = moment.months();
const currentYear = moment().year();
const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

const { Option } = Select;

const convertTimeToHoursAndMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return `${hours}h ${minutes.toString().padStart(2, '0')}m`;
};

const transformData = (data) => {
  if (!data || typeof data !== 'object') return [];
  return Object.keys(data).map(date => ({ date, ...data[date] }));
};

const DashboardColumnChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(moment().format('MMMM'));
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedDate, setSelectedDate] = useState(null);

  // Filter states
  const [uniqueDepartments, setUniqueDepartments] = useState([]);
  const [uniqueRoles, setUniqueRoles] = useState([]);
  const [uniqueDesignations, setUniqueDesignations] = useState([]);
  const [uniqueProjects, setUniqueProjects] = useState([]);
  const [uniqueShifts, setUniqueShifts] = useState([]);
  const [uniqueTeams, setUniqueTeams] = useState([]);
  const [ids, setIds] = useState([]);
  const [names, setNames] = useState([]);




  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedDesignations, setSelectedDesignations] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [selectedShifts, setSelectedShifts] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);

  const [selectedEMPID, setSelectedEMPID] = useState([]);
  const [selectedEMPNAMES, setSelectedEMPNAMES] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [filteredModalData, setFilteredModalData] = useState([]);
  const [columns, setColumns] = useState([]);
  const EMPID = localStorage.getItem('EMPID') || '';
  useEffect(() => {
    const fetchUniqueFilters = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL2}/api/monthdata.php`);
        const { uniqueDepartments, uniqueRoles, uniqueProjects, uniqueShifts, uniqueTeams, uniquename, uniqueids,uniquedesignations } = response.data;
        setUniqueDepartments(uniqueDepartments);
        setUniqueRoles(uniqueRoles); 
        setUniqueDesignations(uniquedesignations);
        setUniqueProjects(uniqueProjects);
        setUniqueShifts(uniqueShifts);
        setUniqueTeams(uniqueTeams);
        setIds(uniqueids); // Set IDs
        setNames(uniquename); // Set Names
      } catch (err) {
        setError(err);
      }
    };

    fetchUniqueFilters();
    fetchFilteredData(); // Initial data fetch
  }, []);
  useEffect(() => {
    fetchFilteredData(); // Fetch data whenever filter states change
  }, [selectedMonth, selectedYear, selectedDepartments]);


   const fetchFilteredData = async () => {
    const startDate = moment(`${selectedYear}-${moment().month(selectedMonth).format('MM')}-01`).format('YYYY-MM-DD');
    const endDate = moment(startDate).endOf('month').format('YYYY-MM-DD');

    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL2}/api/monthdata.php`, {
        params: {
          month: selectedMonth,
          year: selectedYear,
          department: selectedDepartments,
          role: selectedRoles,
          designations: selectedDesignations,
          project: selectedProjects,
          shift: selectedShifts,
          team: selectedTeams,
          ids: selectedEMPID,
          names: selectedEMPNAMES,
          userid:EMPID
        }
      });
      const transformedData = transformData(response.data.aggregateByDate);
      setData(transformedData);
      setModalData(response.data.data12);
      setColumns(response.data.columns);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setSelectedMonth(moment().format('MMMM'));
    setSelectedYear(currentYear);
    setSelectedDepartments([]);
    setSelectedRoles([]); 
    setSelectedDesignations([]);
    setSelectedProjects([]);
    setSelectedShifts([]);
    setSelectedTeams([]);
    setSelectedEMPID([]);
    setSelectedEMPNAMES([]);
    fetchFilteredData();
  };

  const filterModalDataByDate = (date) => {
    if (!date || !modalData.length) {
      setFilteredModalData([]);
      return;
    }
    const filteredData = modalData.filter(item => item.Date === date);
    setFilteredModalData(filteredData);
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

const chartData = () => {
  if (!Array.isArray(data) || data.length === 0) {
    return { series: [], options: {} };
  }

  // Sort the data by date to maintain correct order
  const sortedData = data.sort((a, b) => new Date(a.date) - new Date(b.date));

  const dates = sortedData.map(item => moment(item.date).format('MMM DD')); // Format to 'MMM DD'
  
  // Here we keep the decimal value intact for chart data
  const totalIdleHours = sortedData.map(item => parseFloat(item.total_idle_hours));
  const totalProductiveHours = sortedData.map(item => parseFloat(item.total_productive_hours));

  return {
    series: [
      { name: 'Idle Hours', data: totalIdleHours },
      { name: 'Productive Hours', data: totalProductiveHours }
    ],
    options: {
      chart: {
        type: 'bar',
        height: 350,
        stacked: true,
        toolbar: { show: true },
        zoom: { enabled: false },
        events: {
          dataPointSelection: (event, chartContext, config) => {
            const { dataPointIndex } = config;
            const selectedDate = sortedData[dataPointIndex].date;
            setSelectedDate(selectedDate);
            filterModalDataByDate(selectedDate);
            setModalVisible(true);
          }
        }
      },
  
      plotOptions: {
        bar: {
          horizontal: false, // Keep bars vertical
          columnWidth: '50%', // Adjusts the width of each bar
          barHeight: '70%', // Adjusts the height in horizontal bars (if needed)
          barGap: '10%', // Controls the gap between bars
          borderRadius: 5,
          dataLabels: {
            enabled: true
          }
        }
      },
      // Specify different colors for each series
      colors: ['#1E90FF', '#81E1AF'], // First series is blue (#1E90FF), second series is green (#81E1AF)
      
      xaxis: {
        categories: dates,
        type: 'date'
      },
      yaxis: {
        labels: {
          formatter: (value) => Math.floor(value)
        }
      },
  
      legend: { position: 'bottom', horizontalAlign: 'center' },
      fill: { opacity: 1 },

        tooltip: {
          y: {
            formatter: (val) => {
              const roundedVal = Math.round(val);
              const hours = Math.floor(roundedVal);
              const minutes = Math.round((roundedVal)*6);
              return `${hours}h ${minutes}m`;
            }
          }
        },
        // other chart options...
    
      
    }
  };
  
};

const tableColumns = Array.isArray(columns) ? columns.map(col => ({
  title: col,
  dataIndex: col,
  key: col,
})) : [];

const handleMonthChange = (value) => setSelectedMonth(value);
const handleYearChange = (value) => setSelectedYear(value);
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




if (loading) {
  return (
  <div style={{display:"flex",justifyContent:"center"}}><Spin size="small"/></div>);
}

const { series, options } = chartData();

  return (
    <div className="card h-100">
    <div className="card-header">
      <h5>Month View</h5>
    </div>
    <div className="card-body">
      <div className="row">
      <div className="col-12 col-sm-12 col-md-3 mt-2">
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
          {uempid.map(emp => (
            <Option key={emp} value={emp}>
              {emp}
            </Option>
          ))}
          </Select>
        </div>
        <div className="col-12 col-sm-12 col-md-3 mt-2">
          <Select
          size="small"
          mode="multiple"
          className="custom-select"
          style={{ width: "200px", fontSize: "10px", padding: "2px 6px" }}
          dropdownStyle={{ width: "150px" }}
          placeholder={<span className="bold-placeholder">Emp_Names</span>}
          value={selectedEMPNAMES}
          onChange={setSelectedEMPNAMES}
          loading={loading}
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
          style={{ width: "200px", fontSize: "10px", padding: "2px 6px" }}
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
          style={{ width: "200px", fontSize: "10px", padding: "2px 6px" }}
          dropdownStyle={{ width: "150px" }}
          placeholder={<span className="bold-placeholder">Designation</span>}
          value={selectedRoles}
          onChange={setSelectedRoles}
          loading={loading}
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
          style={{ width: "200px", fontSize: "10px", padding: "2px 6px" }}
          dropdownStyle={{ width: "150px" }}
          placeholder={<span className="bold-placeholder">designationcategory</span>}
          value={selectedDesignations}
          onChange={setSelectedDesignations}
          loading={loading}
          >
            {udesignationcategory.map(desi => (
            <Option key={desi} value={desi}>
              {desi}
            </Option>
          ))}
          </Select>
        </div> 
        <div className="col-12 col-sm-12 col-md-3 mt-2">
          <Select
          size="small"
          mode="multiple"
          className="custom-select"
          style={{ width: "200px", fontSize: "10px", padding: "2px 6px" }}
          dropdownStyle={{ width: "150px" }}
          placeholder={<span className="bold-placeholder">Projects</span>}
          value={selectedProjects}
          onChange={setSelectedProjects}
          loading={loading}
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
          style={{ width: "200px", fontSize: "10px", padding: "2px 6px" }}
          dropdownStyle={{ width: "150px" }}
          placeholder={<span className="bold-placeholder">Shifts</span>}
          value={selectedShifts}
          onChange={setSelectedShifts}
          loading={loading}
          >
            {ushift.map(shi => (
            <Option key={shi} value={shi}>
              {shi}
            </Option>
          ))}
          </Select>
        </div>
        <div className="col-12 col-sm-12 col-md-3 mt-2">
          <Select
          size="small"
          mode="multiple"
          className="custom-select"
          style={{ width: "200px", fontSize: "10px", padding: "2px 6px" }}
          dropdownStyle={{ width: "150px" }}
          placeholder={<span className="bold-placeholder">Teams</span>}
          value={selectedTeams}
          onChange={setSelectedTeams}
          loading={loading}
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
          style={{ width: "200px", fontSize: "10px", padding: "2px 6px" }}
          dropdownStyle={{ width: "150px" }}
          placeholder={<span className="bold-placeholder">Months</span>}
          onChange={handleMonthChange}        
          value={selectedMonth}
        >
          {months.map(month => (
            <Option key={month} value={month}>{month}</Option>
          ))}
          
          </Select>
        </div>
        <div className="col-12 col-sm-12 col-md-3 mt-2">
          <Select
          size="small"
          mode="multiple"
          className="custom-select"
          style={{ width: "200px", fontSize: "10px", padding: "2px 6px" }}
          dropdownStyle={{ width: "150px" }}
          placeholder={<span className="bold-placeholder">Years</span>}          
          onChange={handleYearChange}        
          value={selectedYear}
        >
          {years.map(year => (
            <Option key={year} value={year}>{year}</Option>
          ))}
          </Select>
        </div>
       
        

        <div className="col-12 col-sm-12 col-md-6 mt-2 me-2">
          <button
            className="btn btn-sm btn-primary py-1 w-40"
            onClick={fetchFilteredData}
          >
            Filter
          </button>
          <button
            className="btn btn-sm btn-danger text-light py-1 ms-2 w-40"
            onClick={resetFilters}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  
    <ReactApexChart options={options} series={series} type="bar" height={350} />
    <Modal
      title={`Details for ${selectedDate}`}
      visible={modalVisible}
      onCancel={() => setModalVisible(false)}
      footer={null}
      width={1200}
    >
      <Button
        onClick={() => exportToCSV(filteredModalData, tableColumns)}
        style={{ padding: "2px 6px", marginTop: "0.5%", height: "4%" }}
        icon={<DownloadOutlined />}
        type="default"
      >
        Export CSV
      </Button>
      <Table
        dataSource={filteredModalData}
        columns={tableColumns}
        pagination={true}
        scroll={{ x: "max-content" }}
      />
    </Modal>
  </div>
  
  );
};

export default DashboardColumnChart; 