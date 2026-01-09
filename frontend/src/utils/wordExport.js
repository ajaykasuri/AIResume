// utils/wordExport.js
import { saveAs } from "file-saver";
import htmlDocx from "html-docx-js/dist/html-docx";

const exportToWord = (element, fileName = "resume.docx") => {
  if (!element) {
    console.error("No element found for Word export");
    return;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word">
    <head>
      <meta charset="UTF-8">
      <title>${fileName}</title>
      <style>
        body { font-family: 'Georgia', serif; margin: 0; padding: 0; }
        /* Include your template-specific styles here */
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
    saveAs(blob, fileName);
  } catch (error) {
    console.error("Word export error:", error);
    throw new Error("Failed to generate Word document");
  }
};

export default exportToWord;
