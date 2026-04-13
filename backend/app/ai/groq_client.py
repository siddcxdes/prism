from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage
from app.ai.tools import ALL_TOOLS
import os
import json
from dotenv import load_dotenv

load_dotenv()

llm = ChatGroq(
    api_key=os.getenv("GROQ_API_KEY"),
    model="llama-3.3-70b-versatile",
    temperature=0.1,
)

TOOL_DESCRIPTIONS = """
Available tools:
1. search_web - Search the web for general information
2. search_news - Search for recent news articles
3. search_trends - Search for market trends and growth data
4. search_wikipedia - Get background info from Wikipedia
5. fetch_stock_data - Get real stock prices, P/E, market cap, EPS, and 30-day price history (needs a ticker like AAPL, TSLA, NVDA)
6. search_knowledge_base - Search internal documents containing SEC filings and earnings reports for NVIDIA, Apple, Tesla, Microsoft, Amazon, JPMorgan, Goldman Sachs
"""

PLANNING_PROMPT = """You are a research planning assistant. Given a user query, decide which tools to use.

""" + TOOL_DESCRIPTIONS + """

Respond with ONLY a JSON object like this:
{"tools": ["tool_name_1", "tool_name_2"], "stock_tickers": ["AAPL", "TSLA"]}

Rules:
- Pick ONLY the tools that are actually needed for this query
- If the query mentions specific companies, include fetch_stock_data and list their tickers in stock_tickers
- If the query asks about earnings, filings, or financial details, include search_knowledge_base
- If the query is about news or sentiment, include search_news
- If the query is about market trends or industry overview, include search_trends
- Always include at least search_web as a fallback
- stock_tickers should be empty [] if no specific company stocks are needed
"""

ANALYSIS_PROMPT = """You are an expert market research analyst. Analyze the provided data and generate a structured research report.

You must respond with ONLY valid JSON, no markdown, no code blocks. Use this exact format:
{
    "query_type": "company" or "market",
    "summary": "comprehensive paragraph summary",
    "key_insights": ["insight 1", "insight 2", "insight 3", "insight 4", "insight 5"],
    "sentiment": "positive" or "negative" or "neutral",
    "confidence_score": <integer 0-100>,
    "sources": ["url1", "url2"],
    "trends": "description of market trends with growth percentages",
    "news_articles": [
        {"title": "...", "source": "...", "url": "...", "sentiment": "positive/negative/neutral"}
    ],
    "company_overview": {
        "name": "...", "description": "...", "headquarters": "...", "founded": "..."
    },
    "stock_data": {
        "current_price": 123.45, "market_cap": "...", "pe_ratio": 25.5,
        "eps": 5.2, "52_week_high": 150, "52_week_low": 90,
        "historical_prices": [{"date": "2024-01-01", "close": 123.45}]
    },
    "top_companies": [
        {"name": "Company", "ticker": "TICK", "sentiment": "positive"}
    ],
    "financial_comparison": [
        {"metric": "Market Cap", "value": "$X", "industry_average": "$Y"}
    ]
}

Rules:
- confidence_score: 90-100 if multiple reliable sources confirm data, 70-89 for good data with some gaps, 50-69 for limited data, 30-49 for very few sources, below 30 for almost no data. DO NOT default to any number.
- Use REAL data from the provided search results. Do not make up numbers.
- If stock_data was fetched, use those real numbers in the stock_data field
- Set fields to null if no data is available for them
- Extract real URLs from the search results for sources
- Every insight should be traceable to the provided data"""


def run_research(query: str) -> str:
    planning_messages = [
        SystemMessage(content=PLANNING_PROMPT),
        HumanMessage(content=f"Query: {query}")
    ]
    plan_result = llm.invoke(planning_messages)

    try:
        plan_text = plan_result.content
        start = plan_text.find("{")
        end = plan_text.rfind("}") + 1
        plan = json.loads(plan_text[start:end])
    except Exception:
        plan = {"tools": ["search_web", "search_news"], "stock_tickers": []}

    tools_to_use = plan.get("tools", ["search_web"])
    stock_tickers = plan.get("stock_tickers", [])

    tool_results = {}

    for tool_name in tools_to_use:
        if tool_name == "fetch_stock_data":
            continue
        tool_fn = ALL_TOOLS.get(tool_name)
        if tool_fn:
            try:
                tool_results[tool_name] = tool_fn.invoke(query)
            except Exception as e:
                tool_results[tool_name] = f"Failed: {e}"

    if "fetch_stock_data" in tools_to_use and stock_tickers:
        stock_results = []
        for ticker in stock_tickers[:5]:
            try:
                result = ALL_TOOLS["fetch_stock_data"].invoke(ticker)
                stock_results.append(result)
            except Exception as e:
                stock_results.append(f"Failed for {ticker}: {e}")
        tool_results["stock_data"] = "\n\n".join(stock_results)

    context_parts = []
    context_parts.append(f"Tools used: {', '.join(tools_to_use)}")
    context_parts.append(f"Stock tickers queried: {', '.join(stock_tickers) if stock_tickers else 'None'}")

    for name, data in tool_results.items():
        context_parts.append(f"\n=== {name.upper()} ===\n{data}")

    context = "\n".join(context_parts)

    analysis_messages = [
        SystemMessage(content=ANALYSIS_PROMPT),
        HumanMessage(content=f"Research topic: {query}\n\nGathered data:\n{context}")
    ]

    result = llm.invoke(analysis_messages)
    return result.content