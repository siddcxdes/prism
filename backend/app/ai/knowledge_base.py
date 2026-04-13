import chromadb
from chromadb.utils import embedding_functions
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "data", "chroma_db")

ef = embedding_functions.DefaultEmbeddingFunction()

client = chromadb.PersistentClient(path=DB_PATH)

collection = client.get_or_create_collection(
    name="company_documents",
    embedding_function=ef,
)


SAMPLE_DOCS = [
    {
        "id": "nvda-q3-2024",
        "text": "NVIDIA Q3 FY2025 Earnings Report Summary. NVIDIA reported record revenue of $35.1 billion for Q3 FY2025, up 94% year-over-year. Data Center revenue was $30.8 billion, up 112% from a year ago. Gaming revenue was $3.3 billion, up 15%. Gross margin was 74.6%. NVIDIA announced a $50 billion share buyback program. CEO Jensen Huang stated that 'The age of AI is in full steam, driving a global shift to NVIDIA computing.' Key risks include supply chain constraints for H100/H200 GPUs, increasing competition from AMD MI300X, and potential regulatory challenges in China export controls.",
        "metadata": {"company": "NVIDIA", "ticker": "NVDA", "type": "earnings", "quarter": "Q3 FY2025", "source": "SEC Filing 10-Q"}
    },
    {
        "id": "nvda-overview",
        "text": "NVIDIA Corporation designs and sells computer graphics processors and related technology. The company operates in two segments: Graphics and Compute & Networking. Its products include GeForce GPUs for gaming, Quadro for professional visualization, Tesla and A100/H100 for data centers and AI training, and DRIVE for autonomous vehicles. NVIDIA dominates the AI training chip market with approximately 80% market share. The company was founded in 1993 by Jensen Huang, Chris Malachowsky, and Curtis Priem. Headquarters: Santa Clara, California. Employees: approximately 29,600.",
        "metadata": {"company": "NVIDIA", "ticker": "NVDA", "type": "overview", "source": "SEC Filing 10-K"}
    },
    {
        "id": "aapl-q4-2024",
        "text": "Apple Inc. Q4 FY2024 Earnings Report Summary. Apple reported quarterly revenue of $94.9 billion, up 6% year-over-year. iPhone revenue was $46.2 billion, up 6%. Services revenue reached a new all-time record of $25.0 billion, up 12%. Mac revenue was $7.7 billion, up 2%. iPad revenue was $7.0 billion, down 1%. The company returned over $29 billion to shareholders through dividends and share repurchases. CEO Tim Cook highlighted Apple Intelligence as a major growth driver. Gross margin was 46.2%. Key risks include China market slowdown, regulatory pressures in the EU (Digital Markets Act), and heavy R&D spending on Vision Pro.",
        "metadata": {"company": "Apple", "ticker": "AAPL", "type": "earnings", "quarter": "Q4 FY2024", "source": "SEC Filing 10-Q"}
    },
    {
        "id": "aapl-overview",
        "text": "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. Key products include iPhone, Mac, iPad, Apple Watch, and AirPods. The company also offers services including Apple Music, iCloud, Apple TV+, Apple Pay, and the App Store. Apple has one of the most valuable brand portfolios in the world. Founded in 1976 by Steve Jobs, Steve Wozniak, and Ronald Wayne. Headquarters: Cupertino, California. Employees: approximately 161,000. Market cap consistently over $3 trillion.",
        "metadata": {"company": "Apple", "ticker": "AAPL", "type": "overview", "source": "SEC Filing 10-K"}
    },
    {
        "id": "tsla-q3-2024",
        "text": "Tesla Inc. Q3 2024 Earnings Report Summary. Tesla reported revenue of $25.2 billion, up 8% year-over-year. Automotive revenue was $20.0 billion. Energy generation and storage revenue was $2.4 billion, up 52%. Vehicle deliveries were 462,890 units. Operating margin was 10.8%. Free cash flow was $2.7 billion. CEO Elon Musk emphasized plans for affordable vehicle models starting in early 2025, with a target price under $30,000. The Cybertruck reached profitability for the first time. Key risks include price war in China with BYD, slowing EV demand in Europe, regulatory investigations, and CEO distraction with other ventures.",
        "metadata": {"company": "Tesla", "ticker": "TSLA", "type": "earnings", "quarter": "Q3 2024", "source": "SEC Filing 10-Q"}
    },
    {
        "id": "tsla-overview",
        "text": "Tesla Inc. designs, develops, manufactures, and sells electric vehicles and energy storage systems. Products include Model S, Model 3, Model Y, Model X, Cybertruck, and the Tesla Semi. The company also manufactures solar panels, Solar Roof, and Powerwall/Megapack battery storage. Tesla operates a global Supercharger network with over 50,000 stations. Founded in 2003 by Martin Eberhard and Marc Tarpenning, with Elon Musk joining as chairman and later becoming CEO. Headquarters: Austin, Texas. Employees: approximately 140,000.",
        "metadata": {"company": "Tesla", "ticker": "TSLA", "type": "overview", "source": "SEC Filing 10-K"}
    },
    {
        "id": "msft-q1-2025",
        "text": "Microsoft Corporation Q1 FY2025 Earnings Report Summary. Microsoft reported revenue of $65.6 billion, up 16% year-over-year. Intelligent Cloud revenue was $24.1 billion, with Azure growing 34%. Productivity and Business Processes revenue was $28.3 billion. More Personal Computing revenue was $13.2 billion. Operating income was $30.6 billion, up 14%. The company's AI services contributed $3 billion in annualized revenue run rate. CEO Satya Nadella stated Copilot adoption is accelerating across enterprise. Key risks include cloud competition with AWS and GCP, regulatory scrutiny of Activision acquisition, and high capital expenditure on AI infrastructure.",
        "metadata": {"company": "Microsoft", "ticker": "MSFT", "type": "earnings", "quarter": "Q1 FY2025", "source": "SEC Filing 10-Q"}
    },
    {
        "id": "amzn-q3-2024",
        "text": "Amazon.com Inc. Q3 2024 Earnings Report Summary. Amazon reported net sales of $158.9 billion, up 11% year-over-year. AWS revenue was $27.5 billion, up 19%. North America segment revenue was $95.5 billion. Operating income was $17.4 billion, up 56%. AWS operating income was $10.4 billion with 38% margin. Advertising revenue grew 19% to $14.3 billion. CEO Andy Jassy highlighted investments in AI infrastructure and custom chips (Trainium, Inferentia). Key risks include increasing logistics costs, antitrust lawsuits from FTC, heavy capex on AI, and growing competition in cloud from Microsoft Azure.",
        "metadata": {"company": "Amazon", "ticker": "AMZN", "type": "earnings", "quarter": "Q3 2024", "source": "SEC Filing 10-Q"}
    },
    {
        "id": "jpm-q3-2024",
        "text": "JPMorgan Chase Q3 2024 Earnings Report Summary. JPMorgan reported net revenue of $43.3 billion and net income of $12.9 billion. CET1 capital ratio was 15.3%, well above regulatory requirements. Return on equity was 19%. Investment banking fees were $2.4 billion, up 31%. Total assets under management reached $3.9 trillion. Net interest income was $23.5 billion. CEO Jamie Dimon warned about geopolitical risks and inflation persistence. The bank set aside $3.1 billion in provision for credit losses. Key strengths: strongest capital position among US banks, diversified revenue streams, technology investment of $15 billion annually.",
        "metadata": {"company": "JPMorgan Chase", "ticker": "JPM", "type": "earnings", "quarter": "Q3 2024", "source": "SEC Filing 10-Q"}
    },
    {
        "id": "gs-q3-2024",
        "text": "Goldman Sachs Q3 2024 Earnings Report Summary. Goldman Sachs reported net revenues of $12.7 billion and net earnings of $3.0 billion. Investment banking revenue was $1.9 billion, up 20%. Global Banking & Markets revenue was $8.6 billion. Asset & Wealth Management revenue was $3.8 billion with record management fees of $2.6 billion. CET1 capital ratio was 14.6%. Return on equity was 10.4%. CEO David Solomon highlighted the firm's pivot away from consumer banking back to core investment banking and trading. Key risks: trading revenue volatility, regulatory capital requirements, and competition for talent.",
        "metadata": {"company": "Goldman Sachs", "ticker": "GS", "type": "earnings", "quarter": "Q3 2024", "source": "SEC Filing 10-Q"}
    },
]


def ingest_sample_documents():
    existing = collection.get()
    if existing and len(existing["ids"]) > 0:
        return

    ids = [d["id"] for d in SAMPLE_DOCS]
    texts = [d["text"] for d in SAMPLE_DOCS]
    metadatas = [d["metadata"] for d in SAMPLE_DOCS]

    collection.add(
        ids=ids,
        documents=texts,
        metadatas=metadatas,
    )


def query_knowledge_base(query: str, n_results: int = 3) -> str:
    ingest_sample_documents()

    results = collection.query(
        query_texts=[query],
        n_results=n_results,
    )

    if not results["documents"] or not results["documents"][0]:
        return "No relevant documents found in the knowledge base."

    output = []
    for i, doc in enumerate(results["documents"][0]):
        meta = results["metadatas"][0][i] if results["metadatas"] else {}
        source = meta.get("source", "Internal Document")
        company = meta.get("company", "")
        doc_type = meta.get("type", "")
        output.append(f"[{source} - {company} {doc_type}]\n{doc}\n")

    return "\n---\n".join(output)
