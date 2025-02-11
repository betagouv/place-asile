"use client";

import React from "react";
import { MapContainer } from "react-leaflet/MapContainer";
import { Marker } from "react-leaflet/Marker";
import { Popup } from "react-leaflet/Popup";
import { TileLayer } from "react-leaflet/TileLayer";
import { DEFAULT_MAP_ZOOM, FRANCE_CENTER } from "../constants";
import { LatLngTuple } from "leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

const MAX_BOUNDS: LatLngTuple[] = [
  [38.976492485539424, -5.9326171875],
  [53.291489065300226, 9.667968750000002],
];

const CentresMap = () => {
  return (
    <>
      <MapContainer
        center={FRANCE_CENTER}
        zoom={DEFAULT_MAP_ZOOM}
        scrollWheelZoom={true}
        style={{ height: "500px", width: "500px" }}
        maxBounds={MAX_BOUNDS}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={FRANCE_CENTER}>
          <Popup>Centre de test</Popup>
        </Marker>
      </MapContainer>
    </>
  );
};

export default CentresMap;
