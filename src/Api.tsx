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
  const response = await invoke<Card[]>("fetch_cards_by_parameters", {
    queryParameters: { ...queryParameters },
  });

  return response;
}

export async function getCachedImage(url: string): Promise<string> {
  const response = await invoke<string>("get_cached_image", { url });
  
  return response;
}