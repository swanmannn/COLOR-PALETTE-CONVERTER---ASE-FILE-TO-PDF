let currentPalette = []; 
let currentFileName = ""; 

// --- 1. GLOBAL WINDOW OVERRIDES (Stops Firefox Popups on Page Drops) ---
window.addEventListener('dragenter', (e) => e.preventDefault());
window.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
});
window.addEventListener('drop', (e) => e.preventDefault());

// --- 2. DROP ZONE TARGET HANDLERS ---
const dropZone = document.getElementById('drop-zone');
dropZone.addEventListener('dragenter', (e) => e.preventDefault());
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files; 
    if (files && files.length > 0) {
        const file = files[0]; 
        currentFileName = file.name; // Stores file name
        
        const reader = new FileReader();
        reader.onload = function(event) {
            parseASE(event.target.result);
        };
        reader.readAsArrayBuffer(file);
    }
});

// --- 3. ASE BINARY FILE DECODER ---
function parseASE(buffer) {
    const view = new DataView(buffer);
    const paletteContainer = document.getElementById('palette');
    const exportBtn = document.getElementById('export-btn');
    const fileTitle = document.getElementById('file-title');
    const textListContainer = document.getElementById('text-list-container');
    const hexTextList = document.getElementById('hex-text-list');
    
    paletteContainer.innerHTML = ''; 
    hexTextList.innerText = '';
    currentPalette = []; 
    exportBtn.style.display = 'none';
    fileTitle.style.display = 'none';
    textListContainer.style.display = 'none';

    let offset = 0;

    const signature = String.fromCharCode(view.getUint8(offset++), view.getUint8(offset++), view.getUint8(offset++), view.getUint8(offset++));
    if (signature !== "ASEF") {
        alert("Not a valid .ase file!");
        return;
    }

    offset = 8; 
    const totalBlocks = view.getUint32(offset, false);
    offset += 4;

    for (let i = 0; i < totalBlocks; i++) {
        if (offset >= view.byteLength) break;

        const blockType = view.getUint16(offset, false); offset += 2;
        const blockLength = view.getUint32(offset, false); offset += 4;

        if (blockType === 0x0001) {
            const nameLength = view.getUint16(offset, false); offset += 2;
            offset += (nameLength * 2); 

            const mode = String.fromCharCode(view.getUint8(offset++), view.getUint8(offset++), view.getUint8(offset++), view.getUint8(offset++));

            if (mode === "RGB ") {
                const rFloat = view.getFloat32(offset, false); offset += 4;
                const gFloat = view.getFloat32(offset, false); offset += 4;
                const bFloat = view.getFloat32(offset, false); offset += 4;

                const r = Math.round(rFloat * 255);
                const g = Math.round(gFloat * 255);
                const b = Math.round(bFloat * 255);

                const hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
                offset += 2; 

                currentPalette.push({ hex, r, g, b }); 
                createColorCard(hex);
            } else {
                offset += (blockLength - (2 + (nameLength * 2) + 4));
            }
        } else {
            offset += blockLength;
        }
    }

    if (currentPalette.length > 0) {
        fileTitle.innerText = currentFileName;
        fileTitle.style.display = 'block';
        exportBtn.style.display = 'block';

        const pureHexStrings = currentPalette.map(item => item.hex);
        hexTextList.innerText = pureHexStrings.join('\n');
        textListContainer.style.display = 'block';
    }
}

// --- 4. SWATCH GRID ENGINE ---
function createColorCard(hex) {
    const container = document.getElementById('palette');
    const card = document.createElement('div');
    card.className = 'color-card';
    
    const block = document.createElement('div');
    block.className = 'color-block';
    block.style.backgroundColor = hex;
    
    const text = document.createElement('p');
    text.innerText = hex;
    
    card.appendChild(block);
    card.appendChild(text);
    container.appendChild(card);
}

// --- 5. PDF EXPORT ENGINE ---
document.getElementById('export-btn').addEventListener('click', () => {
    if (currentPalette.length === 0) return;

    let doc;
    try {
        if (window.jspdf && window.jspdf.jsPDF) {
            doc = new window.jspdf.jsPDF();
        } else if (typeof jsPDF !== 'undefined') {
            doc = new jsPDF();
        } else {
            alert("The PDF engine failed to load locally.");
            return;
        }
    } catch (e) {
        alert("PDF Initialization Error: " + e.message);
        return;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text(currentFileName || "Color Palette Export", 20, 25);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Generated from .ASE Swatch File", 20, 32);

    let x = 20; 
    let y = 45; 
    const cardWidth = 40;
    const cardHeight = 30;
    const gap = 15;

    currentPalette.forEach((color, index) => {
        doc.setFillColor(color.r, color.g, color.b);
        doc.rect(x, y, cardWidth, cardHeight, "F");

        doc.setFont("courier", "bold");
        doc.setFontSize(12);
        doc.setTextColor(0); 
        doc.text(color.hex, x + 4, y + cardHeight + 8);

        x += cardWidth + gap;

        if ((index + 1) % 3 === 0) {
            x = 20;
            y += cardHeight + 25;
        }
        
        if (y > 250 && index < currentPalette.length - 1) {
            doc.addPage();
            y = 25; 
            x = 20;
        }
    });

    doc.save((currentFileName ? currentFileName.replace('.ase', '') : 'color-palette') + ".pdf");
});

// --- 6. QUICK COPY ENGINE ---
document.getElementById('copy-btn').addEventListener('click', () => {
    const hexTextList = document.getElementById('hex-text-list');
    const copyBtn = document.getElementById('copy-btn');
    
    if (!hexTextList.innerText) return;

    navigator.clipboard.writeText(hexTextList.innerText).then(() => {
        const originalText = copyBtn.innerText;
        copyBtn.innerText = "Copied!";
        copyBtn.style.backgroundColor = "#155724"; 
        
        setTimeout(() => {
            copyBtn.innerText = originalText;
            copyBtn.style.backgroundColor = "#28a745";
        }, 2000);
    }).catch(err => {
        alert("Could not copy text: ", err);
    });
});
