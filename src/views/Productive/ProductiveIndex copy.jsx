import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Button, Upload, message, Progress, Space, Table, Input } from 'antd';
import { UploadOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import Highlighter from 'react-highlight-words';
import { API_BASE_URL1, API_BASE_URL2, API_BASE_URL_LOCAL_HOST } from '../../config';

import ProductiveTable from './ProductiveTable'; 

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
      const response = await axios.get(`${API_BASE_URL2}//api/fetch_data1.php`);
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

  return (
    <div className="container">
 
  <ProductiveTable />
</div>

  );
};

export default UsersIndex;
