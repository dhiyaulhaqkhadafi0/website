"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Search,
  X,
  SlidersHorizontal,
  ArrowDown,
} from "lucide-react";
import { OFFERING_LABELS, type ShopItem } from "@/content/shop";
import {
  discover,
  EMPTY_FILTERS,
  normalizeFilters,
  queryFor,
  readFilters,
  type ShopFilters,
} from "@/lib/shop-discovery";
import { ShopArtwork } from "./ShopArtwork";
import s from "./shop.module.css";
const subscribeHydration = () => () => {};
const clientHydrated = () => true;
const serverHydrated = () => false;
function FilterFields({
  value,
  onChange,
  items,
  mobile = false,
}: {
  value: ShopFilters;
  onChange: (value: ShopFilters) => void;
  items: ShopItem[];
  mobile?: boolean;
}) {
  const scope = items.filter(
    (i) => value.type === "all" || value.type === i.type,
  );
  const topics = [...new Set(scope.map((i) => i.topic))],
    formats = [...new Set(scope.map((i) => i.format))];
  const comparable =
    value.type === "original" && scope.some((i) => i.price !== null);
  const id = mobile ? "mobile" : "desktop";
  return (
    <div className={s.filterFields}>
      {topics.length > 0 && (
        <label htmlFor={`${id}-topic`}>
          Topik
          <select
            id={`${id}-topic`}
            value={value.topic}
            onChange={(e) => onChange({ ...value, topic: e.target.value })}
          >
            <option value="all">Semua topik</option>
            {topics.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
      )}
      {formats.length > 0 && (
        <label htmlFor={`${id}-format`}>
          {value.type === "service" ? "Jenis proyek" : "Format"}
          <select
            id={`${id}-format`}
            value={value.format}
            onChange={(e) => onChange({ ...value, format: e.target.value })}
          >
            <option value="all">
              Semua {value.type === "service" ? "jenis" : "format"}
            </option>
            {formats.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
      )}
      {comparable && (
        <label htmlFor={`${id}-price`}>
          Harga
          <select
            id={`${id}-price`}
            value={value.price}
            onChange={(e) => onChange({ ...value, price: e.target.value })}
          >
            <option value="all">Semua harga</option>
            <option value="free">Gratis</option>
            <option value="paid">Berbayar</option>
          </select>
        </label>
      )}
      <label htmlFor={`${id}-sort`}>
        Urutkan
        <select
          id={`${id}-sort`}
          value={value.sort}
          onChange={(e) => onChange({ ...value, sort: e.target.value })}
        >
          <option value="recommended">Pilihan kurasi</option>
          <option value="newest">Terbaru diperbarui</option>
          {comparable && (
            <>
              <option value="price-asc">Harga terendah</option>
              <option value="price-desc">Harga tertinggi</option>
            </>
          )}
        </select>
      </label>
    </div>
  );
}
export function ShopDiscovery({
  items,
  initial,
  defaultType = "all",
}: {
  items: ShopItem[];
  initial: ShopFilters;
  defaultType?: ShopFilters["type"];
}) {
  const hydrated = useSyncExternalStore(
    subscribeHydration,
    clientHydrated,
    serverHydrated,
  );
  const [filters, setFilters] = useState(initial),
    [input, setInput] = useState(initial.q),
    [draft, setDraft] = useState(initial);
  const field = useRef<HTMLInputElement>(null),
    dialog = useRef<HTMLDialogElement>(null),
    opener = useRef<HTMLButtonElement>(null);
  function update(value: ShopFilters) {
    setFilters(normalizeFilters(value, items));
  }
  useEffect(() => {
    const timer = setTimeout(
      () =>
        setFilters((current) =>
          normalizeFilters({ ...current, q: input }, items),
        ),
      260,
    );
    return () => clearTimeout(timer);
  }, [input, items]);
  useEffect(() => {
    const query = queryFor(filters, defaultType);
    const target =
      location.pathname + (query ? "?" + query : "") + location.hash;
    if (target !== location.pathname + location.search + location.hash)
      history.replaceState(history.state, "", target);
  }, [filters, defaultType]);
  useEffect(() => {
    function onPop() {
      const next = readFilters(
        new URLSearchParams(location.search),
        items,
        defaultType,
      );
      setFilters(next);
      setInput(next.q);
    }
    function shortcut(event: KeyboardEvent) {
      if (
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === "k" &&
        !dialog.current?.open
      ) {
        event.preventDefault();
        field.current?.focus();
        field.current?.scrollIntoView({ block: "center", behavior: "instant" });
      }
    }
    addEventListener("popstate", onPop);
    addEventListener("keydown", shortcut);
    return () => {
      removeEventListener("popstate", onPop);
      removeEventListener("keydown", shortcut);
    };
  }, [items, defaultType]);
  useEffect(
    () => () => {
      document.body.style.overflow = "";
    },
    [],
  );
  const results = discover(items, filters);
  const active = Object.entries(filters).filter(
    ([key, value]) => key !== "sort" && key !== "q" && value !== "all",
  );
  function reset() {
    setInput("");
    update({ ...EMPTY_FILTERS });
  }
  function closeSheet() {
    dialog.current?.close();
  }
  return (
    <section
      data-hydrated={hydrated}
      id="koleksi"
      className={s.discovery}
      aria-labelledby="collection-heading"
    >
      <div className={s.collectionIntro}>
        <div>
          <span className={s.eyebrow}>01 / EXPLORE THE COLLECTION</span>
          <h2 id="collection-heading">
            Temukan bekal
            <br />
            <em>untuk langkahmu.</em>
          </h2>
        </div>
        <p>
          Untuk ide yang baru dimulai,
          <br />
          dan karya yang terus bertumbuh.
        </p>
      </div>
      <div className={s.searchBox}>
        <Search aria-hidden="true" />
        <label className={s.srOnly} htmlFor="shop-search">
          Cari koleksi
        </label>
        <input
          disabled={!hydrated}
          id="shop-search"
          ref={field}
          type="search"
          maxLength={120}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Cari ebook, template, AI tools, atau jasa..."
          autoComplete="off"
        />
        {input ? (
          <button
            type="button"
            aria-label="Hapus pencarian"
            onClick={() => {
              setInput("");
              update({ ...filters, q: "" });
              field.current?.focus();
            }}
          >
            <X />
          </button>
        ) : (
          <kbd hidden={!hydrated}>⌘ / Ctrl K</kbd>
        )}
      </div>
      <div className={s.primaryFilters} aria-label="Jenis koleksi">
        {Object.entries(OFFERING_LABELS).map(([key, label]) => (
          <button
            type="button"
            key={key}
            disabled={!hydrated}
            aria-pressed={filters.type === key}
            onClick={() =>
              update({
                ...filters,
                type: key as ShopFilters["type"],
                topic: "all",
                format: "all",
                price: "all",
                sort: "recommended",
              })
            }
          >
            {label}
            <span>
              {items.filter((i) => key === "all" || i.type === key).length}
            </span>
          </button>
        ))}
      </div>
      <div className={s.desktopFilters}>
        <FilterFields value={filters} onChange={update} items={items} />
      </div>
      <button
        type="button"
        ref={opener}
        className={`${s.secondary} ${s.mobileFilter}`}
        onClick={() => {
          setDraft(filters);
          dialog.current?.showModal();
          document.body.style.overflow = "hidden";
        }}
      >
        <SlidersHorizontal size={18} /> Filter & urutkan
        {active.length > 0 && <span>({active.length})</span>}
      </button>
      <div className={s.resultBar}>
        <p aria-live="polite" aria-atomic="true">
          {results.length} {filters.type === "service" ? "layanan" : "pilihan"}
          {filters.q && <> untuk “{filters.q}”</>}
        </p>
        {(active.length > 0 || filters.q || filters.sort !== "recommended") && (
          <button onClick={reset}>
            Reset semua <X size={14} />
          </button>
        )}
      </div>
      {(active.length > 0 || filters.q) && (
        <div className={s.activeFilters} aria-label="Filter aktif">
          {filters.q && (
            <button
              onClick={() => {
                setInput("");
                update({ ...filters, q: "" });
              }}
            >
              Pencarian: {filters.q}
              <X size={13} />
            </button>
          )}
          {active.map(([key, value]) => (
            <button
              key={key}
              aria-label={`Hapus filter ${key}`}
              onClick={() => update({ ...filters, [key]: "all" })}
            >
              {key === "type"
                ? OFFERING_LABELS[value as keyof typeof OFFERING_LABELS]
                : value === "free"
                  ? "Gratis"
                  : value === "paid"
                    ? "Berbayar"
                    : value}
              <X size={13} />
            </button>
          ))}
        </div>
      )}
      {filters.type === "recommended" && (
        <p className={s.disclosure}>
          Kurasi independen. Empat tools berikut menggunakan tautan resmi
          non-affiliate; tidak ada komisi dari tautan ini.
        </p>
      )}
      {results.length ? (
        <div className={s.cardGrid}>
          {results.map((item, index) => (
            <Link
              href={item.href}
              key={item.id}
              className={s.card}
              data-offering={item.type}
            >
              <ShopArtwork item={item} />
              <div className={s.cardBody}>
                <div className={s.cardMeta}>
                  <span>
                    {item.type === "recommended"
                      ? "KURASI / NON-AFFILIATE"
                      : item.type === "original"
                        ? "MADE BY KHADAFI"
                        : "WORK WITH KHADAFI"}
                  </span>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </div>
                <h3>
                  {item.title}
                  <ArrowUpRight aria-hidden="true" />
                </h3>
                <p>{item.description}</p>
                <div className={s.cardFoot}>
                  <span>
                    {item.provider} · {item.format}
                  </span>
                  <strong>{item.priceLabel}</strong>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className={s.empty}>
          <span className={s.emptyMark} aria-hidden="true">
            {filters.type === "original" &&
            !items.some((i) => i.type === "original")
              ? "01"
              : "↗"}
          </span>
          <h3>
            {filters.type === "original" &&
            !items.some((i) => i.type === "original")
              ? "Karya yang baik membutuhkan waktu."
              : "Belum ada yang cocok."}
          </h3>
          <p>
            {filters.type === "original" &&
            !items.some((i) => i.type === "original")
              ? "Koleksi original sedang disiapkan. Sambil menunggu, ada panduan dan template gratis yang sudah bisa kamu gunakan."
              : "Coba kata kunci yang lebih singkat atau lepaskan beberapa filter untuk menjelajah lagi."}
          </p>
          <div className={s.actions}>
            <button className={s.secondary} onClick={reset}>
              Jelajahi semua <ArrowDown size={16} />
            </button>
            <Link className={s.textLink} href="/resources">
              Buka resources gratis <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      )}
      <dialog
        ref={dialog}
        className={s.filterDialog}
        aria-labelledby="filter-title"
        onClose={() => {
          document.body.style.overflow = "";
          opener.current?.focus();
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            const r = e.currentTarget.getBoundingClientRect();
            if (
              e.clientX < r.left ||
              e.clientX > r.right ||
              e.clientY < r.top ||
              e.clientY > r.bottom
            )
              closeSheet();
          }
        }}
      >
        <div className={s.sheetHandle} />
        <div className={s.dialogHead}>
          <h2 id="filter-title">Pilihan yang lebih tepat.</h2>
          <button aria-label="Tutup filter" onClick={closeSheet}>
            <X />
          </button>
        </div>
        <FilterFields
          value={draft}
          onChange={(v) => setDraft(normalizeFilters(v, items))}
          items={items}
          mobile
        />
        <div className={s.dialogActions}>
          <button
            className={s.secondary}
            onClick={() =>
              setDraft({ ...EMPTY_FILTERS, type: filters.type, q: filters.q })
            }
          >
            Reset filter
          </button>
          <button
            className={s.button}
            onClick={() => {
              update(draft);
              closeSheet();
            }}
          >
            Tampilkan {discover(items, draft).length} hasil
          </button>
        </div>
      </dialog>
    </section>
  );
}
