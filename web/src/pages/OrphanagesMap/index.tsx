import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiArrowRight, FiSun, FiMoon } from "react-icons/fi";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";

import api from "../../services/api";
import mapMarkerImg from "../../assets/images/map-marker.svg";
import mapIcon from "../../utils/mapIcon";

import { Container, SideBar, Header, Footer, ThemeChanger } from "./styles";

interface Orphanage {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

const OrphanagesMap: React.FC = () => {
  const [theme, setTheme] = useState("light");
  const [orphanages, setOrphanages] = useState<Orphanage[]>([]);

  useEffect(() => {
    api.get("orphanages").then((response) => {
      setOrphanages(response.data);
    });
  }, []);

  function changeTheme() {
    if (theme === "light") {
      setTheme("dark");
      return;
    }
    setTheme("light");
  }

  return (
    <Container>
      <SideBar>
        <Header>
          <img src={mapMarkerImg} alt="Happy" />
          <h2>Escolha um orfanato no mapa</h2>
          <p>Muitas crianças estão esperando a sua visita :)</p>
        </Header>

        <Footer>
          <strong>Americana</strong>
          <span>São Paulo</span>
        </Footer>
      </SideBar>

      <Map
        center={[-22.7501536, -47.3608666]}
        zoom={15}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          url={`https://api.mapbox.com/styles/v1/mapbox/${
            theme === "light" ? "light" : "dark"
          }-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${
            process.env.REACT_APP_MAPBOX_TOKEN
          }`}
        />

        {orphanages.map((orphanage) => (
          <Marker
            key={orphanage.id}
            position={[orphanage.latitude, orphanage.longitude]}
            icon={mapIcon}
          >
            <Popup
              closeButton={false}
              minWidth={240}
              maxWidth={240}
              className="map-popup"
            >
              {orphanage.name}
              <Link to={`/orphanages/${orphanage.id}`}>
                <FiArrowRight color="#fff" size={20} />
              </Link>
            </Popup>
          </Marker>
        ))}
      </Map>

      <Link to="/orphanages/create" className="button-link">
        <FiPlus size={32} color="#fff" />
      </Link>

      <ThemeChanger onClick={changeTheme}>
        {theme === "light" ? (
          <FiMoon size={32} color="#fff" />
        ) : (
          <FiSun size={32} color="#fff" />
        )}
      </ThemeChanger>
    </Container>
  );
};

export default OrphanagesMap;
