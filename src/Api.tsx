import { invoke } from "@tauri-apps/api/core";
import type { Card } from "./types";
import { QueryParameters } from "./Components/Drawer/Drawer";

export async function loadCards(): Promise<Card[]> {
  const response = await invoke<Card[]>("fetch_cards");

  return response;
}

export async function loadCardsByPartialName(
  queryParameters: QueryParameters,
): Promise<Card[]> {
  const response = await invoke<Card[]>("fetch_cards_by_partial_name", {
    queryParameters: { ...queryParameters },
  });

  return response;
}
