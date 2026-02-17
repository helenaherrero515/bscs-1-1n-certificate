# BSCS 1-1N Certificate Generator

Automated certificate generation for **President's Lister** and **Dean's Lister** students of **BSCS 1-1N** at the **Polytechnic University of the Philippines (PUP)**.

Students verify their identity using their full name and student ID, then receive a personalized certificate they can download as a PDF.

## Features

- **Student Verification** -- Validates name and student ID against a server-side data file before generating the certificate.
- **PDF Generation** -- Produces a downloadable PDF with the student's name rendered in Poppins Bold over the official CTRL+ 1-1N certificate template.
- **Two Certificate Types** -- Separate templates for President's Lister (PL) and Dean's Lister (DL).
- **Privacy-Safe** -- Student data (`data/students.json`) is only accessed server-side through API routes. It is never exposed to the browser.
- **Separate Result Page** -- After verification, the certificate preview loads on a dedicated `/result` page.

## Tech Stack

- **Next.js** (App Router)
- **React 18**
- **Tailwind CSS** + **shadcn/ui**
- **pdf-lib** + **@pdf-lib/fontkit** for PDF generation
- **Poppins** + **Inter** + **Playfair Display** (Google Fonts)

## Project Structure

```
app/
  page.tsx              # Home page (hero + verification form)
  result/page.tsx       # Result page (certificate preview + download)
  api/
    verify-student/     # GET - validates student name + ID
    generate-certificate/ # POST - generates and returns the PDF
components/
  header.tsx            # Sticky header with CTRL+ 1-1N branding + Facebook link
  hero-section.tsx      # "Congrats, klasymeyt!" heading
  certificate-form.tsx  # Student verification form
  certificate-preview.tsx # Certificate image preview + download button
data/
  students.json         # Student records (name, student_id, award)
public/
  certificates/         # PL and DL certificate template images (.png)
  fonts/                # Poppins-Bold.ttf for PDF rendering
  web_background.png    # Page background image
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- npm

### Installation

```bash
npm install --legacy-peer-deps
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Managing Student Data

Edit `data/students.json` to add, remove, or update students. Each entry has three fields:

```json
{
  "name": "Full Name",
  "student_id": "2025-XXXXX-MN-0",
  "award": "PL"
}
```

- `award` must be either `"PL"` (President's Lister) or `"DL"` (Dean's Lister).


## License

This project is for internal academic use by BSCS 1-1N, Polytechnic University of the Philippines.
