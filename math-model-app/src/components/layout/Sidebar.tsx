import { useMemo, useState } from "react";
import type { MathModel } from "@/types/model";
import { categories, modelsByCategory, searchModels } from "@/models";

interface Props {
  selectedId: string;
  onSelect: (id: string) => void;
  isFavorite: (id: string) => boolean;
  favorites: string[];
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill={filled ? "#f59e0b" : "none"} stroke="#f59e0b" strokeWidth="2">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function ModelButton({
  model,
  selected,
  favorite,
  onSelect,
}: {
  model: MathModel;
  selected: boolean;
  favorite: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(model.id)}
      className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm transition ${
        selected
          ? "bg-blue-600 font-medium text-white shadow-sm"
          : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700/60"
      }`}
    >
      <span className="truncate">{model.name}</span>
      {favorite && <StarIcon filled />}
    </button>
  );
}

export function Sidebar({ selectedId, onSelect, isFavorite, favorites }: Props) {
  const [query, setQuery] = useState("");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const results = useMemo(() => searchModels(query), [query]);
  const favoriteModels = useMemo(
    () => results.filter((m) => favorites.includes(m.id)),
    [results, favorites],
  );

  const toggleCategory = (id: string) =>
    setCollapsed((c) => ({ ...c, [id]: !c[id] }));

  const searching = query.trim().length > 0;

  return (
    <div className="flex h-full flex-col">
      {/* Search box */}
      <div className="p-3">
        <div className="relative">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search models..."
            className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>
      </div>

      <nav className="scroll-thin flex-1 overflow-y-auto px-3 pb-4">
        {searching ? (
          <div className="space-y-1">
            <p className="px-1 py-1 text-xs text-slate-400">
              {results.length} result{results.length === 1 ? "" : "s"}
            </p>
            {results.map((m) => (
              <ModelButton
                key={m.id}
                model={m}
                selected={m.id === selectedId}
                favorite={isFavorite(m.id)}
                onSelect={onSelect}
              />
            ))}
            {results.length === 0 && (
              <p className="px-1 py-4 text-sm text-slate-400">No models match "{query}".</p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {favoriteModels.length > 0 && (
              <div>
                <p className="px-2 pb-1 text-xs font-semibold uppercase tracking-wide text-amber-500">
                  ★ Favorites
                </p>
                <div className="space-y-1">
                  {favoriteModels.map((m) => (
                    <ModelButton
                      key={`fav-${m.id}`}
                      model={m}
                      selected={m.id === selectedId}
                      favorite
                      onSelect={onSelect}
                    />
                  ))}
                </div>
              </div>
            )}

            {categories.map((cat) => {
              const models = modelsByCategory(cat.id);
              const isCollapsed = collapsed[cat.id];
              return (
                <div key={cat.id}>
                  <button
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700/50"
                  >
                    <span>{cat.name}</span>
                    <svg
                      width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                      className={`transition-transform ${isCollapsed ? "-rotate-90" : ""}`}
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                  {!isCollapsed && (
                    <div className="mt-1 space-y-1">
                      {models.map((m) => (
                        <ModelButton
                          key={m.id}
                          model={m}
                          selected={m.id === selectedId}
                          favorite={isFavorite(m.id)}
                          onSelect={onSelect}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </nav>
    </div>
  );
}
