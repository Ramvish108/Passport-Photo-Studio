# 📸 Passport Photo Studio

A professional React application to create Indian passport-size photos (35×45mm, 300 DPI) arranged on an A4 sheet, with PDF export and sharing.

---

## ✨ Features

- **Upload** — Drag & drop or click to upload JPEG/PNG/WebP
- **Crop** — Interactive crop locked to 35:45 passport aspect ratio with zoom & rotation
- **Enhance** — Preset filters (Auto, Vivid, Soft, Sharp) or manual Brightness / Contrast / Saturation sliders
- **Name & DOB** — Optional text printed beneath each photo
- **A4 Sheet Layout** — 4, 6, 8, or 12 photos per sheet arranged on an A4 grid
- **Border Options** — None / Thin / Medium / Thick / White
- **Cut Lines** — Dashed cut guides on the PDF
- **Advanced Options** — Border colour, sheet background, DPI (150/300/600), photo count
- **PDF Export** — High-quality PDF at chosen DPI, ready for printing
- **Share** — Web Share API on mobile, fallback download on desktop

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
cd Photo
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for production

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
Photo/
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx              # Entry point
    ├── App.jsx               # Root with step-based routing
    ├── index.css             # Global styles & CSS variables
    │
    ├── constants/
    │   └── index.js          # Passport dims, A4 dims, border/BG options
    │
    ├── store/
    │   └── photoStore.js     # Zustand global state
    │
    ├── hooks/
    │   ├── useImageProcessor.js   # Crop & enhancement logic
    │   └── usePDFExport.js        # PDF download & share
    │
    ├── utils/
    │   ├── imageUtils.js     # Canvas crop, filter application
    │   ├── pdfUtils.js       # jsPDF A4 generation
    │   └── shareUtils.js     # Web Share API / download fallback
    │
    ├── components/
    │   ├── StepHeader.jsx    # Sticky top nav with step indicator
    │   ├── ImageUploader.jsx # Drag & drop upload zone
    │   ├── CropEditor.jsx    # react-easy-crop integration
    │   ├── EnhancePanel.jsx  # Filter presets + manual sliders
    │   ├── PersonDetails.jsx # Name / DOB toggle + fields
    │   ├── PassportPhoto.jsx # Single photo tile (reusable)
    │   ├── A4SheetLayout.jsx # A4 grid preview
    │   ├── AdvancedOptions.jsx # Collapsible advanced controls
    │   └── ExportPanel.jsx   # Download PDF + Share buttons
    │
    └── pages/
        ├── UploadPage.jsx    # Step 1
        ├── EditorPage.jsx    # Step 2
        └── PreviewPage.jsx   # Step 3
```

---

## 🖨️ Print Instructions

1. Open the downloaded PDF
2. Set printer to **"Actual size"** (do NOT scale to fit)
3. Use **photo paper** (glossy or satin) for best quality
4. Cut along the **dashed lines**

---

## 📏 Indian Passport Photo Standard (BIS)

| Property   | Value           |
|------------|-----------------|
| Width      | 35 mm           |
| Height     | 45 mm           |
| Background | White / off-white |
| Resolution | 300 DPI minimum |
| Format     | Colour photograph |

---

## 🛠️ Tech Stack

| Library         | Purpose                        |
|-----------------|--------------------------------|
| React 18        | UI framework                   |
| Vite            | Build tool                     |
| Zustand         | Global state management        |
| react-easy-crop | Interactive image cropping     |
| jsPDF           | PDF generation                 |
| html2canvas     | Sheet screenshot (optional)    |
| lucide-react    | Icons                          |

---

## 📄 License

MIT — free for personal and commercial use.
