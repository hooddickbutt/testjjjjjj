import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  Link,
  Route,
  Switch,
  Router as WouterRouter,
  useLocation,
  useRoute,
} from "wouter";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownUp,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronDown,
  CircleDollarSign,
  ExternalLink,
  Gem,
  Grid2X2,
  Layers,
  LayoutDashboard,
  Menu,
  Minus,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet,
  X,
  Zap,
} from "lucide-react";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

type Rarity = "Common" | "Uncommon" | "Rare" | "Legendary";
type NFT = {
  id: number;
  name: string;
  rarity: Rarity;
  value: number;
  variant: number;
  staked?: boolean;
};
const starterNFTs: NFT[] = [
  { id: 184, name: "Signal / 184", rarity: "Rare", value: 214, variant: 1 },
  { id: 311, name: "Signal / 311", rarity: "Uncommon", value: 142, variant: 2 },
];
const collectionNFTs: NFT[] = [
  { id: 184, name: "Signal / 184", rarity: "Rare", value: 214, variant: 1 },
  { id: 311, name: "Signal / 311", rarity: "Uncommon", value: 142, variant: 2 },
  {
    id: 527,
    name: "Signal / 527",
    rarity: "Legendary",
    value: 1280,
    variant: 3,
  },
  { id: 608, name: "Signal / 608", rarity: "Common", value: 86, variant: 4 },
  { id: 742, name: "Signal / 742", rarity: "Rare", value: 282, variant: 5 },
  { id: 803, name: "Signal / 803", rarity: "Uncommon", value: 119, variant: 6 },
  { id: 918, name: "Signal / 918", rarity: "Common", value: 78, variant: 7 },
  { id: 1024, name: "Signal / 1024", rarity: "Rare", value: 345, variant: 8 },
];
const rarityColors: Record<Rarity, string> = {
  Common: "#a9aba1",
  Uncommon: "#d4ff00",
  Rare: "#67c8d4",
  Legendary: "#cf83ff",
};

function ArtTile({
  variant = 1,
  large = false,
}: {
  variant?: number;
  large?: boolean;
}) {
  const hue = [
    "#d4ff00",
    "#64d6c9",
    "#e58bff",
    "#ffb862",
    "#67c8d4",
    "#e4e5db",
    "#ff718c",
    "#b7a6ff",
  ][variant % 8];
  const second = [
    "#24290e",
    "#142b2a",
    "#2c1832",
    "#342211",
    "#112a34",
    "#292a21",
    "#35141e",
    "#241e39",
  ][variant % 8];
  const id = `art-${variant}-${large ? "large" : "small"}`;
  return (
    <svg
      className="art-svg"
      viewBox="0 0 320 320"
      role="img"
      aria-label={`MINI CORE artwork ${variant}`}
    >
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor={second} />
          <stop offset="1" stopColor="#101116" />
        </linearGradient>
        <linearGradient id={`${id}-body`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor={hue} />
          <stop offset=".48" stopColor="#f3f1df" />
          <stop offset="1" stopColor={hue} />
        </linearGradient>
        <filter id={`${id}-shadow`}>
          <feDropShadow
            dx="0"
            dy="10"
            stdDeviation="8"
            floodColor="#000"
            floodOpacity=".6"
          />
        </filter>
      </defs>
      <rect width="320" height="320" rx="20" fill={`url(#${id}-bg)`} />
      <path
        d={`M0 ${70 + variant * 7}L320 ${20 + variant * 11}M-30 ${255 - variant * 8}L280 0`}
        stroke={hue}
        strokeOpacity=".2"
        strokeWidth="1"
      />
      <circle
        cx={66 + variant * 9}
        cy={58 + variant * 5}
        r="31"
        fill={hue}
        opacity=".12"
      />
      <g
        filter={`url(#${id}-shadow)`}
        transform={`rotate(${variant % 2 ? -3 : 3} 160 167)`}
      >
        <path
          d="M89 138 Q93 75 160 67 Q227 75 231 138 L220 232 Q199 257 160 265 Q121 257 100 232Z"
          fill={`url(#${id}-body)`}
        />
        <path
          d="M99 144 Q112 104 160 100 Q208 104 221 144 L215 201 Q197 231 160 238 Q123 231 105 201Z"
          fill="#17171d"
          opacity=".94"
        />
        <path
          d="M105 132 Q113 94 160 88 Q207 94 215 132"
          fill="none"
          stroke={hue}
          strokeWidth="5"
        />
        <path
          d="M120 162 Q140 149 160 162 Q180 149 200 162"
          fill="none"
          stroke={hue}
          strokeWidth="7"
          strokeLinecap="round"
        />
        <circle cx="136" cy="179" r="8" fill={hue} />
        <circle cx="184" cy="179" r="8" fill={hue} />
        <path
          d="M137 211 Q160 224 183 211"
          fill="none"
          stroke="#f1f0df"
          strokeOpacity=".68"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M98 155L74 177L102 185M222 155L246 177L218 185"
          fill="none"
          stroke={hue}
          strokeWidth="5"
        />
      </g>
      <text
        x="22"
        y="291"
        fill={hue}
        opacity=".8"
        fontFamily="monospace"
        fontSize="9"
      >
        MINI / CORE — {String(variant).padStart(2, "0")}
      </text>
    </svg>
  );
}

function useDemoState() {
  const [nfts, setNfts] = useState<NFT[]>(() => {
    try {
      return (
        JSON.parse(localStorage.getItem("mini-nfts") || "null") || starterNFTs
      );
    } catch {
      return starterNFTs;
    }
  });
  const [toast, setToast] = useState("");
  const [rewards, setRewards] = useState(() =>
    Number(localStorage.getItem("mini-rewards") || "18.42"),
  );
  useEffect(() => {
    localStorage.setItem("mini-nfts", JSON.stringify(nfts));
  }, [nfts]);
  useEffect(() => {
    localStorage.setItem("mini-rewards", String(rewards));
  }, [rewards]);
  const flash = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2800);
  };
  const mint = (quantity: number) => {
    const start = 1100 + nfts.length * 13;
    const minted = Array.from({ length: quantity }, (_, index) => ({
      id: start + index,
      name: `Signal / ${start + index}`,
      rarity: (index % 5 === 0 ? "Rare" : "Uncommon") as Rarity,
      value: index % 5 === 0 ? 248 : 137,
      variant: (start + index) % 8,
    }));
    setNfts((current) => [...minted, ...current]);
    flash(`${quantity} MINI CORE ${quantity === 1 ? "NFT" : "NFTs"} minted`);
  };
  const toggleStake = (id: number) =>
    setNfts((current) =>
      current.map((nft) =>
        nft.id === id ? { ...nft, staked: !nft.staked } : nft,
      ),
    );
  const claim = () => {
    setRewards(0);
    flash("18.42 MINI rewards claimed to your wallet");
  };
  return { nfts, toast, rewards, mint, toggleStake, claim, flash };
}

function Layout({
  children,
  onOpenMenu,
  menuOpen,
}: {
  children: React.ReactNode;
  onOpenMenu: () => void;
  menuOpen: boolean;
}) {
  const [location] = useLocation();
  const nav = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/collection", label: "Collection", icon: Grid2X2 },
    { href: "/staking", label: "Staking", icon: Layers },
  ];
  const openExternalView = (path: string) => {
    const child = window.open(path, "_blank", "noopener,noreferrer");
    if (!child) window.location.href = path;
  };
  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? "open" : ""}`} id="sidebar">
        <div className="brand">
          <div className="brand-mark">M</div>
          <div>
            <div className="brand-name">MINI BROKERS</div>
            <div className="brand-sub">COLLECTOR TERMINAL</div>
          </div>
        </div>
        <div className="nav-label">Workspace</div>
        {nav.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`nav-link ${location === href ? "active" : ""}`}
            data-testid={`link-${label.toLowerCase()}`}
          >
            <Icon />
            <span>{label}</span>
          </Link>
        ))}
        <div className="nav-label" style={{ marginTop: 27 }}>
          Trade
        </div>
        <button
          className="nav-link"
          onClick={() => openExternalView("/buy")}
          data-testid="button-open-buy"
        >
          <CircleDollarSign />
          <span>Buy MINI</span>
          <ArrowRight style={{ marginLeft: "auto", width: 12 }} />
        </button>
        <button
          className="nav-link"
          onClick={() => openExternalView("/sell")}
          data-testid="button-open-sell"
        >
          <TrendingUp />
          <span>Sell MINI</span>
          <ArrowRight style={{ marginLeft: "auto", width: 12 }} />
        </button>
        <div className="side-bottom">
          <div className="wallet-box">
            <div className="wallet-label">Connected wallet</div>
            <div className="wallet-address">0x7F2a...91bC</div>
            <div className="wallet-status">
              <span className="pulse" /> Demo mode active
            </div>
          </div>
          <div className="brand-sub" style={{ margin: "18px 11px 0" }}>
            BUILD 0.8.14 / ETH MAINNET
          </div>
        </div>
      </aside>
      <main className="main">
        <header className="topbar">
          <div className="top-left">
            <button
              className="mobile-menu"
              onClick={onOpenMenu}
              aria-label="Open navigation"
              data-testid="button-mobile-menu"
            >
              <Menu />
            </button>
            <div className="ticker">
              <span className="ticker-up">▲</span> MINI / ETH{" "}
              <strong>$0.0842</strong>
              <span className="ticker-up">+12.6%</span>
            </div>
          </div>
          <div className="top-actions">
            <div className="network-chip">
              ETHEREUM{" "}
              <span
                className="pulse"
                style={{ display: "inline-block", marginLeft: 4 }}
              />
            </div>
            <button className="address-btn" data-testid="button-wallet">
              0x7F2a...91bC
            </button>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}

function Dashboard({
  state,
  go,
}: {
  state: ReturnType<typeof useDemoState>;
  go: (path: string) => void;
}) {
  const [quantity, setQuantity] = useState(1);
  const [art, setArt] = useState(3);
  useEffect(() => {
    const timer = window.setInterval(
      () => setArt((current) => (current >= 8 ? 1 : current + 1)),
      4200,
    );
    return () => window.clearInterval(timer);
  }, []);
  const staked = state.nfts.filter((nft) => nft.staked).length;
  return (
    <div className="content">
      <div className="eyebrow">
        <b>●</b> Live collection / block 19,482,771
      </div>
      <h1 className="page-heading">
        Own the signal.
        <br />
        <em>Trade the culture.</em>
      </h1>
      <p className="page-intro">
        MINI BROKERS is a collectible-first terminal for the MINI ecosystem.
        Mint a signal, put it to work, and keep your eye on rarity.
      </p>
      <div className="dashboard-grid">
        <section className="panel mint-panel">
          <div className="panel-head">
            <div>
              <div className="panel-kicker">Primary drop / now minting</div>
              <div className="panel-title">MINI CORE</div>
            </div>
            <div className="rarity-pill">
              <span className="rarity-dot" />{" "}
              {art % 5 === 0 ? "Rare signal" : "Uncommon signal"}
            </div>
          </div>
          <div className="mint-body">
            <div className="art-stage">
              <div className="art-glow" />
              <div className="art-index">
                CORE / {String(art).padStart(2, "0")}
              </div>
              <ArtTile variant={art} large />
              <div className="art-live">
                <span className="pulse" /> Artwork shifts every 4.2s
              </div>
            </div>
            <div className="mint-copy">
              <div className="panel-kicker">Generative collectible</div>
              <h2>Meet your signal.</h2>
              <p>
                One collection. Infinite personality. Each MINI CORE is
                animated, tradeable, and built to compound with the ecosystem.
              </p>
              <div style={{ marginTop: 20 }}>
                <div className="price-label">Mint price</div>
                <div className="price">
                  100 MINI{" "}
                  <span className="muted" style={{ fontSize: 12 }}>
                    + 1 NFT
                  </span>
                </div>
              </div>
              <div className="mint-meta">
                <div>
                  <div className="price-label">Quantity</div>
                  <div className="quantity" style={{ marginTop: 7 }}>
                    <button
                      className="qty-btn"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      data-testid="button-decrease-quantity"
                    >
                      <Minus size={13} />
                    </button>
                    <span
                      className="qty-number"
                      data-testid="text-mint-quantity"
                    >
                      {quantity}
                    </span>
                    <button
                      className="qty-btn"
                      onClick={() => setQuantity(Math.min(5, quantity + 1))}
                      data-testid="button-increase-quantity"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="price-label">Total</div>
                  <div
                    className="mono"
                    style={{ color: "#d4ff00", marginTop: 7, fontSize: 12 }}
                  >
                    {quantity * 100} MINI
                  </div>
                </div>
              </div>
              <button
                className="primary-btn mint-button"
                onClick={() => state.mint(quantity)}
                data-testid="button-mint-nft"
              >
                <Sparkles
                  size={14}
                  style={{ verticalAlign: "middle", marginRight: 7 }}
                />{" "}
                Mint {quantity > 1 ? `${quantity} NFTs` : "NFT"}
              </button>
            </div>
          </div>
        </section>
        <section className="panel market-card">
          <div className="panel-head">
            <div>
              <div className="panel-kicker">Market pulse</div>
              <div className="panel-title">Your terminal</div>
            </div>
            <RefreshCw size={15} className="muted" />
          </div>
          <div className="market-list">
            <div className="market-row">
              <div className="market-name">
                <div className="token-icon">M</div>
                <div>
                  <strong>MINI</strong>
                  <div
                    className="muted mono"
                    style={{ fontSize: 9, marginTop: 3 }}
                  >
                    MINI TOKEN
                  </div>
                </div>
              </div>
              <div className="market-value">
                $0.0842<small>+12.6%</small>
              </div>
            </div>
            <div className="market-row">
              <div className="market-name">
                <div className="token-icon eth">Ξ</div>
                <div>
                  <strong>ETH</strong>
                  <div
                    className="muted mono"
                    style={{ fontSize: 9, marginTop: 3 }}
                  >
                    ETHEREUM
                  </div>
                </div>
              </div>
              <div className="market-value">
                $3,482.10<small>+2.4%</small>
              </div>
            </div>
            <div className="market-row">
              <div className="market-name">
                <Wallet size={17} className="muted" />
                <div>
                  <strong>Owned NFTs</strong>
                  <div
                    className="muted mono"
                    style={{ fontSize: 9, marginTop: 3 }}
                  >
                    MINI CORE
                  </div>
                </div>
              </div>
              <div className="market-value" data-testid="text-owned-count">
                {state.nfts.length}
                <small>{staked} staked</small>
              </div>
            </div>
          </div>
          <button
            className="lime-btn buy-mini"
            onClick={() => {
              const child = window.open(
                "/buy",
                "_blank",
                "noopener,noreferrer",
              );
              if (!child) go("/buy");
            }}
            data-testid="button-buy-mini"
          >
            <CircleDollarSign
              size={14}
              style={{ verticalAlign: "middle", marginRight: 6 }}
            />{" "}
            Buy MINI
          </button>
        </section>
      </div>
      <div className="stats-grid">
        <div className="panel stat-card">
          <div className="stat-label">MINI balance</div>
          <div className="stat-value">4,820</div>
          <div className="stat-foot">≈ $406.04</div>
        </div>
        <div className="panel stat-card">
          <div className="stat-label">Portfolio value</div>
          <div className="stat-value">$1,284</div>
          <div className="stat-foot lime-text">+18.9% this week</div>
        </div>
        <div className="panel stat-card">
          <div className="stat-label">Total minted</div>
          <div className="stat-value" data-testid="text-total-minted">
            {1248 + state.nfts.length - starterNFTs.length}
          </div>
          <div className="stat-foot">of 4,444 total supply</div>
        </div>
        <div className="panel stat-card">
          <div className="stat-label">Floor price</div>
          <div className="stat-value">
            0.48 <span style={{ fontSize: 12 }}>ETH</span>
          </div>
          <div className="stat-foot">+0.06 ETH / 24h</div>
        </div>
      </div>
      <div className="marquee-wrap">
        <div className="marquee">
          <span>
            <b>MINI CORE</b> / 4,444 SIGNALS
          </span>
          <span>
            FLOOR <b>0.48 ETH</b>
          </span>
          <span>
            STAKED <b>{staked + 392} / 1,248</b>
          </span>
          <span>
            REWARDS APY <b>18.4%</b>
          </span>
          <span>
            <b>MINI CORE</b> / 4,444 SIGNALS
          </span>
          <span>
            FLOOR <b>0.48 ETH</b>
          </span>
          <span>
            STAKED <b>{staked + 392} / 1,248</b>
          </span>
          <span>
            REWARDS APY <b>18.4%</b>
          </span>
        </div>
      </div>
      <section>
        <div className="section-row">
          <div>
            <h2 className="section-heading">My NFTs</h2>
            <div className="section-note" style={{ marginTop: 5 }}>
              Your collection, on-chain
            </div>
          </div>
          <Link
            href="/staking"
            className="outline-btn small-btn"
            data-testid="link-stake-nfts"
          >
            Manage staking{" "}
            <ArrowRight
              size={12}
              style={{ verticalAlign: "middle", marginLeft: 4 }}
            />
          </Link>
        </div>
        <div className="nft-grid">
          {state.nfts.slice(0, 4).map((nft) => (
            <NFTCard key={nft.id} nft={nft} />
          ))}
        </div>
      </section>
    </div>
  );
}

function NFTCard({
  nft,
  selectable = false,
  selected = false,
  onSelect,
}: {
  nft: NFT;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: () => void;
}) {
  return (
    <div
      className={`panel nft-card ${selectable ? "select-card" : ""} ${selected ? "selected" : ""}`}
      onClick={onSelect}
      data-testid={`card-nft-${nft.id}`}
    >
      <div className="nft-card-art">
        <ArtTile variant={nft.variant} />
        <div className="nft-market-overlay">
          <span>MINI CORE</span>
          <span className="nft-heart">♡</span>
        </div>
        <div
          className="nft-rarity-badge"
          style={{
            color: rarityColors[nft.rarity],
            borderColor: `${rarityColors[nft.rarity]}66`,
          }}
        >
          {nft.rarity}
        </div>
        <div className="select-indicator">
          {selected && <Check size={13} />}
        </div>
      </div>
      <div className="nft-info">
        <div className="nft-title-row">
          <div>
            <span className="nft-title">MINI CORE</span>
            <div className="nft-collection">MINI BROKERS</div>
          </div>
          <span className="nft-id">#{nft.id}</span>
        </div>
        <div className="nft-market-meta">
          <div>
            <span className="nft-meta-label">Price</span>
            <strong>{nft.value} MINI</strong>
          </div>
          <div className="nft-trend">LIVE</div>
        </div>
        {!selectable && (
          <a
            className="opensea-link"
            href="https://opensea.io/"
            target="_blank"
            rel="noreferrer"
            onClick={(event) => event.stopPropagation()}
            data-testid={`link-opensea-${nft.id}`}
          >
            View on OpenSea <ExternalLink size={10} />
          </a>
        )}
      </div>
    </div>
  );
}

function SwapView({
  mode,
  go,
  flash,
}: {
  mode: "buy" | "sell";
  go: (path: string) => void;
  flash: (message: string) => void;
}) {
  const isBuy = mode === "buy";
  const [amount, setAmount] = useState("");
  const [flipped, setFlipped] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const value = Number(amount) || 0;
  const topToken = isBuy !== flipped ? "ETH" : "MINI";
  const bottomToken = topToken === "ETH" ? "MINI" : "ETH";
  const received = topToken === "ETH" ? value * 118.76 : value * 0.0842;
  const setPercent = (percentage: number) =>
    setAmount(
      ((topToken === "ETH" ? 1.8 : 2500) * percentage).toFixed(
        topToken === "ETH" ? 3 : 2,
      ),
    );
  const trade = () => {
    setConfirmed(true);
    flash(`${isBuy ? "Buy" : "Sell"} demo confirmed — no transaction was sent`);
  };
  return (
    <div className="content">
      <div className="view-head">
        <div>
          <div className="eyebrow">
            <b>●</b> Demo exchange / {isBuy ? "acquire MINI" : "exit MINI"}
          </div>
          <h1 className="page-heading">
            {isBuy ? "Buy MINI." : "Sell MINI."}
            <br />
            <em>Keep it moving.</em>
          </h1>
          <p className="page-intro">
            A clean route into the MINI economy. This is a simulated swap
            interface — nothing will be broadcast to the network.
          </p>
        </div>
        <div className="view-head-actions">
          <button
            className="outline-btn"
            onClick={() => go("/")}
            data-testid="button-home"
          >
            <ArrowLeft
              size={13}
              style={{ verticalAlign: "middle", marginRight: 5 }}
            />{" "}
            Home
          </button>
        </div>
      </div>
      <div className="view-grid">
        <div className={`swap-frame ${isBuy ? "buy-swap-frame" : ""}`}>
          <div className="swap-topline">
            {isBuy ? (
              <div className="uniswap-brand">
                <span className="uniswap-orb">U</span>
                <div>
                  <div className="uniswap-name">UNISWAP</div>
                  <div className="uniswap-route">MINI ROUTER</div>
                </div>
              </div>
            ) : (
              <div className="swap-title">Swap from MINI</div>
            )}
            <span className="demo-label">DEMO ONLY</span>
          </div>
          <div className="swap-box">
            <div className="swap-box-label">
              <span>You pay</span>
              <span>
                Balance: {topToken === "ETH" ? "1.84 ETH" : "4,820 MINI"}
              </span>
            </div>
            <div className="swap-input-row">
              <input
                className="swap-input"
                value={amount}
                onChange={(event) => {
                  setAmount(event.target.value);
                  setConfirmed(false);
                }}
                placeholder="0.00"
                inputMode="decimal"
                data-testid="input-swap-amount"
              />
              <Token token={topToken} />
            </div>
          </div>
          <button
            className="swap-switch"
            onClick={() => setFlipped(!flipped)}
            aria-label="Flip tokens"
            data-testid="button-flip-tokens"
          >
            <ArrowDownUp size={14} />
          </button>
          <div className="swap-box">
            <div className="swap-box-label">
              <span>You receive</span>
              <span>Estimated</span>
            </div>
            <div className="swap-input-row">
              <input
                className="swap-input"
                value={
                  value ? received.toFixed(topToken === "ETH" ? 2 : 4) : ""
                }
                readOnly
                placeholder="0.00"
                data-testid="input-estimated-received"
              />
              <Token token={bottomToken} />
            </div>
          </div>
          <div className="percentage-row">
            {[25, 50, 75, 100].map((percentage) => (
              <button
                className="percentage"
                key={percentage}
                onClick={() => setPercent(percentage / 100)}
                data-testid={`button-percentage-${percentage}`}
              >
                {percentage}%
              </button>
            ))}
          </div>
          <div className="swap-quote">
            <span>Rate</span>
            <strong>
              1 {topToken} = {topToken === "ETH" ? "118.76 MINI" : "0.0842 ETH"}
            </strong>
          </div>
          <button
            className="lime-btn swap-action"
            onClick={trade}
            disabled={!value}
            data-testid={`button-${mode}-mini`}
          >
            {isBuy ? "Buy MINI" : "Sell MINI"}{" "}
            <ArrowRight
              size={14}
              style={{ verticalAlign: "middle", marginLeft: 7 }}
            />
          </button>
          {confirmed && (
            <div className="confirmation">
              <BadgeCheck size={16} /> Demo complete. Your wallet was not
              charged.
            </div>
          )}
        </div>
        <aside>
          <div className="panel info-panel">
            <h3>Swap details</h3>
            <div className="info-line">
              <span>Network</span>
              <strong>Ethereum</strong>
            </div>
            <div className="info-line">
              <span>Route</span>
              <strong>
                {topToken} → {bottomToken}
              </strong>
            </div>
            <div className="info-line">
              <span>Fee</span>
              <strong>0.30%</strong>
            </div>
            <div className="info-line">
              <span>Slippage</span>
              <strong>0.50%</strong>
            </div>
            <div className="notice">
              <ShieldCheck
                size={14}
                style={{
                  color: "#d4ff00",
                  verticalAlign: "middle",
                  marginRight: 6,
                }}
              />{" "}
              This terminal is a product demo. Quotes are illustrative and
              trades never leave your browser.
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Token({ token }: { token: string }) {
  return (
    <div className="token-selector">
      {token === "ETH" ? (
        <span className="token-eth">Ξ</span>
      ) : (
        <span className="token-mini">M</span>
      )}{" "}
      {token}
      <ChevronDown size={13} />
    </div>
  );
}

function CollectionView({ nfts: _nfts }: { nfts: NFT[] }) {
  return (
    <div className="content">
      <div className="view-head">
        <div>
          <div className="eyebrow">
            <b>●</b> The archive / MINI CORE
          </div>
          <h1 className="page-heading">
            Read the <em>rarity.</em>
          </h1>
          <p className="page-intro">
            4,444 animated signals, built from a finite set of traits. Browse
            the live collection and find the outliers.
          </p>
        </div>
        <div className="view-head-actions">
          <a
            className="lime-btn"
            href="https://opensea.io/"
            target="_blank"
            rel="noreferrer"
            data-testid="link-opensea-collection"
          >
            View on OpenSea{" "}
            <ExternalLink
              size={13}
              style={{ verticalAlign: "middle", marginLeft: 5 }}
            />
          </a>
        </div>
      </div>
      <div className="rarity-grid">
        {(["Common", "Uncommon", "Rare", "Legendary"] as Rarity[]).map(
          (rarity) => (
            <div className="panel rarity-card" key={rarity}>
              <div
                className="rarity-name"
                style={{ color: rarityColors[rarity] }}
              >
                {rarity}
              </div>
              <div className="rarity-count">
                {rarity === "Common"
                  ? "2,041"
                  : rarity === "Uncommon"
                    ? "1,421"
                    : rarity === "Rare"
                      ? "742"
                      : "240"}
              </div>
              <div className="rarity-percent">
                {rarity === "Common"
                  ? "45.9%"
                  : rarity === "Uncommon"
                    ? "32.0%"
                    : rarity === "Rare"
                      ? "16.7%"
                      : "5.4%"}{" "}
                of collection
              </div>
            </div>
          ),
        )}
      </div>
      <div className="collection-layout" style={{ marginTop: 38 }}>
        <div>
          <div className="section-row" style={{ marginTop: 0 }}>
            <div>
              <h2 className="section-heading">Browse collection</h2>
              <div className="section-note" style={{ marginTop: 5 }}>
                Live snapshots from the archive
              </div>
            </div>
            <div className="section-note">
              <Search
                size={13}
                style={{ verticalAlign: "middle", marginRight: 5 }}
              />{" "}
              4,444 items
            </div>
          </div>
          <div className="nft-grid">
            {collectionNFTs.map((nft) => (
              <NFTCard nft={nft} key={nft.id} />
            ))}
          </div>
        </div>
        <aside className="panel collection-aside">
          <h3>Collection health</h3>
          <div className="collection-stat">
            <span>Total minted</span>
            <strong>
              1,248{" "}
              <small className="muted mono" style={{ fontSize: 10 }}>
                / 4,444
              </small>
            </strong>
          </div>
          <div className="collection-stat">
            <span>Total staked</span>
            <strong>
              392{" "}
              <small className="muted mono" style={{ fontSize: 10 }}>
                31.4%
              </small>
            </strong>
          </div>
          <div className="collection-stat">
            <span>Collection floor</span>
            <strong>0.48 ETH</strong>
          </div>
          <div className="collection-stat">
            <span>Volume traded</span>
            <strong>1,842 ETH</strong>
          </div>
          <a
            className="outline-btn"
            href="https://opensea.io/"
            target="_blank"
            rel="noreferrer"
            data-testid="link-collection-opensea"
          >
            Open collection{" "}
            <ExternalLink
              size={12}
              style={{ verticalAlign: "middle", marginLeft: 5 }}
            />
          </a>
        </aside>
      </div>
    </div>
  );
}

function StakingView({
  state,
  go,
}: {
  state: ReturnType<typeof useDemoState>;
  go: (path: string) => void;
}) {
  const [selected, setSelected] = useState<number[]>([]);
  const owned = state.nfts.filter((nft) => !nft.staked);
  const staked = state.nfts.filter((nft) => nft.staked);
  const toggle = (id: number) =>
    setSelected((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id],
    );
  const stakeSelected = () => {
    selected.forEach(state.toggleStake);
    setSelected([]);
    state.flash(
      `${selected.length} NFT${selected.length === 1 ? "" : "s"} moved into the vault`,
    );
  };
  const unstakeSelected = () => {
    selected.forEach(state.toggleStake);
    setSelected([]);
    state.flash(
      `${selected.length} NFT${selected.length === 1 ? "" : "s"} returned to your collection`,
    );
  };
  return (
    <div className="content">
      <div className="view-head">
        <div>
          <div className="eyebrow">
            <b>●</b> Yield desk / MINI CORE
          </div>
          <h1 className="page-heading">
            Put your signals
            <br />
            <em>to work.</em>
          </h1>
          <p className="page-intro">
            Lock owned NFTs into the MINI vault. You keep the collectible and
            earn a stream of MINI at the current protocol rate.
          </p>
        </div>
        <div className="view-head-actions">
          <button
            className="outline-btn"
            onClick={() => go("/")}
            data-testid="button-staking-home"
          >
            <ArrowLeft
              size={13}
              style={{ verticalAlign: "middle", marginRight: 5 }}
            />{" "}
            Home
          </button>
          <button
            className="lime-btn"
            onClick={() => {
              const child = window.open(
                "/sell",
                "_blank",
                "noopener,noreferrer",
              );
              if (!child) go("/sell");
            }}
            data-testid="button-staking-sell"
          >
            Sell MINI{" "}
            <ArrowRight
              size={13}
              style={{ verticalAlign: "middle", marginLeft: 4 }}
            />
          </button>
        </div>
      </div>
      <div className="stake-header">
        <div className="stake-banner">
          <h2>MINI Vault / 18.4% APY</h2>
          <p>Collect, stake, and let the protocol do the accounting.</p>
        </div>
        <div className="stake-mini-stats">
          <div className="panel stake-stat">
            <div className="stat-label">Total staked</div>
            <div className="stat-value" data-testid="text-staked-count">
              {392 + staked.length}
            </div>
            <div className="stat-foot">NFTs</div>
          </div>
          <div className="panel stake-stat">
            <div className="stat-label">Your vault</div>
            <div className="stat-value">{staked.length}</div>
            <div className="stat-foot">NFTs</div>
          </div>
          <div className="panel stake-stat">
            <div className="stat-label">Pending</div>
            <div className="stat-value">{state.rewards.toFixed(2)}</div>
            <div className="stat-foot">MINI</div>
          </div>
        </div>
      </div>
      <div className="select-toolbar">
        <div>
          <h2 className="section-heading" style={{ fontSize: 18 }}>
            Your vault
          </h2>
          <div className="section-note" style={{ marginTop: 5 }}>
            {owned.length
              ? "Select owned NFTs to stake"
              : "Everything is currently earning"}
          </div>
        </div>
        <div className="stake-actions">
          {staked.length > 0 && (
            <button
              className="outline-btn small-btn"
              onClick={() => setSelected(staked.map((nft) => nft.id))}
              data-testid="button-select-staked"
            >
              Select staked
            </button>
          )}
          <button
            className="lime-btn small-btn"
            disabled={selected.length === 0}
            onClick={
              selected.some((id) => staked.some((nft) => nft.id === id))
                ? unstakeSelected
                : stakeSelected
            }
            data-testid="button-stake-selected"
          >
            {selected.some((id) => staked.some((nft) => nft.id === id))
              ? "Unstake selected"
              : "Stake selected"}{" "}
            ({selected.length})
          </button>
          <button
            className="lime-btn small-btn"
            onClick={state.claim}
            disabled={state.rewards <= 0}
            data-testid="button-claim-rewards"
          >
            <Zap
              size={12}
              style={{ verticalAlign: "middle", marginRight: 4 }}
            />{" "}
            Claim rewards
          </button>
        </div>
      </div>
      {state.nfts.length ? (
        <div className="nft-grid">
          {state.nfts.map((nft) => (
            <NFTCard
              nft={nft}
              key={nft.id}
              selectable
              selected={selected.includes(nft.id)}
              onSelect={() => toggle(nft.id)}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Gem size={24} />
          <p>Your vault is waiting for its first MINI CORE.</p>
          <button
            className="lime-btn"
            onClick={() => go("/")}
            data-testid="button-empty-mint"
          >
            Mint your first NFT
          </button>
        </div>
      )}
      <div className="panel notice" style={{ marginTop: 25 }}>
        <ShieldCheck
          size={15}
          style={{ color: "#d4ff00", verticalAlign: "middle", marginRight: 6 }}
        />{" "}
        Staking is simulated in this demo. Assets stay in your local browser and
        no wallet transaction is created.
      </div>
    </div>
  );
}

function RouterView({ state }: { state: ReturnType<typeof useDemoState> }) {
  const [, setLocation] = useLocation();
  const go = (path: string) => setLocation(path);
  return (
    <Switch>
      <Route path="/" component={() => <Dashboard state={state} go={go} />} />
      <Route
        path="/buy"
        component={() => <SwapView mode="buy" go={go} flash={state.flash} />}
      />
      <Route
        path="/sell"
        component={() => <SwapView mode="sell" go={go} flash={state.flash} />}
      />
      <Route
        path="/collection"
        component={() => <CollectionView nfts={state.nfts} />}
      />
      <Route
        path="/staking"
        component={() => <StakingView state={state} go={go} />}
      />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const state = useDemoState();
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <div
            onClick={(event) => {
              if ((event.target as HTMLElement).closest(".nav-link"))
                setMenuOpen(false);
            }}
          >
            <Layout menuOpen={menuOpen} onOpenMenu={() => setMenuOpen(true)}>
              {state.toast && (
                <div className="toast" data-testid="status-toast">
                  {state.toast}
                </div>
              )}
              <RouterView state={state} />
            </Layout>
          </div>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
