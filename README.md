# FarmerConnect – Direct Farmer-to-Customer Marketplace

An agricultural marketplace connecting verified local farmers directly with grocery households and approved bulk commercial buyers. Features strict product eligibility policies, solar cold room batch tracking, processed grain routing, IVR voice accessibility simulation, and multilingual interfaces (Tamil, English, and Hindi).

---

## 🚀 How to Deploy Using GitHub

You can export and deploy this website using GitHub via any of the methods below:

### Method 1: Automated GitHub Pages (Recommended)

This repository includes an automated GitHub Actions deployment workflow located at `.github/workflows/deploy.yml`.

1. **Export to GitHub**:
   - In Google AI Studio, open the application menu (top right) and choose **Export to GitHub** (or download the ZIP and push it to your GitHub account).
2. **Enable GitHub Pages in your Repository**:
   - Go to your GitHub repository on [github.com](https://github.com).
   - Navigate to **Settings** > **Pages** (in the left sidebar).
   - Under **Build and deployment** > **Source**, select **GitHub Actions**.
3. **Trigger Deployment**:
   - Push any commit to `main` or `master` (or go to **Actions** > **Deploy to GitHub Pages** > **Run workflow**).
   - Once completed, your live website link will be displayed under **GitHub Pages** (e.g. `https://<username>.github.io/<repo-name>/`).

---

### Method 2: 1-Click Deployment via Vercel / Netlify (Free & Instant)

You can also deploy your GitHub repository with zero configuration:

#### Deploying on Vercel:
1. Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **Add New Project** and select your GitHub repository.
3. Keep default settings (Framework: Vite, Build command: `npm run build`, Output directory: `dist`).
4. Click **Deploy**. Your production URL is live in under 60 seconds!

#### Deploying on Netlify:
1. Go to [netlify.com](https://netlify.com) and select **Import from Git**.
2. Select your repository.
3. Build command: `npm run build`, Publish directory: `dist`.
4. Click **Deploy Site**.

---

## 💻 Local Development Setup

To run the platform locally on your machine:

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev

# 4. Open in browser:
# http://localhost:3000
```

### Production Build:
```bash
npm run build
npm run preview
```

---

## 🌿 Key Platform Features

- **Persistent Activity Notification Bell**: Live tracking in the header for Order Status Updates, Commercial Bulk RFQs, and Perishable Stock Spoilage Alerts.
- **Strict Grain Eligibility System**:
  - Raw paddy and raw wheat are disallowed from the platform.
  - Processed rice and processed wheat are strictly reserved for Grocery buyers.
- **Solar Cold Room & IoT Storage**: Live temperature, humidity, and capacity monitoring across regional farmer cold stores.
- **Traceability & QR Verification**: Batch-level harvest-to-fork tracking.
- **Multilingual Support**: Instant switching between தமிழ் (Tamil), English, and हिन्दी (Hindi).
