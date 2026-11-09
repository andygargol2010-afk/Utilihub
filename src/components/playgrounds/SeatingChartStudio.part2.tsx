"use client";
// Part 2 of 3 — split from SeatingChartStudio.tsx on 2026-11-04. Edit here; SeatingChartStudio.tsx re-exports.

export interface Guest {
  id: string;
  name: string;
  tableId: string | null;
}

export interface Table {
  id: string;
  name: string;
  capacity: number;
  x: number;
  y: number;
}

export const labels = {
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
    editName: "Table name",
    seats: "seats",
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
    editName: "Nombre de mesa",
    seats: "asientos",
  },
};

export function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

export function serialize(state: { tables: Table[]; guests: Guest[] }) {
  try {
    return btoa(encodeURIComponent(JSON.stringify(state)));
  } catch {
    return "";
  }
}

export function deserialize(raw: string): { tables: Table[]; guests: Guest[] } {
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
