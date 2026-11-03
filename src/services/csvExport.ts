import { DailyRecord, SKU, Retailer, Order, VisitRequest } from '../types';
import { getAvgDailySales14d, calculateDaysOfCover, calculateSkuForecast } from './analytics';

export interface CsvExportResult {
  success: boolean;
  fileName?: string;
  rowCount: number;
  message?: string;
}

function triggerDownload(csvContent: string, fileName: string) {
  // Prepend UTF-8 Byte-Order Mark (\uFEFF) so Hindi & Marathi display properly in Excel
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeCsv(val: any): string {
  if (val === null || val === undefined) return '';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Retailer CSV Downloads
 */
export function exportRetailerSalesCsv(
  retailer: Retailer,
  skus: SKU[],
  records: DailyRecord[],
  fromDate: string,
  toDate: string
): CsvExportResult {
  const filtered = records.filter(
    (r) => r.retailerId === retailer.id && r.date >= fromDate && r.date <= toDate
  );

  if (filtered.length === 0) {
    return { success: false, rowCount: 0, message: 'No records found for the chosen date range.' };
  }

  const headers = [
    'date',
    'retailer_id',
    'retailer_name',
    'sku_id',
    'product_name',
    'units_sold',
    'unit_price',
    'sales_value',
    'currency',
    'source',
  ];

  const rows = filtered.map((r) => {
    const sku = skus.find((s) => s.id === r.skuId);
    const unitPrice = sku ? sku.retailPrice || sku.mrp : 50;
    const salesVal = r.unitsSold * unitPrice;
    return [
      escapeCsv(r.date),
      escapeCsv(r.retailerId),
      escapeCsv(retailer.name),
      escapeCsv(r.skuId),
      escapeCsv(sku ? sku.name : r.skuId),
      r.unitsSold,
      unitPrice,
      salesVal,
      'INR',
      escapeCsv(r.source),
    ].join(',');
  });

  const csv = [headers.join(','), ...rows].join('\n');
  const fileName = `retailer_sales_${fromDate}_${toDate}.csv`;
  triggerDownload(csv, fileName);

  return { success: true, fileName, rowCount: filtered.length };
}

export function exportRetailerStockCsv(
  retailer: Retailer,
  skus: SKU[],
  records: DailyRecord[]
): CsvExportResult {
  const today = '2026-11-02';
  const headers = [
    'date',
    'retailer_id',
    'retailer_name',
    'sku_id',
    'product_name',
    'closing_stock',
    'avg_daily_sales',
    'days_of_cover',
  ];

  const rows = skus.map((sku) => {
    const latest = records
      .filter((r) => r.retailerId === retailer.id && r.skuId === sku.id)
      .sort((a, b) => b.date.localeCompare(a.date))[0];
    const avg = getAvgDailySales14d(retailer.id, sku.id, records);
    const stock = latest ? latest.closingStock : 0;
    const cover = calculateDaysOfCover(stock, avg);

    return [
      today,
      escapeCsv(retailer.id),
      escapeCsv(retailer.name),
      escapeCsv(sku.id),
      escapeCsv(sku.name),
      stock,
      avg,
      cover,
    ].join(',');
  });

  const csv = [headers.join(','), ...rows].join('\n');
  const fileName = `retailer_stock_${today}.csv`;
  triggerDownload(csv, fileName);

  return { success: true, fileName, rowCount: rows.length };
}

export function exportRetailerOrdersCsv(
  retailer: Retailer,
  orders: Order[],
  fromDate: string,
  toDate: string
): CsvExportResult {
  const filtered = orders.filter(
    (o) =>
      o.retailerId === retailer.id &&
      o.createdAt.slice(0, 10) >= fromDate &&
      o.createdAt.slice(0, 10) <= toDate
  );

  if (filtered.length === 0) {
    return { success: false, rowCount: 0, message: 'No orders found for the chosen date range.' };
  }

  const headers = [
    'order_id',
    'order_number',
    'created_date',
    'retailer_id',
    'retailer_name',
    'total_cases',
    'total_amount',
    'currency',
    'slot',
    'status',
    'placed_by',
  ];

  const rows = filtered.map((o) => [
    escapeCsv(o.id),
    escapeCsv(o.orderNumber),
    escapeCsv(o.createdAt.slice(0, 10)),
    escapeCsv(o.retailerId),
    escapeCsv(o.retailerName),
    o.totalCases,
    o.totalAmount,
    'INR',
    escapeCsv(o.slot),
    escapeCsv(o.status),
    escapeCsv(o.placedBy),
  ].join(','));

  const csv = [headers.join(','), ...rows].join('\n');
  const fileName = `retailer_orders_${fromDate}_${toDate}.csv`;
  triggerDownload(csv, fileName);

  return { success: true, fileName, rowCount: rows.length };
}

/**
 * Distributor CSV Downloads
 */
export function exportDistributorSalesZoneCsv(
  retailers: Retailer[],
  skus: SKU[],
  records: DailyRecord[],
  fromDate: string,
  toDate: string
): CsvExportResult {
  const filtered = records.filter((r) => r.date >= fromDate && r.date <= toDate);
  if (filtered.length === 0) {
    return { success: false, rowCount: 0, message: 'No zone records found for this period.' };
  }

  const headers = [
    'date',
    'retailer_id',
    'retailer_name',
    'area',
    'sku_id',
    'product_name',
    'units_sold',
    'unit_price',
    'sales_value',
    'currency',
    'source',
  ];

  const rows = filtered.map((r) => {
    const ret = retailers.find((x) => x.id === r.retailerId);
    const sku = skus.find((s) => s.id === r.skuId);
    const price = sku ? sku.retailerPrice : 50;
    return [
      escapeCsv(r.date),
      escapeCsv(r.retailerId),
      escapeCsv(ret ? ret.name : r.retailerId),
      escapeCsv(ret ? ret.area : ''),
      escapeCsv(r.skuId),
      escapeCsv(sku ? sku.name : r.skuId),
      r.unitsSold,
      price,
      r.unitsSold * price,
      'INR',
      escapeCsv(r.source),
    ].join(',');
  });

  const csv = [headers.join(','), ...rows].join('\n');
  const fileName = `distributor_sales_${fromDate}_${toDate}.csv`;
  triggerDownload(csv, fileName);

  return { success: true, fileName, rowCount: rows.length };
}

export function exportDistributorStockZoneCsv(
  retailers: Retailer[],
  skus: SKU[],
  records: DailyRecord[]
): CsvExportResult {
  const today = '2026-11-02';
  const headers = [
    'date',
    'retailer_id',
    'retailer_name',
    'area',
    'sku_id',
    'product_name',
    'closing_stock',
    'avg_daily_sales',
    'days_of_cover',
  ];

  const rows: string[] = [];
  retailers.forEach((ret) => {
    skus.forEach((sku) => {
      const latest = records
        .filter((r) => r.retailerId === ret.id && r.skuId === sku.id)
        .sort((a, b) => b.date.localeCompare(a.date))[0];
      const avg = getAvgDailySales14d(ret.id, sku.id, records);
      const stock = latest ? latest.closingStock : 0;
      const cover = calculateDaysOfCover(stock, avg);

      rows.push(
        [
          today,
          escapeCsv(ret.id),
          escapeCsv(ret.name),
          escapeCsv(ret.area),
          escapeCsv(sku.id),
          escapeCsv(sku.name),
          stock,
          avg,
          cover,
        ].join(',')
      );
    });
  });

  const csv = [headers.join(','), ...rows].join('\n');
  const fileName = `distributor_stock_${today}.csv`;
  triggerDownload(csv, fileName);

  return { success: true, fileName, rowCount: rows.length };
}

export function exportDistributorOrdersCsv(
  orders: Order[],
  fromDate: string,
  toDate: string
): CsvExportResult {
  const filtered = orders.filter(
    (o) => o.createdAt.slice(0, 10) >= fromDate && o.createdAt.slice(0, 10) <= toDate
  );

  if (filtered.length === 0) {
    return { success: false, rowCount: 0, message: 'No orders found for the chosen date range.' };
  }

  const headers = [
    'order_id',
    'order_number',
    'created_date',
    'retailer_id',
    'retailer_name',
    'total_cases',
    'total_amount',
    'currency',
    'slot',
    'status',
    'placed_by',
  ];

  const rows = filtered.map((o) => [
    escapeCsv(o.id),
    escapeCsv(o.orderNumber),
    escapeCsv(o.createdAt.slice(0, 10)),
    escapeCsv(o.retailerId),
    escapeCsv(o.retailerName),
    o.totalCases,
    o.totalAmount,
    'INR',
    escapeCsv(o.slot),
    escapeCsv(o.status),
    escapeCsv(o.placedBy),
  ].join(','));

  const csv = [headers.join(','), ...rows].join('\n');
  const fileName = `distributor_orders_${fromDate}_${toDate}.csv`;
  triggerDownload(csv, fileName);

  return { success: true, fileName, rowCount: rows.length };
}

export function exportDistributorRefillRecsCsv(
  retailers: Retailer[],
  skus: SKU[],
  records: DailyRecord[]
): CsvExportResult {
  const today = '2026-11-02';
  const headers = [
    'date',
    'retailer_id',
    'retailer_name',
    'area',
    'sku_id',
    'product_name',
    'closing_stock',
    'days_of_cover',
    'recommended_cases',
    'recommended_units',
    'urgency_status',
  ];

  const rows: string[] = [];
  retailers.forEach((ret) => {
    skus.forEach((sku) => {
      const forecast = calculateSkuForecast(ret.id, sku, records, 7);
      if (forecast.status !== 'HEALTHY' || forecast.recommendedOrderCases > 0) {
        rows.push(
          [
            today,
            escapeCsv(ret.id),
            escapeCsv(ret.name),
            escapeCsv(ret.area),
            escapeCsv(sku.id),
            escapeCsv(sku.name),
            forecast.closingStock,
            forecast.daysOfCover,
            forecast.recommendedOrderCases,
            forecast.recommendedOrderUnits,
            escapeCsv(forecast.status),
          ].join(',')
        );
      }
    });
  });

  const csv = [headers.join(','), ...rows].join('\n');
  const fileName = `distributor_refill_recommendations_${today}.csv`;
  triggerDownload(csv, fileName);

  return { success: true, fileName, rowCount: rows.length };
}

export function exportDistributorVisitsCsv(
  requests: VisitRequest[],
  fromDate: string,
  toDate: string
): CsvExportResult {
  const filtered = requests.filter(
    (r) => r.requestedDate >= fromDate && r.requestedDate <= toDate
  );

  const headers = [
    'request_id',
    'requested_date',
    'retailer_id',
    'retailer_name',
    'area',
    'time_slot',
    'reason',
    'status',
  ];

  const rows = filtered.map((r) => [
    escapeCsv(r.id),
    escapeCsv(r.requestedDate),
    escapeCsv(r.retailerId),
    escapeCsv(r.retailerName),
    escapeCsv(r.area),
    escapeCsv(r.requestedTimeSlot),
    escapeCsv(r.reason),
    escapeCsv(r.status),
  ].join(','));

  const csv = [headers.join(','), ...rows].join('\n');
  const fileName = `distributor_visits_log_${fromDate}_${toDate}.csv`;
  triggerDownload(csv, fileName);

  return { success: true, fileName, rowCount: rows.length };
}
