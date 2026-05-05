import React, { useEffect, useRef, memo } from 'react';

function MarketOverviewWidget() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(
    () => {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
        {
          "colorTheme": "dark",
          "dateRange": "12M",
          "showChart": true,
          "locale": "en",
          "width": "100%",
          "height": "100%",
          "largeChartUrl": "",
          "isTransparent": true,
          "showSymbolLogo": true,
          "showFloatingTooltip": true,
          "plotLineColorGrowing": "rgba(234, 179, 8, 1)",
          "plotLineColorFalling": "rgba(234, 179, 8, 1)",
          "gridLineColor": "rgba(42, 46, 57, 0)",
          "scaleFontColor": "rgba(209, 212, 220, 1)",
          "belowLineFillColorGrowing": "rgba(234, 179, 8, 0.12)",
          "belowLineFillColorFalling": "rgba(234, 179, 8, 0.12)",
          "belowLineFillColorGrowingBottom": "rgba(41, 98, 255, 0)",
          "belowLineFillColorFallingBottom": "rgba(41, 98, 255, 0)",
          "symbolActiveColor": "rgba(234, 179, 8, 0.12)",
          "tabs": [
            {
              "title": "Forex",
              "symbols": [
                { "s": "FX:EURUSD", "d": "EUR to USD" },
                { "s": "FX:GBPUSD", "d": "GBP to USD" },
                { "s": "FX:USDJPY", "d": "USD to JPY" },
                { "s": "FX:USDCHF", "d": "USD to CHF" },
                { "s": "FX:AUDUSD", "d": "AUD to USD" },
                { "s": "FX:USDCAD", "d": "USD to CAD" }
              ],
              "originalTitle": "Forex"
            },
            {
              "title": "Crypto",
              "symbols": [
                { "s": "BINANCE:BTCUSDT", "d": "BTC to USDT" },
                { "s": "BINANCE:ETHUSDT", "d": "ETH to USDT" },
                { "s": "BINANCE:BNBUSDT", "d": "BNB to USDT" },
                { "s": "BINANCE:XRPUSDT", "d": "XRP to USDT" },
                { "s": "BINANCE:ADAUSDT", "d": "ADA to USDT" },
                { "s": "BINANCE:SOLUSDT", "d": "SOL to USDT" }
              ]
            },
            {
              "title": "Indices",
              "symbols": [
                { "s": "FOREXCOM:SPXUSD", "d": "S&P 500" },
                { "s": "FOREXCOM:NSXUSD", "d": "US Tech 100" },
                { "s": "FOREXCOM:DJI", "d": "Dow 30" },
                { "s": "INDEX:NKY", "d": "Nikkei 225" },
                { "s": "INDEX:DEU40", "d": "DAX Index" },
                { "s": "FOREXCOM:UKXGBP", "d": "UK 100" }
              ],
              "originalTitle": "Indices"
            }
          ]
        }`;
      if (container.current) {
        container.current.innerHTML = "";
        container.current.appendChild(script);
      }
    },
    []
  );

  return (
    <div className="tradingview-widget-container" ref={container} style={{ height: "100%", width: "100%" }}>
      <div className="tradingview-widget-container__widget"></div>
    </div>
  );
}

export default memo(MarketOverviewWidget);
