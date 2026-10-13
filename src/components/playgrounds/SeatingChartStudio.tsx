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
        x: 50 + (prev.length % 3) * 180,
        y: 50 + Math.floor(prev.length / 3) * 140,
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

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">{t.tables}</h3>
          <div className="relative min-h-[400px] rounded-2xl border border-border bg-muted/20 p-4">
            {tables.length === 0 && (
              <p className="text-center text-muted-foreground">{t.emptyHint}</p>
            )}
            {tables.map((table) => {
              const assigned = guestsByTable(table.id);
              const over = assigned.length > table.capacity;
              return (
                <div
                  key={table.id}
                  className={`absolute rounded-xl border-2 bg-background p-3 shadow-sm ${over ? "border-red-500" : "border-border"}`}
                  style={{ left: table.x, top: table.y, width: 160 }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    const guestId = e.dataTransfer.getData("guestId");
                    if (guestId) assignGuest(guestId, table.id);
                  }}
                >
                  <div className="font-semibold">{table.name}</div>
                  <div className={`text-xs ${over ? "font-bold text-red-600" : "text-muted-foreground"}`}>
                    {assigned.length}/{table.capacity} {t.assigned}
                    {over && ` · ${t.overCapacity}`}
                  </div>
                  <div className="mt-2 space-y-1">
                    {assigned.map((g) => (
                      <div
                        key={g.id}
                        draggable
                        onDragStart={(e) => e.dataTransfer.setData("guestId", g.id)}
                        className="cursor-move rounded bg-muted px-2 py-1 text-xs"
                      >
                        {g.name}
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
          >
            {unassigned.map((g) => (
              <div
                key={g.id}
                draggable
                onDragStart={(e) => e.dataTransfer.setData("guestId", g.id)}
                className="cursor-move rounded-lg bg-muted px-3 py-2 text-sm"
              >
                {g.name}
              </div>
            ))}
            {unassigned.length === 0 && <p className="text-xs text-muted-foreground">—</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
