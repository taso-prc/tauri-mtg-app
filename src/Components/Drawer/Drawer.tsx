import React, { useEffect, useRef, useState } from "react";
import "./Drawer.css";
import { Menu, XmarkCircle } from "iconoir-react";
import { manatypes } from "../../manatypes";
import manaWhite from "../../assets/mana_white.svg";
import manaBlue from "../../assets/mana_blue.svg";
import manaBlack from "../../assets/mana_black.svg";
import manaRed from "../../assets/mana_red.svg";
import manaGreen from "../../assets/mana_green.svg";
import manaColorless from "../../assets/mana_colorless.svg";

interface Drawer {
  onSearch: any;
}

export interface QueryParameters {
  searchString: string;
  power?: number;
  colors?: string[];
}

const manaIcons: { [key: string]: string } = {
  White: manaWhite,
  Blue: manaBlue,
  Black: manaBlack,
  Red: manaRed,
  Green: manaGreen,
  Colorless: manaColorless,
};

const Drawer: React.FC<Drawer> = ({ onSearch }) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [queryParameters, setQueryParameters] = useState<QueryParameters>({
    searchString: "",
    power: undefined,
    colors: [],
  });

  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node)
      ) {
        setVisible(false); // close drawer
      }
    }

    if (visible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [visible]);

  const handleColorChange = (color: string, isChecked: boolean) => {
    const newColors = isChecked
      ? [...(queryParameters.colors || []), color]
      : (queryParameters.colors || []).filter((c) => c !== color);

    const newQueryParameters = {
      ...queryParameters,
      colors: newColors.length > 0 ? newColors : undefined,
    };
    setQueryParameters(newQueryParameters);
    onSearch(newQueryParameters);
  };

  return (
    <div ref={drawerRef}>
      <div className={`drawer ${visible ? "drawer-open" : ""}`}>
        <h3>Search</h3>
        <label htmlFor="qp-search-string">Card Name</label>
        <input
          name="qp-search-string"
          className="search-input"
          type="text"
          placeholder="Search cards..."
          value={queryParameters.searchString}
          onChange={(e) => {
            const newQueryParameters = {
              ...queryParameters,
              searchString: e.target.value,
            };
            setQueryParameters(newQueryParameters);
            onSearch(newQueryParameters);
          }}
        />
        <label htmlFor="qp-power">Power</label>
        <input
          name="qp-power"
          className="search-input"
          type="number"
          placeholder="Power"
          value={queryParameters.power}
          onChange={(e) => {
            const newQueryParameters = {
              ...queryParameters,
              power: e.target.value ? Number.parseInt(e.target.value) : undefined,
            };
            setQueryParameters(newQueryParameters);
            onSearch(newQueryParameters);
          }}
        />
        <label>Mana Colors</label>
        <div className="mana-colors-container">
          {manatypes.map((manatype) => (
            <label key={manatype.color} className="mana-checkbox">
              <input
                type="checkbox"
                checked={queryParameters.colors?.includes(manatype.color) || false}
                onChange={(e) => handleColorChange(manatype.color, e.target.checked)}
              />
              <img
                src={manaIcons[manatype.color]}
                alt={manatype.color}
                className="mana-icon"
                title={manatype.color}
              />
            </label>
          ))}
        </div>
        <XmarkCircle
          className="drawer-close"
          style={{
            width: "100%",
            textAlign: "center",
            height: "2rem",
            bottom: "5px",
            position: "absolute",
          }}
          onClick={() => setVisible(false)}
        />
      </div>

      {/* Hamburger icon always exists */}
      {!visible && (
        <Menu className="drawer-handle" onClick={() => setVisible(true)} />
      )}
    </div>
  );
};

export default Drawer;
