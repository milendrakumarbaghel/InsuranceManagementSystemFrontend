// src/utils/exportUtils.js
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export const exportToPDF = (data, columns, title = 'Report') => {
  try {
    const doc = new jsPDF();
    const exportableCols = columns.filter(col => col.key !== 'actions' && col.header);
    const headers = exportableCols.map(col => col.header);
    
    const body = data.map(row => 
      exportableCols.map(col => {
        let value = col.render ? col.render(row) : (row[col.key] ?? '—');
        if (typeof value === 'object' && value !== null && value.props?.children) {
          value = value.props.children;
        }
        return String(value);
      })
    );

    doc.text(title, 14, 15);
    autoTable(doc, {
      head: [headers],
      body: body,
      startY: 25,
    });
    
    console.log("Attempting to save PDF with title:", `${title.toLowerCase().replace(/\s+/g, '_')}.pdf`);
    doc.save(`${title.toLowerCase().replace(/\s+/g, '_')}.pdf`);
  } catch (error) {
    console.error("PDF Export failed:", error);
  }
};