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
<< /Length 480 >>
stream
BT
/F1 18 Tf
50 720 Td
(LOOKMAN ADVANCED SURVEILLANCE SYSTEMS) Tj
/F1 13 Tf
0 -30 Td
(Product Model: SIP-VPS8032AI) Tj
/F1 10 Tf
0 -22 Td
(Category: PTZ Cameras) Tj
0 -18 Td
(Max. Resolution: 4K Ultra HD 8MP 3840x2160) Tj
0 -18 Td
(Image Sensor: 1/1.8 STARVIS Low Light CMOS) Tj
0 -18 Td
(Night Vision: Laser IR 150m Night Vision) Tj
0 -18 Td
(Audio: Two-way Audio with Built-in Mic & Speaker) Tj
0 -18 Td
(Power Supply: PoE+ 802.3at / 24V AC) Tj
0 -18 Td
(Ingress Protection: IP67 Weatherproof Aluminum Housing) Tj
0 -24 Td
(High speed 4K PTZ camera with 32x optical zoom, endless 360 rotation and AI auto-tracking.) Tj
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
0000000767 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
838
%%EOF`;

fs.writeFileSync('d:/lookman-app/frontend/public/SIP-VPS8032AI_Datasheet.pdf', pdfContent);
console.log('Sample PDF created at public/SIP-VPS8032AI_Datasheet.pdf');
