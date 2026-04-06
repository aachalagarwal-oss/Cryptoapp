import React from "react";
import Image from "next/image";
import DataTable from "./components/DataTable";
import Link from "next/link";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetcher } from "./lib/coingecko.action";

/* -------------------- TYPES -------------------- */

interface TrendingCoin {
  item: {
    id: string;
    name: string;
    symbol: string;
    market_cap_rank: number;
    thumb: string;
    large: string;
    data: {
      price: number;
      price_change_percentage_24h: {
        usd: number;
      };
    };
  };
}

interface CoinDetailsData {
  id: string;
  name: string;
  symbol: string;
  image: {
    large: string;
  };
  market_data: {
    current_price: {
      usd: number;
    };
  };
}

/* -------------------- COLUMNS -------------------- */

const columns: DataTableColumn<TrendingCoin>[] = [
  {
    header: "Name",
    cellClassName: "name-cell",
    cell: (coin) => {
      const item = coin.item;

      return (
        <Link
          href={`/coins/${item.id}`}
          className="flex items-center gap-2"
        >
          <Image
            src={item.large}
            alt={item.name}
            width={36}
            height={36}
          />
          <div>
            <p>{item.name}</p>
            <span className="text-xs text-gray-400 uppercase">
              {item.symbol}
            </span>
          </div>
        </Link>
      );
    },
  },
  {
    header: "24h Change",
    cellClassName: "name-cell",
    cell: (coin) => {
      const change = coin.item.data.price_change_percentage_24h.usd;
      const isTrendingUp = change > 0;

      return (
        <div
          className={cn(
            "flex items-center gap-1",
            isTrendingUp ? "text-green-500" : "text-red-500"
          )}
        >
          {isTrendingUp ? (
            <TrendingUp width={16} height={16} />
          ) : (
            <TrendingDown width={16} height={16} />
          )}
          <span>{change.toFixed(2)}%</span>
        </div>
      );
    },
  },
  {
    header: "Price",
    cellClassName: "price-cell",
    cell: (coin) => {
      const price = coin.item.data.price;
      return <span>${price.toLocaleString()}</span>;
    },
  },
];

/* -------------------- PAGE -------------------- */

const page = async () => {
  // ✅ Fetch Bitcoin details
  const coin = await fetcher<CoinDetailsData>("coins/bitcoin");

  // ✅ Fetch trending coins
  const trending = await fetcher<{ coins: TrendingCoin[] }>(
    "search/trending"
  );

  return (
    <main className="main-container">
      <section className="home-grid">
        {/* Overview */}
        <div id="coin-overview">
          <div className="header pt-2 flex items-center gap-3">
            <Image
              src={coin.image.large}
              alt={coin.name}
              width={56}
              height={56}
            />
            <div className="info">
              <p>
                {coin.name}/{coin.symbol.toUpperCase()}
              </p>
              <h1>
                ${coin.market_data.current_price.usd.toLocaleString()}
              </h1>
            </div>
          </div>
        </div>

        {/* Table */}
        <p className="mt-4">Trending coins</p>

        <DataTable
          data={trending.coins}
          columns={columns}
          rowKey={(row) => row.item.id}
        />
      </section>

      <section className="w-full mt-7 space-y-4">
        <p>Categories</p>
      </section>
    </main>
  );
};

export default page;