use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Deserialize)]
pub struct Config {
    #[serde(rename = "basePath")]
    pub base_path: String,
}

#[derive(Deserialize)]
pub struct ScryfallListResponse {
    pub data: Option<Vec<Card>>,
    pub details: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct Card {
    pub object: String,
    pub id: String,
    pub oracle_id: Option<String>,
    pub multiverse_ids: Option<Vec<u32>>,
    pub mtgo_id: Option<u32>,
    pub tcgplayer_id: Option<u32>,
    pub cardmarket_id: Option<u32>,
    pub name: String,
    pub flavor_name: Option<String>,
    pub lang: String,
    pub released_at: String,
    pub uri: String,
    pub scryfall_uri: String,
    pub layout: String,
    pub highres_image: bool,
    pub image_status: Option<String>,
    pub image_uris: Option<ImageUris>,
    pub mana_cost: Option<String>,
    pub cmc: f64,
    pub type_line: String,
    pub oracle_text: Option<String>,
    pub power: Option<String>,
    pub toughness: Option<String>,
    pub colors: Option<Vec<String>>,
    pub color_identity: Vec<String>,
    pub keywords: Vec<String>,
    pub all_parts: Option<Vec<RelatedCard>>,
    pub legalities: Legalities,
    pub games: Vec<String>,
    pub reserved: bool,
    pub foil: bool,
    pub nonfoil: bool,
    pub finishes: Vec<String>,
    pub oversized: bool,
    pub promo: bool,
    pub reprint: bool,
    pub variation: bool,
    pub set_id: String,
    pub set: String,
    pub set_name: String,
    pub set_type: String,
    pub set_uri: String,
    pub set_search_uri: String,
    pub scryfall_set_uri: String,
    pub rulings_uri: String,
    pub prints_search_uri: String,
    pub collector_number: String,
    pub digital: bool,
    pub rarity: String,
    pub card_back_id: Option<String>,
    pub artist: Option<String>,
    pub artist_ids: Option<Vec<String>>,
    pub illustration_id: Option<String>,
    pub border_color: String,
    pub frame: String,
    pub frame_effects: Option<Vec<String>>,
    pub security_stamp: Option<String>,
    pub full_art: bool,
    pub textless: bool,
    pub booster: bool,
    pub story_spotlight: bool,
    pub promo_types: Option<Vec<String>>,
    pub edhrec_rank: Option<u32>,
    pub prices: Option<Prices>,
    pub related_uris: Option<HashMap<String, String>>,
    pub purchase_uris: Option<HashMap<String, String>>,
}

#[derive(Serialize, Deserialize)]
pub struct ImageUris {
    pub small: String,
    pub normal: String,
    pub large: String,
    pub png: String,
    pub art_crop: String,
    pub border_crop: String,
}

#[derive(Serialize, Deserialize)]
pub struct RelatedCard {
    pub object: String,
    pub id: String,
    pub component: String,
    pub name: String,
    pub type_line: String,
    pub uri: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Legalities {
    pub standard: String,
    pub future: String,
    pub historic: String,
    pub timeless: String,
    pub gladiator: String,
    pub pioneer: String,
    pub modern: String,
    pub legacy: String,
    pub pauper: String,
    pub vintage: String,
    pub penny: String,
    pub commander: String,
    pub oathbreaker: String,
    pub standardbrawl: String,
    pub brawl: String,
    pub alchemy: String,
    pub paupercommander: String,
    pub duel: String,
    pub oldschool: String,
    pub premodern: String,
    pub predh: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Prices {
    pub usd: Option<String>,
    pub usd_foil: Option<String>,
    pub usd_etched: Option<String>,
    pub eur: Option<String>,
    pub eur_foil: Option<String>,
    pub tix: Option<String>,
}
