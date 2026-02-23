# BSCS 1-1N Certificate Generator

Automated certificate generation for **President's Lister** and **Dean's Lister** students of **BSCS 1-1N** at the **Polytechnic University of the Philippines (PUP)**.

Students verify their identity using their full name and student ID, then receive a personalized certificate they can download as a PDF.

## Features

- **Student Verification** -- Validates name and student ID against a server-side data file before generating the certificate.
- **PDF Generation** -- Produces a downloadable PDF with the student's name rendered in Poppins Bold over the official CTRL+ 1-1N certificate template.
- **Privacy-Safe** -- Student data (`data/students.json`) is only accessed server-side through API routes.

## Tech Stack

- **Next.js** (App Router)
- **React 18**
- **Tailwind CSS** + **shadcn/ui**


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

## Deployment

This project is ready to deploy on [Vercel](https://vercel.com):

1. Push your code to a **private** GitHub repository (to protect student data).
2. Go to [vercel.com](https://vercel.com) and import the repository.
3. Click **Deploy** -- Vercel auto-detects Next.js.
>>>>>>> v3

## License

This project is for internal academic use by BSCS 1-1N, Polytechnic University of the Phlippines.
