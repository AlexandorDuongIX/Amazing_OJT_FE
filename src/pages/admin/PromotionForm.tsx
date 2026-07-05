import React, { useEffect } from 'react';
import { Form, Input, DatePicker } from 'antd';
import type { FormInstance } from 'antd';
import dayjs from 'dayjs';
import type { Promotion } from '../data/promotionStorage';

const { RangePicker } = DatePicker;

interface PromotionFormProps {
  form: FormInstance;
  editingRecord: Promotion | null;
}

const PromotionForm: React.FC<PromotionFormProps> = ({ form, editingRecord }) => {
  useEffect(() => {
    if (editingRecord) {
      form.setFieldsValue({
        name: editingRecord.name,
        code: editingRecord.code,
        value: editingRecord.value,
        rangeDate: [dayjs(editingRecord.validFrom), dayjs(editingRecord.validTo)],
      });
    } else {
      form.resetFields();
    }
  }, [editingRecord, form]);

  return (
    <Form form={form} layout="vertical" style={{ marginTop: '16px' }}>
      <Form.Item
        name="name"
        label="Promotion Name"
        rules={[{ required: true, message: 'Please input the promotion name!' }]}
      >
        <Input placeholder="e.g. Mega Sale 12.12" />
      </Form.Item>

      <Form.Item
        name="code"
        label="Discount Code"
        rules={[
          { required: true, message: 'Please input the voucher code!' },
          { pattern: /^[A-Za-z0-9]+$/, message: 'Code must be alphanumeric without spaces!' }
        ]}
      >
        <Input placeholder="e.g. MEGASALE12" style={{ textTransform: 'uppercase' }} />
      </Form.Item>

      <Form.Item
        name="value"
        label="Discount Value"
        rules={[{ required: true, message: 'Please input the discount value!' }]}
      >
        <Input placeholder="e.g. 15% or $50" />
      </Form.Item>

      <Form.Item
        name="rangeDate"
        label="Valid Duration"
        rules={[{ required: true, message: 'Please select duration!' }]}
      >
        <RangePicker style={{ width: '100%' }} />
      </Form.Item>
    </Form>
  );
};

export default PromotionForm;