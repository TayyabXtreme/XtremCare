# 🏥 HealthMate - Sehat ka Smart Dost

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase)
![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=flat-square&logo=clerk)

> **AI-powered medical report analyzer with bilingual summaries (English + Roman Urdu)**

🔗 **Live Demo:** [https://healthmate-snowy.vercel.app/](https://healthmate-snowy.vercel.app/)  
📦 **Repository:** [https://github.com/TayyabXtreme/XtremCare](https://github.com/TayyabXtreme/XtremCare)

---

## 🎯 What is HealthMate?

Managing medical reports is hard. HealthMate makes it simple:
- 📤 Upload your lab reports, X-rays, prescriptions
- � AI analyzes them instantly using **Google Gemini**
- 📊 Get easy summaries in **English + Roman Urdu**
- � Track all your health data in one place

---

## ✨ Features

- ✅ **AI Report Analysis** - Gemini 2.5 Flash reads PDFs & images
- ✅ **Bilingual Summaries** - English + Roman Urdu explanations
- ✅ **Secure Authentication** - Clerk (Email, Google, Apple)
- ✅ **Health Dashboard** - Track vitals (BP, Sugar, BMI, Heart Rate)
- ✅ **Medical Timeline** - View all reports chronologically
- ✅ **Dark Mode** - Modern glassmorphic UI
- ✅ **Mobile Responsive** - Works on all devices

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS 4 + shadcn/ui |
| **Authentication** | Clerk |
| **Database** | Supabase (PostgreSQL) |
| **AI Model** | Google Gemini 2.5 Flash |
| **Deployment** | Vercel |

---

## � Quick Start

### Prerequisites
- Node.js 18+ installed
- Supabase account
- Clerk account
- Google AI API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/TayyabXtreme/XtremCare.git
cd XtremCare
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your keys:
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key
```

4. **Run development server**
```bash
npm run dev
```

5. **Open [http://localhost:3000](http://localhost:3000)**

---

## � Project Structure

```
src/
├── app/                    # Next.js pages
│   ├── dashboard/         # Protected dashboard routes
│   ├── login/             # Authentication pages
│   └── register/          
├── components/            
│   ├── dashboard/         # Dashboard components
│   ├── landing/           # Landing page sections
│   └── ui/                # shadcn/ui components
├── hooks/                 # Custom React hooks
├── utils/
│   ├── ai/                # Gemini AI integration
│   └── supabase/          # Database utilities
└── middleware.ts          # Clerk auth middleware
```

---

## 🔐 Environment Setup

### Get Clerk Keys
1. Go to [clerk.com](https://clerk.com)
2. Create a new application
3. Enable Email, Google, Apple providers
4. Copy API keys from dashboard

### Get Supabase Keys
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Get URL and anon key from Settings → API

### Get Gemini API Key
1. Go to [ai.google.dev](https://ai.google.dev)
2. Create API key
3. Enable Gemini API


---

## 📸 Screenshots

### Landing Page
Modern glassmorphic design with smooth animations

### Dashboard
Track your health metrics and recent reports

### AI Analysis
Get bilingual summaries with highlighted abnormalities

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## ⚠️ Disclaimer

This application provides AI-powered analysis for educational purposes only. Always consult with qualified healthcare professionals for medical advice.

**Roman Urdu:** Yeh app sirf samajhne ke liye hai. Apne doctor se zaroor consult karein.

---

## 👨‍💻 Developer

**Muhammad Tayyab**

- 🐙 GitHub: [@TayyabXtreme](https://github.com/TayyabXtreme)
- 💼 LinkedIn: [muhammad-tayyab-xtreme](https://www.linkedin.com/in/muhammad-tayyab-xtreme)

---

## 📄 License

This project is open source and available under the MIT License.

---

<div align="center">

**Built with ❤️ for better healthcare accessibility**

![Made with Next.js](https://img.shields.io/badge/Made%20with-Next.js-black?style=flat-square&logo=next.js)
![Powered by AI](https://img.shields.io/badge/Powered%20by-Gemini%20AI-4285F4?style=flat-square&logo=google)

</div>

