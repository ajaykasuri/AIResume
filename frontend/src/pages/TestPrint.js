import React, { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function PrintableContent() {
  return (
    <div
      style={{
        width: "210mm", // A4 width
        minHeight: "297mm", // A4 height
        padding: "20mm",
        backgroundColor: "#fff",
        color: "#000",
        fontFamily: "Arial",
      }}
    >
      <h1>Ajay Kasuri</h1>
      <h3>Software Engineer</h3>
      <p>Email: ajay@example.com</p>
      <p>Phone: +91 98765 43210</p>
      <hr />
      <p>This is your resume content — it will export to a perfect PDF.</p>
    </div>
  );
}

export default function TestPrint() {
  const pdfRef = useRef();

  const handleDownloadPDF = async () => {
    const element = pdfRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const data = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("resume.pdf");
  };

  return (
    <div style={{ padding: 30 }}>
      <button
        onClick={handleDownloadPDF}
        style={{
          backgroundColor: "#007bff",
          color: "#fff",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        📄 Download PDF
      </button>

      <div
        ref={pdfRef}
        style={{
          marginTop: 30,
          background: "#fff",
          padding: 20,
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        }}
      >
        <PrintableContent />
      </div>
    </div>
  );
}
