import React, { useState, useEffect } from 'react';
import type { Promotion } from '../../customer/checkout/promotionData';
import Button from '../../../components/Button';

interface PromotionFormProps {
  editingRecord: Promotion | null;
  onSave: (values: { name: string; code: string; value: string; validFrom: string; validTo: string }) => void;
  onCancel: () => void;
}

export default function PromotionForm({ editingRecord, onSave, onCancel }: PromotionFormProps) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [value, setValue] = useState('');
  const [validFrom, setValidFrom] = useState('');
  const [validTo, setValidTo] = useState('');

  useEffect(() => {
    if (editingRecord) {
      setName(editingRecord.name);
      setCode(editingRecord.code);
      setValue(editingRecord.value);
      setValidFrom(editingRecord.validFrom);
      setValidTo(editingRecord.validTo);
    } else {
      setName('');
      setCode('');
      setValue('');
      setValidFrom('');
      setValidTo('');
    }
  }, [editingRecord]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, code, value, validFrom, validTo });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-widest text-[#888888] mb-2">
          Promotion Name *
        </label>
        <input 
          required 
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Mega Sale 12.12"
          className="w-full border border-[#EAEAEA] px-4 py-3 text-[14px] focus:outline-none focus:border-black transition-colors"
        />
      </div>

      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-widest text-[#888888] mb-2">
          Discount Code *
        </label>
        <input 
          required 
          type="text" 
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase())}
          placeholder="e.g. MEGASALE12"
          className="w-full border border-[#EAEAEA] px-4 py-3 text-[14px] uppercase focus:outline-none focus:border-black transition-colors"
        />
      </div>

      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-widest text-[#888888] mb-2">
          Discount Value *
        </label>
        <input 
          required 
          type="text" 
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="e.g. 15% or $50"
          className="w-full border border-[#EAEAEA] px-4 py-3 text-[14px] focus:outline-none focus:border-black transition-colors"
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-[11px] font-semibold uppercase tracking-widest text-[#888888] mb-2">
            Valid From *
          </label>
          <input 
            required 
            type="date" 
            value={validFrom}
            onChange={(e) => setValidFrom(e.target.value)}
            className="w-full border border-[#EAEAEA] px-4 py-3 text-[14px] focus:outline-none focus:border-black transition-colors"
          />
        </div>
        <div className="flex-1">
          <label className="block text-[11px] font-semibold uppercase tracking-widest text-[#888888] mb-2">
            Valid To *
          </label>
          <input 
            required 
            type="date" 
            value={validTo}
            onChange={(e) => setValidTo(e.target.value)}
            className="w-full border border-[#EAEAEA] px-4 py-3 text-[14px] focus:outline-none focus:border-black transition-colors"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-4 pt-6 border-t border-outline-variant/30">
        <Button 
          type="button" 
          variant="outline"
          onClick={onCancel}
        >
          Huỷ
        </Button>
        <Button 
          type="submit" 
          variant="primary"
        >
          Lưu Khuyến Mãi
        </Button>
      </div>
    </form>
  );
}