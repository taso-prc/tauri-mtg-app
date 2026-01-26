use crate::models::{Card, Config, ScryfallListResponse};
use serde::Deserialize;
use serde_json::Number;
use std::fs;
use tauri_plugin_http::reqwest;

// load cnf.json file
fn load_config() -> Result<Config, String> {
    let config_content = fs::read_to_string("cnf.json").map_err(|e| e.to_string())?;
    let config: Config = serde_json::from_str(&config_content).map_err(|e| e.to_string())?;

    Ok(config)
}

// Fetch default set of cards (Final Fantasy).
#[tauri::command]
pub async fn fetch_cards() -> Result<Vec<Card>, String> {
    let client = reqwest::Client::new();
    let config = load_config()?;
    let request_url = format!("{}/cards/search?q=set:fca", config.base_path);

    let response = client
        .get(&request_url)
        .header("User-Agent", "TauriMTGApp/1.0")
        .header("Accept", "application/json")
        .send()
        .await
        .map_err(|e| e.to_string())?
        .text()
        .await
        .map_err(|e| e.to_string())?;

    let api_response: ScryfallListResponse = serde_json::from_str(&response)
        .map_err(|e| format!("Failed to parse response: {}. Response: {}", e, response))?;

    api_response.data.ok_or_else(|| {
        format!(
            "No data in response: {}",
            api_response.details.unwrap_or_default()
        )
    })
}

#[derive(Debug, Deserialize)]
pub struct QP {
    pub searchString: String,
    pub power: Number,
}

/// Fetch cards using fulltext search system.
/// https://scryfall.com/docs/api/cards/search
#[tauri::command]
pub async fn fetch_cards_by_partial_name(query_parameters: QP) -> Result<Vec<Card>, String> {
    let client = reqwest::Client::new();
    let config = load_config()?;
    let request_url = format!(
        "{}/cards/search?q={}+pow%3D{} ",
        config.base_path, query_parameters.searchString, query_parameters.power
    );

    let response = client
        .get(&request_url)
        .header("User-Agent", "TauriMTGApp/1.0")
        .header("Accept", "application/json")
        .send()
        .await
        .map_err(|e| e.to_string())?
        .text()
        .await
        .map_err(|e| e.to_string())?;

    let api_response: ScryfallListResponse = serde_json::from_str(&response)
        .map_err(|e| format!("Failed to parse response: {}. Response: {}", e, response))?;

    api_response.data.ok_or_else(|| {
        format!(
            "No data in response: {}",
            api_response.details.unwrap_or_default()
        )
    })
}
