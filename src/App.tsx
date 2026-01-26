import "./App.css";
import { useEffect, useState } from "react";
import Card from "./Components/Card/Card";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { loadCards, loadCardsByPartialName } from "./Api";
import Drawer, { QueryParameters } from "./Components/Drawer/Drawer";
import Spinner from "./Components/Spinner/Spinner";
const appWindow = await getCurrentWindow();
await appWindow.maximize();

function App() {
  // Hooks
  const [cards, setCards] = useState<any[]>([]);
  const [searchTimeout, setSearchTimeout] = useState<number | null>(null);
  const [fetching, setFetching] = useState<boolean>(false);

  // Initial load, fetch default cards (FCA set).
  useEffect(() => {
    setFetching(true);
    loadCards()
      .then(setCards)
      .catch(console.error)
      .finally(() => {
        setFetching(false);
      });
  }, []);

  const handleSearchChange = async (queryParameters: QueryParameters) => {
    setFetching(true);

    // Clear timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set new timeout (1s)
    const newTimeout = setTimeout(() => {
      if (queryParameters) {
        loadCardsByPartialName(queryParameters)
          .then(setCards)
          .catch(console.error)
          .finally(() => {
            setFetching(false);
          });
      } else {
        loadCards()
          .then(setCards)
          .catch(console.error)
          .finally(() => {
            setFetching(false);
          });
      }
    }, 1000);

    setSearchTimeout(newTimeout);
  };

  return (
    <main style={{ margin: "2rem" }}>
      <Drawer onSearch={handleSearchChange}></Drawer>
      <h1>Magic The Gathering</h1>
      {fetching ? (
        <Spinner></Spinner>
      ) : (
        <div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginBottom: "1rem",
              alignItems: "flex-start",
              gap: "0.5rem",
            }}
          ></div>
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
        </div>
      )}
    </main>
  );
}

export default App;
