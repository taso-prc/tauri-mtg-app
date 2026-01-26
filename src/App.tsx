import "./App.css";
import { useEffect, useState } from "react";
import Card from "./Components/Card/Card";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { loadCards, loadCardsByPartialName } from "./api";
const appWindow = await getCurrentWindow();
await appWindow.maximize();

function App() {
  // Hooks
  const [cards, setCards] = useState<any[]>([]);
  const [searchTimeout, setSearchTimeout] = useState<number | null>(null);

  // Initial load, fetch default cards (FCA set).
  useEffect(() => {
    loadCards().then(setCards).catch(console.error);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const partialName = e.target.value;

    // Clear timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set new timeout (1s)
    const newTimeout = setTimeout(() => {
      if (partialName.trim()) {
        loadCardsByPartialName(partialName).then(setCards).catch(console.error);
      } else {
        loadCards().then(setCards).catch(console.error);
      }
    }, 1000);

    setSearchTimeout(newTimeout);
  };

  return (
    <main style={{ margin: "2rem" }}>
      <h1>Magic The Gathering</h1>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginBottom: "1rem",
          alignItems: "flex-start",
          gap: "0.5rem",
        }}
      >
        <label>Search</label>
        <input
          type="text"
          placeholder="Search cards..."
          onChange={handleSearchChange}
        />
      </div>
      <div
        className="cards-container"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 300px))",
          gap: "1rem",
        }}
      >
        {cards.map((card, index) =>
          card.image_uris?.normal ? (
            <Card
              key={`${card.name}-${index}`}
              title={card.name}
              imageUrl={card.image_uris.normal}
              foil={card.foil}
            />
          ) : null,
        )}
      </div>
    </main>
  );
}

export default App;
