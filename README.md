# Prism Market Intelligence Platform 📊

An agentic AI-powered market research application that allows organizations and analysts to perform deep thematic research, track market growths, and analyze company dynamics utilizing advanced LLMs. 

## 🚀 Tech Stack

**Frontend (Vercel)**
- React 19 + Vite
- TailwindCSS (Premium Monochrome Typography-first UI)
- Lucide React (Icons)
- Recharts (Data Visualisations)
- Axios for API Client
- React Router DOM

**Backend (Render)**
- Python 3.10
- FastAPI + Uvicorn
- PostgreSQL (via SQLAlchemy & psycopg2)
- Groq Cloud API (Agentic LLMs - Llama 3)
- LangChain & ChromaDB (Vector Knowledge Base)
- JWT Authentication (python-jose & passlib)

## ☁️ Deployment Guides

### Frontend Deployment (Vercel)
The frontend is pre-configured to be deployed natively on Vercel utilizing Vite. 
1. Import the repository into Vercel.
2. Select the **`frontend`** directory as the Root Directory.
3. Ensure the Framework Preset is set to **Vite**.
4. In Environment Variables, set `VITE_API_URL` to your deployed backend URL.
5. Deploy! (Routing is natively handled via the included `vercel.json`).

### Backend Deployment (Render)
The backend is optimized to run as a Web Service on Render utilizing a native Python environment.
1. Create a new **Web Service** on Render connected to this repository.
2. Set the Root Directory to **`backend`**.
3. Set Build Command: `pip install -r requirements.txt`
4. Set Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Configure your Environment Variables:
   - `DATABASE_URL`: Your PostgreSQL connection string.
   - `GROQ_API_KEY`: Your Groq Cloud API Key.
   - `SECRET_KEY`: A secure random string for JWT encoding.
   - `FRONTEND_URL`: Your deployed Vercel URL (e.g. `https://prism.vercel.app` - **NO trailing slashes** to prevent CORS errors).

## 🛠️ Local Setup 

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/prism-market-intelligence.git
   cd prism-market-intelligence
   ```

2. **Run Backend Locally:**
   ```bash
   cd backend
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   
   # Set up your .env file here based on .env.example
   
   uvicorn app.main:app --reload --port 8000
   ```

3. **Run Frontend Locally:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 🔒 Security & CORS
CORS is explicitly configured in `backend/app/main.py`. Localhost proxy development (`http://localhost:3000` & `5173`) are permitted by default. For production, the FastAPI middleware strictly checks incoming `Origin` headers against the provided `FRONTEND_URL` deployment environment variable. 

---
*Built with simplicity, performance, and AI-first engineering.*
