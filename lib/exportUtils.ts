import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

export function exportToExcel(
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
  XLSX.writeFile(wb, `${filename}.xlsx`);
}

// ─── PDF ─────────────────────────────────────────────────────────────────────

export function exportToPdf(
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
  doc.save(`${filename}.pdf`);
}

// ─── PDF for sectioned reports (Neraca, Laba Rugi) ───────────────────────────

export function exportSectionedToPdf(
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
  doc.save(`${filename}.pdf`);
}

// ─── Excel for sectioned reports ─────────────────────────────────────────────

export function exportSectionedToExcel(
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
  XLSX.writeFile(wb, `${filename}.xlsx`);
}
