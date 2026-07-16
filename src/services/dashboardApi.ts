import axiosClient from './axiosClient';

export interface DashboardSummaryDto {
  from?: string;
  to?: string;
  totalUsers: number;
  totalCustomers: number;
  totalManagers: number;
  totalStaff: number;
  totalProducts: number;
  activeProducts: number;
  totalCategories: number;
  totalInventories: number;
  lowStockProducts: number;
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  pendingRevenue: number;
  averageOrderValue: number;
}

export interface RevenueByPeriodDto {
  period: string;
  label: string;
  orders: number;
  revenue: number;
  discountAmount: number;
  averageOrderValue: number;
}

export interface RevenueStatisticsDto {
  fromDate: string;
  toDate: string;
  groupBy: string;
  totalOrders: number;
  paidOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  revenueByPeriod: RevenueByPeriodDto[];
}

export interface RecentOrderDto {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  status: string;
  totalPrice: number;
  createdAt: string;
}

export interface StockAlertDto {
  productId: number;
  productName: string;
  sku?: string;
  categoryName?: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  location?: string;
}

export interface TopProductDto {
  productId: number;
  productName: string;
  sku?: string;
  categoryName?: string;
  currentPrice: number;
  totalSold: number;
  revenue: number;
  availableQuantity: number;
}

export interface AdminDashboardDto {
  summary: DashboardSummaryDto;
  revenueStatistics: RevenueStatisticsDto;
  recentOrders: RecentOrderDto[];
  stockAlerts: StockAlertDto[];
  topProducts: TopProductDto[];
  revenueTrend: RevenueByPeriodDto[];
}

export const dashboardApi = {
  getAdminDashboard: async (fromDate?: string, toDate?: string): Promise<AdminDashboardDto> => {
    const params = new URLSearchParams();
    if (fromDate) params.append('fromDate', fromDate);
    if (toDate) params.append('toDate', toDate);
    
    // axiosClient interceptor typically unwraps the response data
    return axiosClient.get(`/Dashboard/admin?${params.toString()}`);
  }
};
