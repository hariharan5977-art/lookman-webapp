const fs = require('fs');

const pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 360 >>
stream
BT
/F1 20 Tf
50 720 Td
(LOOKMAN SECURITY - CCTV DATASHEET) Tj
/F1 14 Tf
0 -35 Td
(Model: SIP-VB402ADA) Tj
/F1 10 Tf
0 -25 Td
(Category: HD IP Camera) Tj
0 -20 Td
(Resolution: 4MP Super HD) Tj
0 -20 Td
(Image Sensor: 1/2.8 Progressive Scan CMOS) Tj
0 -20 Td
(Night Vision: Smart IR 40m Night Vision) Tj
0 -20 Td
(Audio: Built-in Mic & Two-way Audio) Tj
0 -20 Td
(Power: PoE / 12V DC) Tj
0 -20 Td
(Casing: IP67 Weatherproof Metal Housing) Tj
0 -25 Td
(High performance 4MP AI bullet camera with smart motion analytics.) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000234 00000 n 
0000000647 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
718
%%EOF`;

fs.writeFileSync('d:/lookman-app/frontend/public/Lookman_SIP-VB402ADA_Datasheet.pdf', pdfContent);
console.log('Sample PDF created at public/Lookman_SIP-VB402ADA_Datasheet.pdf');
