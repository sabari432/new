import React, { useState, useMemo, useEffect } from 'react';
import { Table, Modal, Select, Button } from 'antd';
import axios from 'axios';
import { Spin, Alert } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import '../Css/StatusTable.css';
import { API_BASE_URL1, API_BASE_URL2, API_BASE_URL_LOCAL_HOST } from '../../config';

const { Option } = Select;

const DashboardStatusTable = ({ data = [] }) => {
  const [data12, setData12] = useState([]); // Data fetched from the API
  const [modalData, setModalData] = useState([]); // Unified state for modal data
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedShift, setSelectedShift] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [visible, setVisible] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const EMPID = localStorage.getItem('EMPID') || '';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL2}/api/alldata.php`, {
          params: { EMPID },
        });
        const fetchedData = response.data.data || [];
        setData12(fetchedData);
        setColumns(response.data.columns || []);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data');
        setLoading(false);
      }
    };
    fetchData();
  }, [EMPID]);

  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.filter(
      (row) =>
        (selectedDepartment ? row['DEPARTMENT'] === selectedDepartment : true) &&
        (selectedTeam ? row['TEAM'] === selectedTeam : true)
    );
  }, [data, selectedDepartment, selectedTeam]);

  const uniqueShifts = useMemo(
    () => [...new Set(filteredData.map((row) => row['SHIFT'] || ''))],
    [filteredData]
  );

  const statusCountByShift = useMemo(
    () =>
      uniqueShifts.reduce((acc, shift) => {
        acc[shift] = {
          ACTIVE: filteredData.filter(
            (row) => row['SHIFT'] === shift && row['CURRENT_STATUS'] === 'ACTIVE'
          ).length,
          INACTIVE: filteredData.filter(
            (row) => row['SHIFT'] === shift && row['CURRENT_STATUS'] === 'INACTIVE'
          ).length,
          OFFLINE: filteredData.filter(
            (row) => row['SHIFT'] === shift && row['CURRENT_STATUS'] === 'OFFLINE'
          ).length,
        };
        return acc;
      }, {}),
    [uniqueShifts, filteredData]
  );

  const totalCounts = useMemo(() => {
    return uniqueShifts.reduce(
      (totals, shift) => {
        totals.ACTIVE += statusCountByShift[shift]?.ACTIVE || 0;
        totals.INACTIVE += statusCountByShift[shift]?.INACTIVE || 0;
        totals.OFFLINE += statusCountByShift[shift]?.OFFLINE || 0;
        return totals;
      },
      { ACTIVE: 0, INACTIVE: 0, OFFLINE: 0 }
    );
  }, [statusCountByShift, uniqueShifts]);

  const statusColumns = [
    { title: 'Shift', dataIndex: 'SHIFT', key: 'SHIFT', width: '5%' },
    {
      title: 'Online',
      dataIndex: 'ACTIVE',
      key: 'ACTIVE',
      width: '5%',
      render: (text, record) => (
        <a
          onClick={() =>
            record.SHIFT === 'Total'
              ? handleTotalClick('ACTIVE')
              : handleClick(record.SHIFT, 'ACTIVE')
          }
        >
          {text}
        </a>
      ),
    },
    {
      title: 'Inactive',
      dataIndex: 'INACTIVE',
      key: 'INACTIVE',
      width: '5%',
      render: (text, record) => (
        <a
          onClick={() =>
            record.SHIFT === 'Total'
              ? handleTotalClick('INACTIVE')
              : handleClick(record.SHIFT, 'INACTIVE')
          }
        >
          {text}
        </a>
      ),
    },
    {
      title: 'Offline',
      dataIndex: 'OFFLINE',
      key: 'OFFLINE',
      width: '5%',
      render: (text, record) => (
        <a
          onClick={() =>
            record.SHIFT === 'Total'
              ? handleTotalClick('OFFLINE')
              : handleClick(record.SHIFT, 'OFFLINE')
          }
        >
          {text}
        </a>
      ),
    },
  ];

  const statusData = useMemo(
    () => [
      {
        key: 'total',
        SHIFT: 'Total',
        ACTIVE: totalCounts.ACTIVE,
        INACTIVE: totalCounts.INACTIVE,
        OFFLINE: totalCounts.OFFLINE,
      },
      ...uniqueShifts.map((shift) => ({
        key: shift,
        SHIFT: shift || 'N/A',
        ACTIVE: statusCountByShift[shift]?.ACTIVE || 0,
        INACTIVE: statusCountByShift[shift]?.INACTIVE || 0,
        OFFLINE: statusCountByShift[shift]?.OFFLINE || 0,
      })),
    ],
    [uniqueShifts, statusCountByShift, totalCounts]
  );

  const handleClick = (shift, status) => {
    console.log('Shift:', shift, 'Status:', status);
    setSelectedShift(shift);
    setSelectedStatus(status);
    const filteredEmployees = filteredData.filter(
      (row) => row['SHIFT'] === shift && row['CURRENT_STATUS'] === status
    );
    console.log('Filtered Employees:', filteredEmployees);
    setModalData(filteredEmployees);
    setVisible(true);
  };

  const handleTotalClick = (status) => {
    console.log('Total Status:', status);
    const totalFilteredData = filteredData.filter(
      (row) => row['CURRENT_STATUS'] === status
    );
    console.log('Total Filtered Data:', totalFilteredData);
    setModalData(totalFilteredData);
    setVisible(true);
    setSelectedStatus(status);
    setSelectedShift(null);
  };

  const exportToCSV = (data, columns) => {
    if (!data.length) return;
    const headers = columns.map((col) => col.title).join(',');
    const rows = data.map((row) => columns.map((col) => row[col.dataIndex] || '').join(','));
    const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows.join('\n')}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCancel = () => {
    setVisible(false);
    setSelectedShift(null);
    setSelectedStatus(null);
    setModalData([]);
  };

  const handleRefresh = () => {
    setSelectedDepartment(null);
    setSelectedTeam(null);
  };

  const uniqueDepartments = useMemo(
    () => [...new Set(filteredData.map((row) => row['DEPARTMENT'] || ''))],
    [filteredData]
  );

  const uniqueTeams = useMemo(
    () => [...new Set(filteredData.map((row) => row['TEAM'] || ''))],
    [filteredData]
  );

  const getDynamicColumns = () => {
    if (!filteredData || filteredData.length === 0) return [];
    const sample = filteredData[0]; // Use filteredData instead of data12
    const allKeys = Object.keys(sample);
    return allKeys.map((key) => ({
      title: key,
      dataIndex: key,
      key: key,
    }));
  };

  const detailedColumns = getDynamicColumns();

  if (loading) return <Spin size="small" />;
  if (error) return <Alert message="Error" description={error} type="error" />;

  return (
    <div>
      <div style={{ display: 'flex', alignContent: 'start', marginLeft: '-20px', marginTop: '-10px' }}>
        <Select
          size="small"
          className="custom-select"
          style={{ marginLeft: '15px', width: '100px', height: '30px', fontSize: '10px', padding: '2px 6px' }}
          dropdownStyle={{ width: '100px' }}
          placeholder={<span className="bold-placeholder">Departments</span>}
          onChange={(value) => setSelectedDepartment(value)}
          value={selectedDepartment}
        >
          {uniqueDepartments.map((dept) => (
            <Option key={dept} value={dept}>{dept}</Option>
          ))}
        </Select>

        <Select
          size="small"
          className="custom-select"
          style={{ width: '100px', fontSize: '10px', height: '30px', padding: '2px 6px' }}
          dropdownStyle={{ width: '100px' }}
          placeholder={<span className="bold-placeholder">Teams</span>}
          onChange={(value) => setSelectedTeam(value)}
          value={selectedTeam}
        >
          {uniqueTeams.map((team) => (
            <Option key={team} value={team}>{team}</Option>
          ))}
        </Select>

        <Button
          size="small"
          style={{
            width: '75px',
            fontSize: '14px',
            padding: '2px 6px',
            color: 'white',
            background: '#4096ff',
            height: '30px',
          }}
          onClick={handleRefresh}
        >
          Refresh
        </Button>
      </div>

      <Table
        columns={statusColumns}
        dataSource={statusData}
        pagination={false}
        bordered
        className="custom-table"
        scroll={null}
      />

      <Modal
        title={`Employees with status ${selectedStatus}${selectedShift ? ` in Shift ${selectedShift}` : ''}`}
        open={visible}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        <Button
          onClick={() => exportToCSV(modalData, detailedColumns)}
          style={{ padding: '2px 6px', marginTop: '0.5%', height: '4%' }}
          icon={<DownloadOutlined />}
          type="default"
        >
          Export CSV
        </Button>
        {modalData.length === 0 ? (
          <Alert message="No data available" type="info" />
        ) : (
          <Table
            columns={detailedColumns}
            dataSource={modalData}
            pagination={false}
            bordered
            className="detailed-table"
          />
        )}
      </Modal>
    </div>
  );
};

export default DashboardStatusTable;