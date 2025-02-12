"use client";

import React, { ReactElement } from "react";
import { MapContainer } from "react-leaflet/MapContainer";

import { TileLayer } from "react-leaflet/TileLayer";
import { DEFAULT_MAP_ZOOM, FRANCE_CENTER } from "../constants";
import { LatLngTuple } from "leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { MapMarker } from "./MapMarker";
import { Centre } from "../types/centre.type";

const MAX_BOUNDS: LatLngTuple[] = [
  [38.976492485539424, -5.9326171875],
  [53.291489065300226, 9.667968750000002],
];

const CentresMap = ({ centres }: Props): ReactElement => {
  return (
    <>
      <MapContainer
        center={FRANCE_CENTER}
        zoom={DEFAULT_MAP_ZOOM}
        scrollWheelZoom={true}
        style={{ height: "80vh", width: "80vw" }}
        maxBounds={MAX_BOUNDS}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {centres.map(
          (
            {
              coordinates,
              adresseHebergement,
              operateur,
              type,
              nbPlaces,
              typologie,
            },
            index
          ) => (
            <MapMarker
              coordinates={coordinates}
              adresseHebergement={adresseHebergement}
              operateur={operateur}
              type={type}
              nbPlaces={nbPlaces}
              typologie={typologie}
              key={index}
            />
          )
        )}
      </MapContainer>
    </>
  );
};

type Props = {
  centres: Centre[];
};

export default CentresMap;
