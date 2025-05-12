import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactApexChart from 'react-apexcharts';
import { Table, Select, Space, Button, Spin, Alert, Modal } from 'antd';
import { SearchOutlined, ResetOutlined, DownloadOutlined } from '@ant-design/icons';
import moment from 'moment';
import '../Css/Page3.css';

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
  const [uniqueProjects, setUniqueProjects] = useState([]);
  const [uniqueShifts, setUniqueShifts] = useState([]);
  const [uniqueTeams, setUniqueTeams] = useState([]);
  const [ids, setIds] = useState([]); // Added
  const [names, setNames] = useState([]); // Added
  
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [selectedShifts, setSelectedShifts] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [selectedEMPID, setSelectedEMPID] = useState([]);
  const [selectedEMPNAMES, setSelectedEMPNAMES] = useState([]);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [filteredModalData, setFilteredModalData] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const fetchUniqueFilters = async () => {
      try {
        const response = await axios.get('http://3.110.23.123/monthdata.php');
        const { uniqueDepartments, uniqueRoles, uniqueProjects, uniqueShifts, uniqueTeams, uniquename, uniqueids } = response.data;
        setUniqueDepartments(uniqueDepartments);
        setUniqueRoles(uniqueRoles);
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
  }, [selectedMonth, selectedYear, selectedDepartments, selectedRoles, selectedProjects, selectedShifts, selectedTeams, selectedEMPID, selectedEMPNAMES]);

  const fetchFilteredData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://3.110.23.123/monthdata.php', {
        params: {
          month: selectedMonth,
          year: selectedYear,
          department: selectedDepartments,
          role: selectedRoles,
          project: selectedProjects,
          shift: selectedShifts,
          team: selectedTeams,
          ids: selectedEMPID,
          names: selectedEMPNAMES
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
    setSelectedProjects([]);
    setSelectedShifts([]);
    setSelectedTeams([]);
    setSelectedEMPID([]);
    setSelectedEMPNAMES([]);
    // No need to call fetchFilteredData here, it will be triggered by useEffect
  };

  const handleMonthChange = (value) => setSelectedMonth(value);
  const handleYearChange = (value) => setSelectedYear(value);

  const chartData = () => {
    if (!Array.isArray(data) || data.length === 0) {
      return { series: [], options: {} };
    }

    const sortedData = data.sort((a, b) => new Date(a.date) - new Date(b.date));
    const dates = sortedData.map(item => moment(item.date).format('MMM DD'));
    const totalIdleHours = sortedData.map(item => convertTimeToHoursAndMinutes(item.total_idle_hours));
    const totalProductiveHours = sortedData.map(item => convertTimeToHoursAndMinutes(item.total_productive_hours));

    return {
      series: [
        { name: 'Total Idle Hours', data: totalIdleHours },
        { name: 'Total Productive Hours', data: totalProductiveHours }
      ],
      options: {
        chart: {
          type: 'bar',
          height: 350,
          stacked: true,
          toolbar: { show: true },
          zoom: { enabled: false },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '50%',
            barHeight: '70%',
            barGap: '10%',
            borderRadius: 5,
            dataLabels: {
              enabled: true
            }
          }
        },
        colors: ['#1E90FF', '#81E1AF'],
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
              const minutes = Math.round((roundedVal - hours) * 60);
              return `${hours}h ${minutes}m`;
            }
          }
        }
      }
    };
  };

  const exportToCSV = (data, columns) => {
    if (!data.length) return;

    const headers = columns.map(col => col.title).join(',');
    const rows = data.map(row =>
      columns.map(col => row[col.dataIndex] || '').join(',')
    );

    const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows.join('\n')}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'data.csv');
    document.body.appendChild(link);

    link.click();
  };

  const tableColumns = columns.map(col => ({
    title: col,
    dataIndex: col,
    key: col,
  }));

  if (loading) return <Spin size="small" />;
  if (error) return <Alert message="Error" description={error.message} type="error" />;

  const { series, options } = chartData();






  return (
    <div className="card h-100">
    <div className="card-header">
      <h5>Month View</h5>
    </div>
    <div className="card-body">
      <div className="row">
        <div className="col-sm-3">
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
        <div className="col-sm-3">
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
            {names.map((names) => (
              <Option key={names} value={names}>
                {names}
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
          placeholder={<span className="bold-placeholder">Departments</span>}
          value={selectedDepartments}
          onChange={setSelectedDepartments}
          loading={loading}
          >
            {uniqueDepartments.map((dept) => (
              <Option key={dept} value={dept}>
                {dept}
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
          placeholder={<span className="bold-placeholder">Roles</span>}
          value={selectedRoles}
          onChange={setSelectedRoles}
          loading={loading}
          >
            {uniqueRoles.map((role) => (
              <Option key={role} value={role}>
                {role}
              </Option>
            ))}
          </Select>
        </div>
        <div className="col-sm-3 mt-2">
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
            {uniqueProjects.map((project) => (
              <Option key={project} value={project}>
                {project}
              </Option>
            ))}
          </Select>
        </div>
        <div className="col-sm-3 mt-2">
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
            {uniqueShifts.map((shift) => (
              <Option key={shift} value={shift}>
                {shift}
              </Option>
            ))}
          </Select>
        </div>
        <div className="col-sm-3 mt-2">
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
            {uniqueTeams.map((team) => (
              <Option key={team} value={team}>
                {team}
              </Option>
            ))}
          </Select>
        </div>
        <div className="col-sm-2 mt-2">
        <Select
         size="small"   
         className="custom-select"   
      
         style={{ width: "200px", fontSize: "10px", padding: "2px 6px" }}
         dropdownStyle={{ width: "150px" }}      
        
          onChange={handleMonthChange}        
          value={selectedMonth}
        >
         {months.map((month) => (
              <Option key={month} value={month}>
                {month}
              </Option>
            ))}
        </Select>
        </div>
       
        <div className="col-sm-3 mt-2">
        <Select
           size="small"  
           className="custom-select"  
      
           style={{ width: "200px", fontSize: "10px", padding: "2px 6px" }}
           dropdownStyle={{ width: "150px" }}   
          onChange={handleYearChange}        
          value={selectedYear}
        >
          {years.map(year => (
            <Option key={year} value={year}>{year}</Option>
          ))}
        </Select>
        </div>
        
        <div className="col-sm-3 mt-2 ms-2">
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