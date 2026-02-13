import React, { useEffect, useRef, useState } from "react";
import "./Drawer.css";
import { Menu, XmarkCircle } from "iconoir-react";

interface Drawer {
  onSearch: any;
}

export interface QueryParameters {
  searchString: string;
  power: number;
}

const Drawer: React.FC<Drawer> = ({ onSearch }) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [queryParameters, setQueryParameters] = useState<QueryParameters>({
    searchString: "",
    power: 0,
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
              power: Number.parseInt(e.target.value) || 0,
            };
            setQueryParameters(newQueryParameters);
            onSearch(newQueryParameters);
          }}
        />
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
