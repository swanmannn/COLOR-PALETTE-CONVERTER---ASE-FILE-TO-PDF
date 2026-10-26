# COLOR-PALETTE-CONVERTER---ASE-FILE-TO-PDF
FOR GRAPHIC DESIGNERS/ARTISTS - EXPORT COLOR PALETTE FROM ADOBE (MUST BE .ase FILE AND RUN IT THROUGH THIS PROGRAM TO GET A VISUAL DOCUMENT AND ALL HEX CODES

ASE Palette Viewer & Converter

A fast, private, web-based utility for artists and designers to instantly view Adobe Swatch Exchange (.ASE) files, grab clean HEX code lists, and export polished PDF color palettes—all completely inside your web browser.
No apps to install, no accounts to create, and no servers to upload to. Your files never leave your computer.

Features

• Instant Drop & Display: Drag an .ase file directly out of Photoshop or Illustrator and drop it into your browser to view your swatches instantly.
• Dynamic File Naming: The interface automatically extracts and displays your original palette file name at the very top of the workspace.
• One-Click Hex Copying: Generates a clean, text-only list of every HEX code in your palette with a dedicated "Copy List" button for quick pasting into code editors, stylesheets, or digital documents.
• Vector PDF Export: Compiles a beautifully formatted, multi-page vector PDF printout containing visual color swatch cards stamped with their respective HEX strings.

How to Run It Locally

Because this program is built using standard vanilla web technologies, you can run it right off your desktop with zero installation:
1. Download or clone this project folder to your machine.
2. Ensure all three core files (index.html, parser.js, and jspdf.js) are sitting together in the same directory.
3. Open your project folder, right-click index.html, and select Open with Live Server inside VS Code (or double-click the file to open it in your preferred internet browser).
4. Drag and drop any .ase palette file onto the canvas area to process your colors!

Technical Specifications

• File Stack: Vanilla HTML5, CSS3, and JavaScript (ES6+).
• Dependencies: Powered locally by the open-source jsPDF vector document compiler framework.
• Encoding: Uses low-level DataView binary parsing arrays to read Big-Endian structures natively in real-time.
