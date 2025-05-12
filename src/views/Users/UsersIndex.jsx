import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Button, Upload, message, Progress, Space, Table, Input } from 'antd';
import { UploadOutlined,DownloadOutlined, SearchOutlined, EditOutlined, DeleteOutlined, DownOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import Highlighter from 'react-highlight-words';
import UsersAdd from './UsersAdd'; // Import the EmployeeDBAdd component
import UsersFilterAndTable from './UsersFilterAndTable'; 
import { API_BASE_URL1, API_BASE_URL2, API_BASE_URL_LOCAL_HOST } from '../../config';
const EMPNAME = localStorage.getItem('EMPNAME');

const UsersIndex = () => {
  const [data, setData] = useState([]);
  const [fileName, setFileName] = useState('');
  const [processing, setProcessing] = useState(false);
  const [percent, setPercent] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [showModal, setShowModal] = useState(false); // State to control EmployeeDBAdd modal visibility
  const [formData, setFormData] = useState({}); // State for form data
  const [errors, setErrors] = useState({}); // State for form errors
  const [summary, setSummary] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    inactiveEmployees: 0,
  });

  // Function to handle input change in EmployeeDBAdd modal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Function to reset the form data in EmployeeDBAdd modal
  const resetForm = () => {
    setFormData({});
    setErrors({});
  };

  const fetchTableData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL1}/api/fetch_data1.php`);
      const { columns: fetchedColumns, data: fetchedData } = response.data;

      // Set table data
      setData(fetchedData);

      const total = fetchedData.length;
      const active = fetchedData.filter((item) => item.ACTIVE_YN === 'Y').length;
      setSummary({
        totalEmployees: total,
        activeEmployees: active,
        inactiveEmployees: total - active,
      });
    } catch (error) {
      message.error('Failed to fetch table data.');
    }
  };

  useEffect(() => {
    fetchTableData();
  }, []);
  const [messageApi, contextHolder] = message.useMessage();

  const handleDownload = () => {
    messageApi.info('Delete sample data before uploding!');
    // Create a link element
    const link = document.createElement('a');
    // Set the href to the file location
    link.href = './DATA.xlsx'; // Ensure this path is correct
    link.download = 'PMS_USERS_DATA.xlsx'; // This is the name of the file when downloade
    document.body.appendChild(link);    // Append to the body
    link.click(); // Trigger the download
    document.body.removeChild(link);// Clean up and remove the link
  };
  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
        const workbook = XLSX.read(e.target.result, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const formattedData = jsonData.map(row => {
            const allotBreak = row['ALLOTED_BREAK'];

            const formattedAllotBreak = typeof allotBreak === 'number'
                ? formatExcelTime(allotBreak)
                : allotBreak || '';

            return {
                EMPID: row['EMPID'] || '',
                EMPNAME: row['EMPNAME'] || '',
                EMAIL: row['EMAIL'] || '',
                Sys_user_name: row['sys_user_name'] || '',
                ROLE: row['ROLE'] || '',
                REPORTING_1: row['REPORTING_1'] || '',
                REPORTING_2: row['REPORTING_2'] || '',
                DEPARTMENT: row['DEPARTMENT'] || '',
                DESIGNATION_CATEGORY: row['DESIGNATION_CATEGORY'] || '',
                REQUIRED_PRODUCTIVE_HRS: formatExcelTime(row['REQUIRED_PRODUCTIVE_HRS']),
                TEAM: row['TEAM'] || '',
                PROJECT: row['PROJECT'] || '',
                SHIFT: row['SHIFT'] || '',
                ALLOTED_BREAK: formattedAllotBreak,
                ACTIVE_YN: row['ACTIVE_YN'] || '',
                HOLIDAY_COUNTRY: row['HOLIDAY_COUNTRY'] || '',
                REGION: row['REGION'] || '',  
                UPDATED_BY: row['UPDATED_BY'] || localStorage.getItem('EMPNAME') || '', 
                ACCESS_ROLE: row['ACCESS_ROLE'] || '', // Added ACCESS_ROLE field
                PASSWORD: row['PASSWORD'] || '12345' // Added PASSWORD field
            };
        });

        console.log(formattedData);

        setData(formattedData);
        setFileName(file.name);
    };
    reader.readAsBinaryString(file);
    return false;
};

// Helper function to format Excel time values
const formatExcelTime = (excelTime) => {
  const totalMinutes = Math.floor(excelTime * 1440); // 1440 minutes in a day
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
};
const handleSubmit = async () => {
  if (!Array.isArray(data) || data.length === 0) {
    message.error('Invalid data format!');
    return;
  }

  setProcessing(true);
  setPercent(0);
  setDisabled(true);

  try {
    const interval = setInterval(() => {
      setPercent(prev => {
        const newPercent = prev >= 100 ? 100 : prev + 20;
        // percent.current = newPercent;
        if (newPercent >= 100) {
          clearInterval(interval);
        }
        return newPercent;
      });
    }, 1000);

    await axios.post(`${API_BASE_URL1}/api/upload_data1.php`, data, {
      method:'POST',
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    });

    message.success('Data uploaded successfully!');
    setFileName('');
    setData([]);
  } catch (error) {
    message.error(`Error uploading data: ${error.response?.data?.message || error.message}`);
  } finally {
    setProcessing(false);
    setPercent(100);
    setDisabled(false);
  }
};
const uempid = (localStorage.getItem('empid') || '').split(',').map(emp => emp.trim());
const ACTIVE_YN = (localStorage.getItem('ACTIVE_YN') || '').split(',').map(emp1 => emp1.trim());

  return (
    <div className="container">
  <div className="row mt-2">
    <div className="col-md-6">
      <div className="card h-100">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Upload and Submit</h5>
        {contextHolder}
        <Button type="default" onClick={handleDownload}icon={<DownloadOutlined />}>
          Download sample file
        </Button>
      </div>
        <div className="card-body" style={{ display: 'flex', justifyContent:"space-between" }}>
        <Upload
                customRequest={({ file, onSuccess }) => {
                  handleFileUpload(file);
                  onSuccess();
                }}
                showUploadList={false}
                beforeUpload={(file) => {
                  handleFileUpload(file);
                  return false;
                }}
                maxCount={1}
                listType="picture"
              >
                <Button icon={<UploadOutlined />}>Upload Excel (Max: 1)</Button>
              </Upload>
          {fileName && <div>File: {fileName}</div>}
          <div>
            <Button
              onClick={handleSubmit}
              type="primary"
              
              disabled={disabled}
            >
              Submit
            </Button>
            {processing && (
                <div style={{ marginTop: 16 }}>
                  <Progress percent={percent} />
                  {percent < 100 && <div>Processing... {percent}%</div>}
                </div>
              )}

          </div>
        </div>
      </div>
    </div>
    <div className="col-md-6">
      <div className="card h-100">
        <div className="card-header">
          <h5>Summary</h5>
        </div>
        <div className="card-body" style={{ display: 'flex', justifyContent:"space-between" }}>
          <div><p>Total: {uempid.length}</p></div>
          <div><p>Active: {uempid.length-ACTIVE_YN.length}</p></div>
          <div><p>Inactive: {ACTIVE_YN.length}</p></div>
          <div>
          <button
            className="btn btn-sm btn-primary"
            onClick={() => setShowModal(true)}
          >
            Add Employee
          </button></div>
        </div>
      </div>
    </div>
    

    {/* EmployeeDBAdd Modal */}
    <UsersAdd
      showModal={showModal}
      setShowModal={setShowModal}
      formData={formData}
      handleInputChange={handleInputChange}
      resetForm={resetForm}
      errors={errors}
    />
  </div>
  <UsersFilterAndTable />
</div>

  );
};

export default UsersIndex;
