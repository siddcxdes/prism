import yfinance as yf

# try fetching TATA MOTORS
ticker = "TATAMOTORS"
stock = yf.Ticker(ticker)
try:
    hist = stock.history(period="1mo")
    print(hist)
except Exception as e:
    print("Error:", e)
