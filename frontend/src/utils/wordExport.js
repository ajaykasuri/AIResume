import { saveAs } from "file-saver";
import htmlDocx from "html-docx-js/dist/html-docx";

const exportToWord = (elementRef, fileName = "resume.docx") => {
  // Access the current property of the ref
  const element = elementRef?.current;

  if (!element) {
    console.error("No element found for Word export");
    throw new Error("No element to export");
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word">
    <head>
      <meta charset="UTF-8">
      <title>${fileName}</title>
      <style>
        body { 
          font-family: 'Georgia', serif; 
          margin: 0; 
          padding: 0; 
          font-size: 12pt;
          line-height: 1.5;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        td {
          vertical-align: top;
          padding: 20px;
        }
        /* Add more styles to match your resume template */
      </style>
      <!--[if gte mso 9]>
      <xml>
        <w:WordDocument>
          <w:View>Print</w:View>
          <w:Zoom>100</w:Zoom>
          <w:DoNotOptimizeForBrowser/>
        </w:WordDocument>
      </xml>
      <![endif]-->
    </head>
    <body>
      ${element.innerHTML}
    </body>
    </html>
  `;

  try {
    const blob = htmlDocx.asBlob(htmlContent, {
      orientation: "portrait",
      margins: { top: 720, right: 720, bottom: 720, left: 720 },
    });

    console.log("Blob generated, saving file...");
    saveAs(blob, fileName);
    console.log("Word document saved successfully");
  } catch (error) {
    console.error("Word export error:", error);
    throw new Error("Failed to generate Word document: " + error.message);
  }
};

export default exportToWord;
