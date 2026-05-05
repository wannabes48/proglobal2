import React, { useEffect, useRef, memo } from 'react';

function WatchlistWidget() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(
    () => {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
        {
          "width": "100%",
          "height": "100%",
          "symbolsGroups": [
            {
              "originalName": "Indices",
              "symbols": [
                { "name": "FOREXCOM:SPXUSD", "displayName": "S&P 500" },
                { "name": "FOREXCOM:NSXUSD", "displayName": "US Tech 100" },
                { "name": "FOREXCOM:DJI", "displayName": "Dow 30" }
              ]
            },
            {
              "originalName": "Forex",
              "symbols": [
                { "name": "FX:EURUSD", "displayName": "EUR/USD" },
                { "name": "FX:GBPUSD", "displayName": "GBP/USD" },
                { "name": "FX:USDJPY", "displayName": "USD/JPY" }
              ]
            },
            {
              "originalName": "Crypto",
              "symbols": [
                { "name": "BINANCE:BTCUSDT", "displayName": "Bitcoin" },
                { "name": "BINANCE:ETHUSDT", "displayName": "Ethereum" },
                { "name": "BINANCE:SOLUSDT", "displayName": "Solana" }
              ]
            }
          ],
          "showSymbolLogo": true,
          "colorTheme": "dark",
          "isTransparent": true,
          "locale": "en"
        }`;
      if (container.current) {
        container.current.innerHTML = "";
        container.current.appendChild(script);
      }
    },
    []
  );

  return (
    <div className="tradingview-widget-container h-full w-full" ref={container}>
      <div className="tradingview-widget-container__widget h-full w-full"></div>
    </div>
  );
}

export default memo(WatchlistWidget);
