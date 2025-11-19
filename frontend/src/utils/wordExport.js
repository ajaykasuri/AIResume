// utils/wordExport.js
import { saveAs } from "file-saver";
import htmlDocx from "html-docx-js/dist/html-docx";

const exportToWord = (elementRef, fileName = "resume.docx") => {
  if (!elementRef?.current) {
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
        /* Include all your template styles here */
        body { font-family: 'Georgia', serif; margin: 0; padding: 0; }
        
        /* Executive Template */
        .exec-sidebar { background: #295040 !important; color: white !important; }
        .exec-name { color: white !important; }
        .exec-role { color: #efeeef !important; }
        
        /* Elegant Template */
        .elegant-sidebar { background: #ffffff !important; color: #232323 !important; }
        .elegant-main { background: #217f5e !important; color: #ffffff !important; }
        
        /* Modern Template */
        .modern-sidebar { background: #ffffff !important; color: #161616 !important; }
        .modern-name { color: #161616 !important; }
        
        /* Classic Template */
        .classic-template { background: #ffffff !important; color: #222222 !important; }
        
        /* Layout fixes for Word */
        .exec-root, .elegant-root, .modern-root { display: table !important; width: 100% !important; }
        .exec-sidebar, .elegant-sidebar, .modern-sidebar { display: table-cell !important; width: 35% !important; }
        .exec-main, .elegant-main, .modern-main { display: table-cell !important; width: 65% !important; }
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
      ${elementRef.current.innerHTML}
    </body>
    </html>
  `;

  try {
    const blob = htmlDocx.asBlob(htmlContent, {
      orientation: 'portrait',
      margins: { top: 720, right: 720, bottom: 720, left: 720 }
    });
    saveAs(blob, fileName);
  } catch (error) {
    console.error('Word export error:', error);
    throw new Error('Failed to generate Word document');
  }
};

export default exportToWord;