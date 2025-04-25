import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const fetchStaticData = async () => {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets",
      {
        params: {
          vs_currency: "inr",
          ids: "bitcoin,ethereum,tether,ripple,binancecoin,solana,cardano,polkadot,dogecoin,litecoin,chainlink,uniswap,stellar,vechain,shiba-inu,tron,wrapped-bitcoin,bitcoin-cash,aptos,arbitrum,avalanche,near,cosmos,monero,algorand,tezos,hedera,elrond,theta,zcash,neo,iota,terra-luna,curve-dao-token,flow,klay-token,mina,sandbox,decentraland,render,axie-infinity,casper,conflux,fantom,injective,optimism",
          per_page: 100,
          sparkline: true,
          price_change_percentage: "1h,24h,7d",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data from CoinGecko:", error);
    return [];
  }
};

const Crypto = () => {
  const [assets, setAssets] = useState([]);
  const [livePrices, setLivePrices] = useState({});

  
  useEffect(() => {
    const getStaticData = async () => {
      const data = await fetchStaticData();
      setAssets(data);
    };

    getStaticData();
  }, []);

  // webSocket for live price updates from CoinCap
  useEffect(() => {
    const socket = new WebSocket("wss://ws.coincap.io/prices?assets=bitcoin,ethereum,tether,ripple,binancecoin,solana,cardano,polkadot,dogecoin,litecoin,chainlink,uniswap,stellar,vechain,shiba-inu,tron,wrapped-bitcoin,bitcoin-cash,aptos,arbitrum,avalanche,near,cosmos,monero,algorand,tezos,hedera,elrond,theta,zcash,neo,iota,terra-luna,curve-dao-token,flow,klay-token,mina,sandbox,decentraland,render,axie-infinity,casper,conflux,fantom,injective,optimism");

    socket.onmessage = (event) => {
      const updatedPrices = JSON.parse(event.data);
      setLivePrices(updatedPrices);
    };

    return () => socket.close();
  }, []);


  //  static data from CoinGecko and live prices from WebSocket
  const getAssetData = (id) => {
    const staticData = assets.find((asset) => asset.id === id);
    return staticData
      ? {
          ...staticData,
          price: livePrices[id] ? parseFloat(livePrices[id]).toFixed(3) : staticData.current_price.toFixed(3),
        }
      : null;
  };

  return (
    <div className="mt-3 p-2 overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead className="text-left text-sm italic">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Price</th>
            <th>1h %</th>
            <th>24h %</th>
            <th>7d %</th>
            <th>Market Cap</th>
            <th>Volume(24h)</th>
            <th>Circulating Supply</th>
            <th>Last 7 Days</th>
          </tr>
        </thead>

        <tbody>
          {assets.map((asset, index) => {
            const assetData = getAssetData(asset.id);
            if (!assetData) return null;

            return (
              <tr key={asset.id} className="border-t border-gray-600 text-sm hover:bg-gray-800 hover:cursor-pointer">
                
                <td>{index + 1}</td>

                <td className="flex items-center gap-4 py-6">
                  <img src={assetData.image} alt={assetData.symbol} className="w-5 h-5" />
                  {assetData.name} <span className="text-gray-500">{assetData.symbol.toUpperCase()}</span>
                </td>

                <td>₹{assetData.price}</td>
                <td className={
                    assetData.price_change_percentage_1h_in_currency >= 0 ? 
                        "text-green-500" : "text-red-500"}>
                  {assetData.price_change_percentage_1h_in_currency?.toFixed(2)}%
                </td>

                <td className={
                    assetData.price_change_percentage_24h_in_currency >= 0 ? 
                        "text-green-500" : "text-red-500" }>
                  {assetData.price_change_percentage_24h_in_currency?.toFixed(2)}%
                </td>

                <td className={
                    assetData.price_change_percentage_7d_in_currency >= 0 ? 
                        "text-green-500" : "text-red-500" }>
                  {assetData.price_change_percentage_7d_in_currency?.toFixed(2)}%
                </td>

                <td>₹{assetData.market_cap.toLocaleString()}</td>
                <td>₹{assetData.total_volume.toLocaleString()}</td>
                <td>{Number(assetData.circulating_supply).toLocaleString()} {assetData.symbol.toUpperCase()}</td>

                <td style={{ width: "80px" }}>
                  <Line
                    data={{
                      labels: assetData.sparkline_in_7d.price.map((_, i) => i),
                      datasets: [
                        {
                          data: assetData.sparkline_in_7d.price,
                          borderColor: "green",
                          borderWidth: 1.5,
                          pointRadius: 0,
                          tension: 0.4,
                          fill: false,
                        },
                      ],
                    }}
                    options={{
                      plugins: { legend: { display: false } },
                      elements: { point: { radius: 0 } },
                      scales: {
                        x: { display: false },
                        y: { display: false },
                      },
                    }}
                    height={40}
                  />
                </td>
                
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Crypto;
