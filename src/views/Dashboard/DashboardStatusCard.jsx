import React, { useEffect, useState } from 'react';
import VirtualList from 'rc-virtual-list';
import { Avatar, List, message, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import DashboardStatusTable from './DashboardStatusTable';
import '../Css/DashboardStatusCard.css';
import { API_BASE_URL1, API_BASE_URL2, API_BASE_URL_LOCAL_HOST } from '../../config';

const ContainerHeight = 1970; // Height of  the virtual list container
const fakeDataUrl = `${API_BASE_URL2}/api/DUMP.php`;// Your API URL

const Active = ({ EMPID, EMPNAME, CURRENT_STATUS, LAST_SEEN }) => {
  const statusColor = {
    ACTIVE: '#6ECB5A',
    INACTIVE: '#f5222d',
    OFFLINE: '#8c8c8c',
  }[CURRENT_STATUS.toUpperCase()] || '#d9d9d9';

  return (
    <List.Item key={EMPID} className="list-item-custom">  {/* Apply CSS to remove dots */}
      <div style={{ display: 'flex' }}>
        <div style={{ padding: '5px' }}>
          <Avatar style={{ backgroundColor: statusColor }}>{EMPNAME ? EMPNAME.charAt(0) : '?'}</Avatar>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', fontSize: '10px', marginTop: '3%' }}>
          <div><b>{EMPNAME}</b></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px' }}>
            <div>{CURRENT_STATUS}</div>
            {(CURRENT_STATUS.toUpperCase() === 'INACTIVE' || CURRENT_STATUS.toUpperCase() === 'OFFLINE') && (
              <div>Last seen: {LAST_SEEN}</div>
            )}
          </div>
        </div>
      </div>
    </List.Item>
  );
};

const DashboardStatusCard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeCount, setActiveCount] = useState(0);
  const [inactiveCount, setInactiveCount] = useState(0);
  const [offlineCount, setOfflineCount] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedTeams, setSelectedTeams] = useState([]);

  const fetchData = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch(`${fakeDataUrl}?userid=${userid}`);
      const result = await response.json();
      
      const newActiveCount = result.filter(item => item.CURRENT_STATUS.toUpperCase() === 'ACTIVE').length;
      const newInactiveCount = result.filter(item => item.CURRENT_STATUS.toUpperCase() === 'INACTIVE').length;
      const newOfflineCount = result.filter(item => item.CURRENT_STATUS.toUpperCase() === 'OFFLINE').length;

      setActiveCount(newActiveCount);
      setInactiveCount(newInactiveCount);
      setOfflineCount(newOfflineCount);

      setData(result);
      message.success(`${result.length} more items loaded!`);
    } catch (error) {
      console.error('Error fetching the data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onScroll = (e) => {
    const { scrollTop, scrollHeight } = e.currentTarget;
    if (Math.abs(scrollHeight - scrollTop - ContainerHeight) <= 1) {
      fetchData();
    }
  };

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter);
  };

  const handleReload = () => {
    setSelectedFilter('All');
  };

  const filteredData = data.filter(item => {
    if (selectedFilter === 'All') return true;
    return item.CURRENT_STATUS.toUpperCase() === selectedFilter.toUpperCase();
  });

  const userid = localStorage.getItem('EMPID') || '';
  const DashboardStatusCard = ({ data }) => {
    return (
      <div>
        {data.map((item, index) => (
          <div key={`${item.EMPNAME}-${index}`}> {/* Unique keys */}
            {/* <ApexChart1 data={[item]} /> */}
          </div>
        ))}
      </div>
    );
  };

  return (

    <div className="card">
    <div className="card-body">
      <div className="row">
      <div className="col-sm-12">
        <DashboardStatusTable data={data} />

</div>
        <div className="col-sm-12" style={{ height:"2000px" }}>

        <div style={{ display: "flex", margin: "1%" }}>
        <Button
        size="small"
        style={{
          fontSize: "10px",
          padding: "2px 6px",
          color: "white",
          background: "#4096ff",
          width:"50px"
        }}
        onClick={handleReload}
      >
        All
      </Button>
      <Button
        size="small"
        style={{
          fontSize: "10px",
          padding: "2px 6px",
          color: "white",
          background: "#6ECB5A",
              width:"80px"
        }}
        onClick={() => handleFilterClick("ACTIVE")}
      >
        Online: {activeCount}
      </Button>
      <Button
        size="small"
        style={{
          fontSize: "10px",
          padding: "2px 6px",
          color: "white",
          background: "#f5222d",
              width:"80px"
        }}
        onClick={() => handleFilterClick("INACTIVE")}
      >
        Inactive: {inactiveCount}
      </Button>
      <Button
        size="small"
        style={{
          fontSize: "10px",
          padding: "2px 6px",
          color: "white",
          background: "#8c8c8c",
              width:"80px"
        }}
        onClick={() => handleFilterClick("OFFLINE")}
      >
        Offline: {offlineCount}
      </Button>
    </div>
  
    <div style={{ flex: 1, overflow: "auto",marginTop:"5px" }}>
      <VirtualList
        data={filteredData}
        height={ContainerHeight}
        itemHeight={10}
        itemKey="EMPID"
        onScroll={onScroll}
      >
        {(item) => (
          <Active
            {...item}
            activeCount={activeCount}
            inactiveCount={inactiveCount}
          />
        )}
      </VirtualList>
    </div>

        </div>
        </div>
        </div>
        </div>


  
  );
};

export default DashboardStatusCard;
