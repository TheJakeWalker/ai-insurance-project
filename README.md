# 🏗️ AI Insurance Take-Home – Claim Parser

This tool parses insurance claim files, extracts the insured name using GPT, and matches it to a known list of insured entities with confidence scoring.

Built with **Next.js 14**, **React 18**, and **TypeScript** using the App Router and server actions.

---

## 🚀 Setup & Run

### 1. Install dependencies
```bash
npm install
```

### 2. Configure OpenAI key

Create a `.env.local` file:
```
OPENAI_API_KEY=your-api-key-here
```

> You can refer to `.env.example` for variable structure.

### 3. Start the app
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 🧱 Architecture Notes

This app uses **Next.js App Router** with a clean separation of concerns:

- `Dropzone.tsx` handles drag-and-drop uploads, status tracking, and client-side parsing
- `parser.ts` extracts plain text from `.txt` and `.docx` files using the [`mammoth`](https://www.npmjs.com/package/mammoth) library
- `route.ts` (API route) sends text to OpenAI's GPT (`gpt-3.5-turbo`) and returns an extracted name
- `match.ts` uses [`Fuse.js`](https://fusejs.io/) to perform fuzzy matching between the extracted name and a static list of insureds
- Matches are returned with a confidence score and rendered in a UI results table

TypeScript is used throughout with strict mode enabled. The OpenAI key is secured via `process.env`. No data is persisted — this is an in-memory tool for real-time file parsing.

---

## 🧠 Assumptions & Trade-offs

- Only `.txt` and `.docx` files are supported (PDF skipped per instruction)
- Matching is based on normalized names using `Fuse.js` and a **confidence threshold of 85%**
- GPT is prompted to return only the insured name (we assume it follows the prompt)
- Text parsing is done on the **client side** for simplicity
- No persistent storage or database is used

---

## 🧪 Test Coverage

```bash
npm run test
```

Includes unit tests for `matchInsuredName()`:
- Exact match
- Loose match (case/suffix variations)
- No match (under threshold)

---

## 📁 Project Structure

```
src/
├── app/
│   └── api/ask-gpt/route.ts     # API route for GPT + match
│   └── layout.tsx               # Global layout
│   └── page.tsx                 # Home page
├── components/Dropzone.tsx      # Drag-and-drop file upload
├── lib/
│   ├── parser.ts                # File parsing logic
│   ├── match.ts                 # Fuzzy matching logic
├── constants/insureds.ts        # Static insured data
├── __tests__/match.test.ts      # Jest test for matcher
.env.example                     # Env template
```
