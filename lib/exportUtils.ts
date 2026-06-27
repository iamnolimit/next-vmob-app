import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Capacitor } from '@capacitor/core';

async function downloadOrShare(blob: Blob, filename: string): Promise<void> {
  if (Capacitor.isNativePlatform()) {
    try {
      const { Filesystem, Directory } = await import('@capacitor/filesystem');
      const { Share } = await import('@capacitor/share');
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
      const saved = await Filesystem.writeFile({
        path: filename,
        data: base64,
        directory: Directory.Cache,
        recursive: true,
      });
      await Share.share({ title: filename, files: [saved.uri] });
      return;
    } catch {
      // fall through to web download
    }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export interface ExportColumn {
  label: string;
  key: string;
  align?: 'left' | 'right' | 'center';
}

export interface ExportSection {
  title: string;
  rows: Array<{ label: string; value: string | number }>;
}

const today = () =>
  new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });

// ─── helpers ─────────────────────────────────────────────────────────────────

function addPdfFooter(doc: jsPDF) {
  const pageCount = (doc as unknown as { internal: { getNumberOfPages: () => number } })
    .internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(150);
    doc.text(
      `Dicetak: ${today()}   Halaman ${i} dari ${pageCount}`,
      14,
      doc.internal.pageSize.height - 8,
    );
  }
}

/** Writes:  Title (bold 14)  →  namaKlinik (gray 10)  →  subtitle (gray 9)
 *  Returns the Y position where the table should start. */
function writePdfHeader(
  doc: jsPDF,
  title: string,
  namaKlinik: string,
  subtitle?: string,
): number {
  let y = 18;

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0);
  doc.text(title, 14, y);
  y += 7;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80);
  doc.text(namaKlinik, 14, y);
  y += 6;

  if (subtitle) {
    doc.setFontSize(8);
    doc.setTextColor(120);
    doc.text(subtitle, 14, y);
    y += 5;
  }

  doc.setTextColor(0);
  return y + 2;
}

// ─── Excel ───────────────────────────────────────────────────────────────────

export async function exportToExcel(
  filename: string,
  columns: ExportColumn[],
  data: Record<string, unknown>[],
  title: string,
  namaKlinik: string,
  sheetName = 'Laporan',
) {
  const headers = columns.map((c) => c.label);
  const rows = data.map((row) =>
    columns.map((c) => {
      const v = row[c.key];
      return v === undefined || v === null ? '' : v;
    }),
  );

  // Header block: title row + namaKlinik row + blank row + column headers + data
  const aoa: unknown[][] = [
    [title],
    [namaKlinik],
    [],
    headers,
    ...rows,
  ];

  const ws = XLSX.utils.aoa_to_sheet(aoa);

  // Merge cells for title and namaKlinik across all columns
  const lastCol = columns.length - 1;
  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: lastCol } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: lastCol } },
  ];

  // Auto column width
  const colWidths = columns.map((c, i) => {
    const maxLen = Math.max(
      c.label.length,
      ...rows.map((r) => String(r[i] ?? '').length),
    );
    return { wch: Math.min(maxLen + 2, 40) };
  });
  ws['!cols'] = colWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  const arr = XLSX.write(wb, { bookType: 'xlsx', type: 'array' }) as ArrayBuffer;
  const blob = new Blob([arr], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  await downloadOrShare(blob, `${filename}.xlsx`);
}

// ─── PDF ─────────────────────────────────────────────────────────────────────

export async function exportToPdf(
  filename: string,
  title: string,
  columns: ExportColumn[],
  data: Record<string, unknown>[],
  namaKlinik: string,
  subtitle?: string,
) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const startY = writePdfHeader(doc, title, namaKlinik, subtitle);

  const head = [columns.map((c) => c.label)];
  const body = data.map((row) =>
    columns.map((c) => {
      const v = row[c.key];
      return v === undefined || v === null ? '' : String(v);
    }),
  );

  const colStyles: Record<number, { halign: 'left' | 'right' | 'center' }> = {};
  columns.forEach((c, i) => {
    if (c.align) colStyles[i] = { halign: c.align };
  });

  autoTable(doc, {
    head,
    body,
    startY,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [30, 58, 138], textColor: 255, fontStyle: 'bold', fontSize: 8 },
    alternateRowStyles: { fillColor: [245, 247, 255] },
    columnStyles: colStyles,
    margin: { left: 14, right: 14 },
  });

  addPdfFooter(doc);
  await downloadOrShare(doc.output('blob'), `${filename}.pdf`);
}

// ─── PDF for sectioned reports (Neraca, Laba Rugi) ───────────────────────────

export async function exportSectionedToPdf(
  filename: string,
  title: string,
  sections: ExportSection[],
  namaKlinik: string,
  subtitle?: string,
) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  let currentY = writePdfHeader(doc, title, namaKlinik, subtitle);

  sections.forEach((section) => {
    autoTable(doc, {
      head: [[{ content: section.title, colSpan: 2, styles: { halign: 'left', fontStyle: 'bold', fillColor: [30, 58, 138], textColor: 255 } }]],
      body: section.rows.map((r) => [r.label, String(r.value)]),
      startY: currentY,
      styles: { fontSize: 8, cellPadding: 2 },
      alternateRowStyles: { fillColor: [245, 247, 255] },
      columnStyles: { 1: { halign: 'right' } },
      margin: { left: 14, right: 14 },
      didDrawPage: () => { currentY = 20; },
    });
    currentY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 6;
  });

  addPdfFooter(doc);
  await downloadOrShare(doc.output('blob'), `${filename}.pdf`);
}

// ─── Excel for sectioned reports ─────────────────────────────────────────────

export async function exportSectionedToExcel(
  filename: string,
  title: string,
  sections: ExportSection[],
  namaKlinik: string,
) {
  const aoa: (string | number)[][] = [
    [title],
    [namaKlinik],
    [],
  ];

  sections.forEach((section) => {
    aoa.push([section.title]);
    aoa.push(['Keterangan', 'Nominal']);
    section.rows.forEach((r) => aoa.push([r.label, r.value]));
    aoa.push([]);
  });

  const ws = XLSX.utils.aoa_to_sheet(aoa);
  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 1 } },
  ];
  ws['!cols'] = [{ wch: 40 }, { wch: 20 }];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Laporan');
  const arr = XLSX.write(wb, { bookType: 'xlsx', type: 'array' }) as ArrayBuffer;
  const blob = new Blob([arr], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  await downloadOrShare(blob, `${filename}.xlsx`);
}

// ─── Custom Export for Laba Rugi ─────────────────────────────────────────────

export interface LabaRugiData {
  pemasukan: Array<{ label: string; value: string | number }>;
  pengeluaran: Array<{ label: string; value: string | number }>;
  totalPemasukan: string | number;
  hpp: Array<{ label: string; value: string | number }>;
  totalHpp: string | number;
  labaKotor: string | number;
  totalPengeluaran: string | number;
  labaBersih: string | number;
}

export async function exportLabaRugiToPdf(
  filename: string,
  namaKlinik: string,
  periode: string,
  data: LabaRugiData
) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  
  // Header
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Apotek Vmart MR', 105, 15, { align: 'center' });
  doc.text('LAPORAN LABA RUGi', 105, 22, { align: 'center' });
  doc.text(`PERIODE ${periode.toUpperCase()}`, 105, 29, { align: 'center' });
  
  doc.setLineWidth(0.5);
  doc.line(14, 32, 196, 32);
  
  let y = 38;
  
  // Pemasukan & Pengeluaran Headers
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('PEMASUKAN', 14, y);
  doc.text(String(data.totalPemasukan), 100, y, { align: 'right' });
  
  doc.text('PENGELUARAN', 110, y);
  doc.text(String(data.totalPengeluaran), 196, y, { align: 'right' });
  
  y += 6;
  doc.text('Nama Akun', 14, y);
  doc.text('Nominal', 100, y, { align: 'right' });
  doc.text('Nama Akun', 110, y);
  doc.text('Nominal', 196, y, { align: 'right' });
  
  y += 5;
  doc.setFont('helvetica', 'normal');
  
  const maxRows = Math.max(data.pemasukan.length, data.pengeluaran.length);
  for (let i = 0; i < maxRows; i++) {
    if (data.pemasukan[i]) {
      doc.text(data.pemasukan[i].label, 14, y);
      doc.text(String(data.pemasukan[i].value), 100, y, { align: 'right' });
    }
    if (data.pengeluaran[i]) {
      doc.text(data.pengeluaran[i].label, 110, y);
      doc.text(String(data.pengeluaran[i].value), 196, y, { align: 'right' });
    }
    y += 5;
  }
  
  y += 2;
  doc.setFont('helvetica', 'bold');
  doc.text('Total Pemasukan', 14, y);
  doc.text(String(data.totalPemasukan), 196, y, { align: 'right' });
  
  y += 8;
  doc.text('Harga Pokok Penjualan', 14, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  for (const item of data.hpp) {
    doc.text(item.label, 18, y);
    doc.text(String(item.value), 100, y, { align: 'right' });
    y += 5;
  }
  
  y += 2;
  doc.setFont('helvetica', 'bold');
  doc.text('Total Harga Pokok Penjualan', 14, y);
  doc.line(140, y - 3, 196, y - 3);
  doc.text(String(data.totalHpp), 196, y, { align: 'right' });
  
  y += 8;
  doc.text('Laba Kotor', 14, y);
  doc.text(String(data.labaKotor), 196, y, { align: 'right' });
  
  y += 6;
  doc.text('Total Pengeluaran', 14, y);
  doc.line(140, y - 3, 196, y - 3);
  doc.text(String(data.totalPengeluaran), 196, y, { align: 'right' });
  
  y += 8;
  doc.setFontSize(11);
  doc.text('Laba Bersih', 14, y);
  doc.text(String(data.labaBersih), 196, y, { align: 'right' });
  
  y += 4;
  doc.setLineWidth(0.5);
  doc.line(14, y, 196, y);
  
  y += 8;
  doc.setFontSize(14);
  doc.text(`Laba Rugi : ${data.labaBersih}`, 105, y, { align: 'center' });
  
  y += 6;
  doc.setLineWidth(0.2);
  doc.line(14, y, 196, y);
  
  addPdfFooter(doc);
  await downloadOrShare(doc.output('blob'), `${filename}.pdf`);
}

export async function exportLabaRugiToExcel(
  filename: string,
  namaKlinik: string,
  periode: string,
  data: LabaRugiData
) {
  const aoa: (string | number)[][] = [
    ['Apotek Vmart MR', '', '', ''],
    ['LAPORAN LABA RUGI', '', '', ''],
    [`PERIODE ${periode.toUpperCase()}`, '', '', ''],
    ['PEMASUKAN', data.totalPemasukan, 'PENGELUARAN', data.totalPengeluaran],
    ['Nama Akun', 'Nominal', 'Nama Akun', 'Nominal']
  ];

  const maxRows = Math.max(data.pemasukan.length, data.pengeluaran.length);
  for (let i = 0; i < maxRows; i++) {
    const row: (string | number)[] = [];
    if (data.pemasukan[i]) {
      row.push(data.pemasukan[i].label, data.pemasukan[i].value);
    } else {
      row.push('', '');
    }
    if (data.pengeluaran[i]) {
      row.push(data.pengeluaran[i].label, data.pengeluaran[i].value);
    } else {
      row.push('', '');
    }
    aoa.push(row);
  }

  aoa.push(['', '', '', '']);
  aoa.push(['Total Pemasukan', '', '', data.totalPemasukan]);
  aoa.push(['', '', '', '']);
  aoa.push(['Harga Pokok Penjualan', '', '', '']);
  
  for (const item of data.hpp) {
    aoa.push([item.label, item.value, '', '']);
  }
  
  aoa.push(['Total Harga Pokok Penjualan', '', '', data.totalHpp]);
  aoa.push(['', '', '', '']);
  aoa.push(['Laba Kotor', '', '', data.labaKotor]);
  aoa.push(['Total Pengeluaran', '', '', data.totalPengeluaran]);
  aoa.push(['Laba Bersih', '', '', data.labaBersih]);

  const ws = XLSX.utils.aoa_to_sheet(aoa);
  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 3 } },
    { s: { r: 2, c: 0 }, e: { r: 2, c: 3 } },
  ];
  
  // Center align headers
  for (let r = 0; r <= 2; r++) {
    const cellRef = XLSX.utils.encode_cell({ r, c: 0 });
    if (!ws[cellRef].s) ws[cellRef].s = {};
    ws[cellRef].s.alignment = { horizontal: 'center', vertical: 'center' };
    ws[cellRef].s.font = { bold: true };
  }

  ws['!cols'] = [{ wch: 40 }, { wch: 20 }, { wch: 40 }, { wch: 20 }];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Laba Rugi');
  const arr = XLSX.write(wb, { bookType: 'xlsx', type: 'array' }) as ArrayBuffer;
  const blob = new Blob([arr], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  await downloadOrShare(blob, `${filename}.xlsx`);
}
