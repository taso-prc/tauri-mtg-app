use crate::models::{Card, Config, ScryfallListResponse};
use serde::Deserialize;
use serde_json::Number;
use std::{fs, path::PathBuf};
use tauri_plugin_http::reqwest;
use tauri::{AppHandle, Manager};
use sha2::{Digest, Sha256};
use base64::{Engine as _, engine::general_purpose};

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
    pub power: Option<Number>,
    pub colors: Option<Vec<String>>,
}

/// Fetch cards using fulltext search system.
/// https://scryfall.com/docs/api/cards/search
#[tauri::command]
pub async fn fetch_cards_by_parameters(query_parameters: QP) -> Result<Vec<Card>, String> {
    let client = reqwest::Client::new();
    let config = load_config()?;
    let mut request_url = format!(
        "{}/cards/search?q={}",
        config.base_path, query_parameters.searchString
    );

    // Check if power is present and is an integer, append to request_url: +pow%3D{}
    if let Some(power) = &query_parameters.power {
        if power.is_i64() {
            request_url.push_str(&format!("+pow%3D{}", power.as_i64().unwrap()));
        }
    }

    // Handle mana colors if present, append to request_url: +c%3A{} for each color
    if query_parameters.colors.is_some() {
        let colors = query_parameters.colors.as_ref().unwrap();
        if !colors.is_empty() {
            let color_query = colors
                .iter()
                .map(|c| format!("c%3A{}", c.to_lowercase()))
                .collect::<Vec<String>>()
                .join("+");
            request_url.push_str(&format!("+{}", color_query));
        }
    }

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

#[tauri::command]
pub async fn get_cached_image(app: AppHandle, url: String) -> Result<String, String> {
    let cache_dir = app.path().app_data_dir()
        .map_err(|e| e.to_string())?
        .join("cache")
        .join("images");

    fs::create_dir_all(&cache_dir).map_err(|e| e.to_string())?;

    // Determine file extension from URL
    let extension = if url.contains(".jpg") || url.contains("format=image") {
        "jpg"
    } else if url.contains(".png") {
        "png"
    } else {
        "jpg" // default to jpg for Scryfall images
    };

    // Hash URL → filename with proper extension
    let mut hasher = Sha256::new();
    hasher.update(url.as_bytes());
    let filename = format!("{:x}.{}", hasher.finalize(), extension);

    let path: PathBuf = cache_dir.join(filename);

    // If file doesn't exist, download and save it
    if !path.exists() {
        let client = reqwest::Client::new();
        let response = client
            .get(&url)
            .header("User-Agent", "TauriMTGApp/1.0")
            .send()
            .await
            .map_err(|e| format!("Failed to download image: {}", e))?;

        if !response.status().is_success() {
            return Err(format!("Failed to download image, status: {}", response.status()));
        }

        let bytes = response
            .bytes()
            .await
            .map_err(|e| format!("Failed to read image bytes: {}", e))?;

        fs::write(&path, bytes)
            .map_err(|e| format!("Failed to save image to cache: {}", e))?;
    }

    // Read the image file and convert to base64 data URL
    let image_bytes = fs::read(&path)
        .map_err(|e| format!("Failed to read cached image: {}", e))?;
    
    let base64_data = general_purpose::STANDARD.encode(&image_bytes);
    
    // Determine MIME type from extension
    let mime_type = if extension == "png" {
        "image/png"
    } else {
        "image/jpeg"
    };
    
    let data_url = format!("data:{};base64,{}", mime_type, base64_data);
    
    Ok(data_url)
}