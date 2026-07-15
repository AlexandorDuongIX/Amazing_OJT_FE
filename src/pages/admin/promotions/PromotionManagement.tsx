import React, { useState, useMemo } from 'react';
import dayjs from 'dayjs';
import { mockPromotions } from '../../customer/checkout/promotionData';
import type { Promotion } from '../../customer/checkout/promotionData';
import PromotionForm from './PromotionForm';
import Modal from '../../../components/Modal';
import Pagination from '../../../components/Pagination';
import ConfirmDialog from '../../../components/ConfirmDialog';
import Button from '../../../components/Button';

function PromotionStatusBadge({ status }: { status: Promotion['status'] }) {
  let styles = '';
  if (status === 'Active') styles = 'bg-secondary-fixed text-on-secondary-fixed';
  else if (status === 'Expired') styles = 'bg-error-container text-on-error-container';
  else if (status === 'Pending') styles = 'bg-tertiary-container text-on-tertiary-container';

  return (
    <span className={`inline-flex items-center px-3 py-1 text-[11px] font-semibold uppercase tracking-widest ${styles}`}>
      {status}
    </span>
  );
}

const PromotionManagement: React.FC = () => {
  const [dataSource, setDataSource] = useState<Promotion[]>(mockPromotions);
  const [searchText, setSearchText] = useState<string>('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingRecord, setEditingRecord] = useState<Promotion | null>(null);

  // Delete confirm states
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Pagination simple state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const handleOpenCreateModal = () => {
    setEditingRecord(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record: Promotion) => {
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  const confirmDelete = (key: string) => {
    setDeletingId(key);
    setIsConfirmOpen(true);
  };

  const handleDelete = () => {
    if (deletingId) {
      setDataSource(dataSource.filter((item) => item.key !== deletingId));
      setDeletingId(null);
    }
    setIsConfirmOpen(false);
  };

  const handleSave = (values: { name: string; code: string; value: string; validFrom: string; validTo: string }) => {
    const now = dayjs();
    let status: 'Active' | 'Expired' | 'Pending' = 'Active';
    if (now.isAfter(dayjs(values.validTo))) status = 'Expired';
    if (now.isBefore(dayjs(values.validFrom))) status = 'Pending';

    const updatedData: Omit<Promotion, 'key'> = {
      name: values.name,
      code: values.code,
      value: values.value,
      validFrom: values.validFrom,
      validTo: values.validTo,
      status,
    };

    if (editingRecord) {
      setDataSource(dataSource.map(item => item.key === editingRecord.key ? { ...item, ...updatedData } : item));
    } else {
      setDataSource([{ key: Date.now().toString(), ...updatedData }, ...dataSource]);
    }
    setIsModalOpen(false);
  };

  const filteredData = useMemo(() => {
    return dataSource.filter(item => 
      item.name.toLowerCase().includes(searchText.toLowerCase()) || 
      item.code.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [dataSource, searchText]);

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const pagedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between mb-8">
        <div>
          <h1 className="font-serif text-4xl font-medium leading-tight text-black whitespace-nowrap">Quản lý Khuyến mãi</h1>
          <p className="mt-2 text-[11px] uppercase tracking-[0.15em] text-[#444748]">
            Trang chủ &nbsp;/&nbsp; <strong className="text-black">PROMOTIONS</strong>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search by name/code..."
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setCurrentPage(1);
              }}
              className="w-64 border border-outline-variant bg-surface-container-low pl-10 pr-4 py-3 font-body text-body-md text-on-surface focus:border-primary focus:outline-none transition-colors"
            />
          </div>
          <Button variant="gold" onClick={handleOpenCreateModal}>
            <span className="material-symbols-outlined text-[18px] mr-2">add</span>
            Tạo Voucher
          </Button>
        </div>
      </header>

      {/* Table */}
      <div className="overflow-x-auto border border-outline-variant/30 bg-surface-container-lowest">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-outline-variant/30 bg-surface-container-low">
              <th className="px-6 py-4 font-label text-caption uppercase tracking-widest text-on-surface-variant whitespace-nowrap">Promotion Name</th>
              <th className="px-6 py-4 font-label text-caption uppercase tracking-widest text-on-surface-variant whitespace-nowrap">Code</th>
              <th className="px-6 py-4 font-label text-caption uppercase tracking-widest text-on-surface-variant whitespace-nowrap">Value</th>
              <th className="px-6 py-4 font-label text-caption uppercase tracking-widest text-on-surface-variant whitespace-nowrap">Valid From</th>
              <th className="px-6 py-4 font-label text-caption uppercase tracking-widest text-on-surface-variant whitespace-nowrap">Valid To</th>
              <th className="px-6 py-4 font-label text-caption uppercase tracking-widest text-on-surface-variant whitespace-nowrap">Status</th>
              <th className="px-6 py-4 font-label text-caption uppercase tracking-widest text-on-surface-variant text-right whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/30">
            {pagedData.length > 0 ? (
              pagedData.map(item => (
                <tr key={item.key} className="hover:bg-surface-container transition-colors group">
                  <td className="px-6 py-4 text-body-md text-on-surface whitespace-nowrap font-medium">{item.name}</td>
                  <td className="px-6 py-4 text-body-md whitespace-nowrap">
                    <strong className="text-primary bg-surface-container px-2 py-1 uppercase tracking-wider">{item.code}</strong>
                  </td>
                  <td className="px-6 py-4 text-body-md text-on-surface-variant whitespace-nowrap">{item.value}</td>
                  <td className="px-6 py-4 text-body-md text-on-surface-variant whitespace-nowrap">{item.validFrom}</td>
                  <td className="px-6 py-4 text-body-md text-on-surface-variant whitespace-nowrap">{item.validTo}</td>
                  <td className="px-6 py-4 whitespace-nowrap"><PromotionStatusBadge status={item.status} /></td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button 
                      onClick={() => handleEdit(item)}
                      className="p-2 text-on-surface-variant hover:text-primary transition-colors opacity-60 group-hover:opacity-100"
                      title="Edit"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button 
                      onClick={() => confirmDelete(item.key)}
                      className="p-2 text-on-surface-variant hover:text-error transition-colors ml-2 opacity-60 group-hover:opacity-100"
                      title="Delete"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-on-surface-variant font-body">
                  Không tìm thấy dữ liệu.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-outline-variant/30 bg-surface-container-lowest">
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className="bg-surface-container-lowest p-8 w-full">
          <h2 className="text-headline-md font-bold text-on-surface mb-6">
            {editingRecord ? 'Cập nhật Khuyến mãi' : 'Tạo Khuyến mãi mới'}
          </h2>
          <PromotionForm 
            editingRecord={editingRecord}
            onSave={handleSave}
            onCancel={() => setIsModalOpen(false)}
          />
        </div>
      </Modal>

      <ConfirmDialog 
        isOpen={isConfirmOpen}
        onConfirm={handleDelete}
        onCancel={() => setIsConfirmOpen(false)}
        productName="Khuyến mãi này sẽ bị xoá vĩnh viễn"
      />
    </div>
  );
};

export default PromotionManagement;