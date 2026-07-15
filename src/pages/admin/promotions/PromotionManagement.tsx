import React, { useState } from 'react';
import { Table, Button, Input, Tag, Space, Modal, Form, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { mockPromotions } from '../../../store/promotionStorage';
import type { Promotion } from '../../../store/promotionStorage';
import PromotionForm from './PromotionForm';

const PromotionManagement: React.FC = () => {
  const [dataSource, setDataSource] = useState<Promotion[]>(mockPromotions);
  const [searchText, setSearchText] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingRecord, setEditingRecord] = useState<Promotion | null>(null);
  const [form] = Form.useForm();

  const columns: ColumnsType<Promotion> = [
    {
      title: 'Promotion Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      render: (code: string) => <strong style={{ color: '#1890ff' }}>{code}</strong>,
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
    },
    {
      title: 'Valid From',
      dataIndex: 'validFrom',
      key: 'validFrom',
    },
    {
      title: 'Valid To',
      dataIndex: 'validTo',
      key: 'validTo',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: 'Active' | 'Expired' | 'Pending') => {
        let color = 'green';
        if (status === 'Expired') color = 'red';
        if (status === 'Pending') color = 'orange';
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record: Promotion) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EditOutlined style={{ color: '#1890ff' }} />} 
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Are you sure to delete this promotion?"
            onConfirm={() => handleDelete(record.key)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleOpenCreateModal = () => {
    setEditingRecord(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record: Promotion) => {
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  const handleDelete = (key: string) => {
    setDataSource(dataSource.filter((item) => item.key !== key));
    message.success('Deleted promotion successfully');
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      const validFrom = values.rangeDate[0].format('YYYY-MM-DD');
      const validTo = values.rangeDate[1].format('YYYY-MM-DD');
      
      const now = dayjs();
      let status: 'Active' | 'Expired' | 'Pending' = 'Active';
      if (now.isAfter(values.rangeDate[1])) status = 'Expired';
      if (now.isBefore(values.rangeDate[0])) status = 'Pending';

      const updatedData: Omit<Promotion, 'key'> = {
        name: values.name,
        code: values.code.toUpperCase(),
        value: values.value,
        validFrom,
        validTo,
        status,
      };

      if (editingRecord) {
        setDataSource(dataSource.map(item => item.key === editingRecord.key ? { ...item, ...updatedData } : item));
        message.success('Updated promotion successfully');
      } else {
        setDataSource([...dataSource, { key: Date.now().toString(), ...updatedData }]);
        message.success('Created promotion successfully');
      }

      setIsModalOpen(false);
    }).catch(info => {
      console.log('Validate Failed:', info);
    });
  };

  const filteredData = dataSource.filter(item => 
    item.name.toLowerCase().includes(searchText.toLowerCase()) || 
    item.code.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div style={{ padding: '24px', background: '#fff', borderRadius: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'center' }}>
        <Input
          placeholder="Search by name/code..."
          prefix={<SearchOutlined />}
          style={{ width: 300 }}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenCreateModal}>
          Create Promotion
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={filteredData} 
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={editingRecord ? "Edit Promotion" : "Create New Promotion"}
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
        okText="Save"
        destroyOnClose
      >
        <PromotionForm form={form} editingRecord={editingRecord} />
      </Modal>
    </div>
  );
};

export default PromotionManagement;