import { invoke } from "@tauri-apps/api/core";
import type { Card } from "./types";

export async function loadCards(): Promise<Card[]> {
  const response = await invoke<Card[]>("fetch_cards");

  return response;
}

export async function loadCardsByPartialName(partialName: string): Promise<Card[]> {
  const response = await invoke<Card[]>("fetch_cards_by_partial_name", {
    partialName,
  });

  return response;
}
