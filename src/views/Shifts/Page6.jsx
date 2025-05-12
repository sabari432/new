// Page6.js
import React, { useState } from 'react';
import ShiftsEdit from './ShiftsEdit';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, Upload, message, Progress, Space, Table, Card, Input, Row, Col, Modal, Form,Tooltip,Popconfirm, Input as AntInput } from 'antd';
import { UploadOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';


const Page6 = ({ data, onSave }) => {
  const [editingRow, setEditingRow] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  console.log('Record to be ed:', editingRow);


  const navigate = useNavigate();

  const handleEditClick = (employee) => {
    // Navigate to the edit page with the EMPID
    navigate(`/shifts-edit/${employee.EMPID}`);
  
  };


 
 

  const columns = [
    { title: 'EMPID', dataIndex: 'EMPID', key: 'EMPID' },
    { title: 'EMPNAME', dataIndex: 'EMPNAME', key: 'EMPNAME' },
    { title: 'SYS_USER_NAME', dataIndex: 'SYS_USER_NAME', key: 'SYS_USER_NAME' },
    { title: 'SHIFTTYPE', dataIndex: 'SHIFTTYPE', key: 'SHIFTTYPE' },
    { title: 'SHIFT_START_TIME', dataIndex: 'SHIFT_START_TIME', key: 'SHIFT_START_TIME' },
    { title: 'SHIFT_END_TIME', dataIndex: 'SHIFT_END_TIME', key: 'SHIFT_END_TIME' },
    { title: 'SHIFTSTART_DT', dataIndex: 'SHIFTSTART_DT', key: 'SHIFTSTART_DT' },
    { title: 'SHIFTEND_DT', dataIndex: 'SHIFTEND_DT', key: 'SHIFTEND_DT' },
    { title: 'TIME_ZONE', dataIndex: 'TIME_ZONE', key: 'TIME_ZONE' },
    { title: 'WEEKOFF', dataIndex: 'WEEKOFF', key: 'WEEKOFF' },
    { title: 'COMMENTS', dataIndex: 'COMMENTS', key: 'COMMENTS' },
    {
      title: 'Actions',
    key: 'actions',
    render: (_, record) => (
      <Space size="middle">
        <Tooltip title="Edit">
         

<button
                            type="button"
                            className="btn btn-warning text-light"
                            onClick={() => handleEditClick(record)} // Pass employee object to the edit handler
                          >
                            <i className="fa fa-pen"></i>
                          </button>
        </Tooltip>
      
      </Space>
    ),
  }];
      
  

  return (
    <div>
      <h2></h2>
      <Table
        dataSource={data}
        columns={columns}
        scroll={{ x: 'max-content' }}
      />

      </div>
  );
};

export default Page6;
