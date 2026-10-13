"use client";

import { useEffect, useState } from "react";

type Locale = "en" | "es";

interface Guest {
  id: string;
  name: string;
  tableId: string | null;
}

interface Table {
  id: string;
  name: string;
  capacity: number;
  x: number;
  y: number;
}

const labels = {
  en: {
    title: "Event Seating Chart Studio",
    addTable: "Add table",
    addGuest: "Add guest",
    guestName: "Guest name",
    capacity: "Capacity",
    assigned: "Assigned",
    overCapacity: "Over capacity!",
    share: "Share link",
    copied: "Copied!",
    unassigned: "Unassigned",
    tables: "Tables",
    guests: "Guests",
    emptyHint: "Add a table and guests to start arranging seating",
    remove: "Remove",
    selectHint: "Click a guest then a table (or drag) to assign",
    editCapacity: "Capacity",
  },
  es: {
    title: "Estudio de Plano de Asientos",
    addTable: "Agregar mesa",
    addGuest: "Agregar invitado",
    guestName: "Nombre del invitado",
    capacity: "Capacidad",
    assigned: "Asignados",
    overCapacity: "¡Sobre capacidad!",
    share: "Compartir enlace",
    copied: "¡Copiado!",
    unassigned: "Sin asignar",
    tables: "Mesas",
    guests: "Invitados",
    emptyHint: "Agregá una mesa e invitados para empezar a organizar",
    remove: "Quitar",
    selectHint: "Tocá un invitado y luego una mesa (o arrastrá) para asignar",
    editCapacity: "Capacidad",
  },
};

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

function serialize(state: { tables: Table[]; guests: Guest[] }) {
  try {
    return btoa(encodeURIComponent(JSON.stringify(state)));
  } catch {
    return "";
  }
}

function deserialize(raw: string): { tables: Table[]; guests: Guest[] } {
  try {
    const json = decodeURIComponent(atob(raw));
    const parsed = JSON.parse(json);
    return {
      tables: Array.isArray(parsed.tables) ? parsed.tables : [],
      guests: Array.isArray(parsed.guests) ? parsed.guests : [],
    };
  } catch {
    return { tables: [], guests: [] };
  }
}

export function SeatingChartStudio({ locale }: { locale: Locale }) {
  const t = labels[locale];
  const [tables, setTables] = useState<Table[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [newGuestName, setNewGuestName] = useState("");
  const [copied, setCopied] = useState(false);
  const [selectedGuestId, setSelectedGuestId] = useState<string | null>(null);
  const [draggingTableId, setDraggingTableId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const data = params.get("seating");
    if (data) {
      const loaded = deserialize(data);
      setTables(loaded.tables);
      setGuests(loaded.guests);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (tables.length || guests.length) {
      url.searchParams.set("seating", serialize({ tables, guests }));
    } else {
      url.searchParams.delete("seating");
    }
    window.history.replaceState({}, "", url.toString());
  }, [tables, guests]);

  const addTable = () => {
    const id = generateId();
    setTables((prev) => [
      ...prev,
      {
        id,
        name: locale === "es" ? `Mesa ${prev.length + 1}` : `Table ${prev.length + 1}`,
        capacity: 6,
        x: 40 + (prev.length % 3) * 190,
        y: 40 + Math.floor(prev.length / 3) * 150,
      },
    ]);
  };

  const addGuest = () => {
    if (!newGuestName.trim()) return;
    const id = generateId();
    setGuests((prev) => [...prev, { id, name: newGuestName.trim(), tableId: null }]);
    setNewGuestName("");
  };

  const assignGuest = (guestId: string, tableId: string | null) => {
    setGuests((prev) => prev.map((g) => (g.id === guestId ? { ...g, tableId } : g)));
    setSelectedGuestId(null);
  };

  const removeGuest = (guestId: string) => {
    setGuests((prev) => prev.filter((g) => g.id !== guestId));
    if (selectedGuestId === guestId) setSelectedGuestId(null);
  };

  const removeTable = (tableId: string) => {
    setTables((prev) => prev.filter((tbl) => tbl.id !== tableId));
    setGuests((prev) => prev.map((g) => (g.tableId === tableId ? { ...g, tableId: null } : g)));
  };

  const updateCapacity = (tableId: string, capacity: number) => {
    const c = Math.max(1, Math.min(20, capacity));
    setTables((prev) => prev.map((tbl) => (tbl.id === tableId ? { ...tbl, capacity: c } : tbl)));
  };

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const guestsByTable = (tableId: string) => guests.filter((g) => g.tableId === tableId);
  const unassigned = guests.filter((g) => !g.tableId);

  const onTablePointerDown = (e: React.PointerEvent, table: Table) => {
    if ((e.target as HTMLElement).closest("input, button")) return;
    setDraggingTableId(table.id);
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onCanvasPointerMove = (e: React.PointerEvent) => {
    if (!draggingTableId) return;
    const canvas = e.currentTarget as HTMLElement;
    const rect = canvas.getBoundingClientRect();
    const x = Math.max(0, e.clientX - rect.left - dragOffset.x);
    const y = Math.max(0, e.clientY - rect.top - dragOffset.y);
    setTables((prev) => prev.map((tbl) => (tbl.id === draggingTableId ? { ...tbl, x, y } : tbl)));
  };

  const onCanvasPointerUp = () => {
    setDraggingTableId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border/60 bg-surface/50 p-4">
        <button type="button" onClick={addTable} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
          + {t.addTable}
        </button>
        <div className="flex items-center gap-2">
          <input
            value={newGuestName}
            onChange={(e) => setNewGuestName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addGuest()}
            placeholder={t.guestName}
            className="rounded-xl border border-border px-3 py-2 text-sm"
          />
          <button type="button" onClick={addGuest} className="rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium">
            + {t.addGuest}
          </button>
        </div>
        <button type="button" onClick={share} className="ml-auto rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium">
          {copied ? t.copied : t.share}
        </button>
      </div>

      <p className="text-xs text-muted-foreground">{t.selectHint}</p>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">{t.tables}</h3>
          <div
            className="relative min-h-[420px] overflow-auto rounded-2xl border border-border bg-muted/20 p-4"
            onPointerMove={onCanvasPointerMove}
            onPointerUp={onCanvasPointerUp}
            onPointerCancel={onCanvasPointerUp}
          >
            {tables.length === 0 && (
              <p className="text-center text-muted-foreground">{t.emptyHint}</p>
            )}
            {tables.map((table) => {
              const assigned = guestsByTable(table.id);
              const over = assigned.length > table.capacity;
              return (
                <div
                  key={table.id}
                  className={`absolute cursor-move rounded-xl border-2 bg-background p-3 shadow-sm ${over ? "border-red-500" : "border-border"} ${selectedGuestId ? "ring-2 ring-primary/40" : ""}`}
                  style={{ left: table.x, top: table.y, width: 170 }}
                  onPointerDown={(e) => onTablePointerDown(e, table)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    const guestId = e.dataTransfer.getData("guestId");
                    if (guestId) assignGuest(guestId, table.id);
                  }}
                  onClick={() => {
                    if (selectedGuestId) assignGuest(selectedGuestId, table.id);
                  }}
                >
                  <div className="flex items-center justify-between gap-1">
                    <div className="font-semibold text-sm">{table.name}</div>
                    <button type="button" onClick={(e) => { e.stopPropagation(); removeTable(table.id); }} className="text-xs text-muted-foreground hover:text-red-600">
                      ×
                    </button>
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-xs">
                    <label className="text-muted-foreground">{t.editCapacity}</label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={table.capacity}
                      onChange={(e) => updateCapacity(table.id, Number(e.target.value) || 1)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-12 rounded border border-border px-1 py-0.5 text-xs"
                    />
                  </div>
                  <div className={`mt-1 text-xs ${over ? "font-bold text-red-600" : "text-muted-foreground"}`}>
                    {assigned.length}/{table.capacity} {t.assigned}
                    {over && ` · ${t.overCapacity}`}
                  </div>
                  <div className="mt-2 space-y-1">
                    {assigned.map((g) => (
                      <div
                        key={g.id}
                        draggable
                        onDragStart={(e) => e.dataTransfer.setData("guestId", g.id)}
                        onClick={(e) => { e.stopPropagation(); setSelectedGuestId(g.id); }}
                        className={`flex cursor-move items-center justify-between rounded bg-muted px-2 py-1 text-xs ${selectedGuestId === g.id ? "ring-1 ring-primary" : ""}`}
                      >
                        <span>{g.name}</span>
                        <button type="button" onClick={(e) => { e.stopPropagation(); removeGuest(g.id); }} className="text-muted-foreground hover:text-red-600">×</button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">{t.unassigned}</h3>
          <div
            className="min-h-[200px] space-y-2 rounded-2xl border border-dashed border-border p-3"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              const guestId = e.dataTransfer.getData("guestId");
              if (guestId) assignGuest(guestId, null);
            }}
            onClick={() => {
              if (selectedGuestId) assignGuest(selectedGuestId, null);
            }}
          >
            {unassigned.map((g) => (
              <div
                key={g.id}
                draggable
                onDragStart={(e) => e.dataTransfer.setData("guestId", g.id)}
                onClick={(e) => { e.stopPropagation(); setSelectedGuestId(g.id); }}
                className={`flex cursor-move items-center justify-between rounded-lg bg-muted px-3 py-2 text-sm ${selectedGuestId === g.id ? "ring-2 ring-primary" : ""}`}
              >
                <span>{g.name}</span>
                <button type="button" onClick={(e) => { e.stopPropagation(); removeGuest(g.id); }} className="text-muted-foreground hover:text-red-600">×</button>
              </div>
            ))}
            {unassigned.length === 0 && <p className="text-xs text-muted-foreground">—</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
