from langchain_core.tools import tool
from ddgs import DDGS
import wikipedia
import yfinance as yf
import json


@tool
def search_web(query: str) -> str:
    """Search the web for information about a topic."""
    try:
        results = DDGS().text(query, max_results=5)
        if not results:
            return "No web results found."
        output = []
        for r in results:
            output.append(f"Title: {r.get('title', '')}\nURL: {r.get('href', '')}\nSnippet: {r.get('body', '')}\n")
        return "\n".join(output)
    except Exception as e:
        return f"Web search failed: {e}"


@tool
def search_news(query: str) -> str:
    """Search for recent news articles about a topic."""
    try:
        results = DDGS().news(query, max_results=5)
        if not results:
            return "No news found."
        output = []
        for r in results:
            output.append(f"Title: {r.get('title', '')}\nSource: {r.get('source', '')}\nURL: {r.get('url', '')}\nDate: {r.get('date', '')}\nSnippet: {r.get('body', '')}\n")
        return "\n".join(output)
    except Exception as e:
        return f"News search failed: {e}"


@tool
def search_trends(query: str) -> str:
    """Search for market trends and growth data about a topic."""
    try:
        results = DDGS().text(f"{query} market trends growth statistics 2024 2025", max_results=5)
        if not results:
            return "No trend data found."
        output = []
        for r in results:
            output.append(f"Title: {r.get('title', '')}\nSnippet: {r.get('body', '')}\n")
        return "\n".join(output)
    except Exception as e:
        return f"Trends search failed: {e}"


@tool
def search_wikipedia(query: str) -> str:
    """Get background info from Wikipedia about a company or topic."""
    try:
        results = wikipedia.search(query, results=2)
        if not results:
            return "No Wikipedia results."
        page = wikipedia.page(results[0], auto_suggest=False)
        return page.summary[:2000]
    except wikipedia.exceptions.DisambiguationError as e:
        try:
            page = wikipedia.page(e.options[0], auto_suggest=False)
            return page.summary[:2000]
        except Exception:
            return f"Wikipedia options: {', '.join(e.options[:5])}"
    except Exception as e:
        return f"Wikipedia failed: {e}"


@tool
def fetch_stock_data(ticker: str) -> str:
    """Fetch real stock price, financial metrics, and 30-day history for a company ticker like AAPL, TSLA, NVDA."""
    try:
        stock = yf.Ticker(ticker.strip().upper())
        info = stock.info

        metrics = {
            "ticker": ticker.upper(),
            "name": info.get("longName", ""),
            "current_price": info.get("currentPrice") or info.get("regularMarketPrice"),
            "market_cap": info.get("marketCap"),
            "pe_ratio": info.get("trailingPE"),
            "forward_pe": info.get("forwardPE"),
            "eps": info.get("trailingEps"),
            "revenue": info.get("totalRevenue"),
            "profit_margin": info.get("profitMargins"),
            "52_week_high": info.get("fiftyTwoWeekHigh"),
            "52_week_low": info.get("fiftyTwoWeekLow"),
            "volume": info.get("volume"),
            "sector": info.get("sector", ""),
            "industry": info.get("industry", ""),
        }

        hist = stock.history(period="1mo")
        prices = []
        for date, row in hist.iterrows():
            prices.append({
                "date": date.strftime("%Y-%m-%d"),
                "close": round(row["Close"], 2),
                "volume": int(row["Volume"]),
            })

        metrics["historical_prices"] = prices

        return json.dumps(metrics, default=str)
    except Exception as e:
        return f"Stock data failed for {ticker}: {e}"


@tool
def search_knowledge_base(query: str) -> str:
    """Search the internal document knowledge base for SEC filings, earnings reports, and company analysis."""
    try:
        from app.ai.knowledge_base import query_knowledge_base
        results = query_knowledge_base(query)
        return results
    except Exception as e:
        return f"Knowledge base search failed: {e}"


ALL_TOOLS = {
    "search_web": search_web,
    "search_news": search_news,
    "search_trends": search_trends,
    "search_wikipedia": search_wikipedia,
    "fetch_stock_data": fetch_stock_data,
    "search_knowledge_base": search_knowledge_base,
}