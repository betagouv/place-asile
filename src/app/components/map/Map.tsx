"use client";

import { PropsWithChildren, ReactElement } from "react";
import MarkerClusterGroup from "next-leaflet-cluster";
import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import { LatLngTuple } from "leaflet";

import "leaflet/dist/leaflet.css";

import { DEFAULT_MAP_ZOOM, FRANCE_CENTER } from "../../../constants";
import { createGroupIcon } from "./GroupMarker";

const MAX_BOUNDS: LatLngTuple[] = [
  [38.976492485539424, -5.9326171875],
  [53.291489065300226, 9.667968750000002],
];

export const Map = ({ children }: PropsWithChildren): ReactElement => {
  return (
    <>
      <MapContainer
        center={FRANCE_CENTER}
        zoom={DEFAULT_MAP_ZOOM}
        scrollWheelZoom={true}
        maxBounds={MAX_BOUNDS}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          minZoom={DEFAULT_MAP_ZOOM}
        />
        <MarkerClusterGroup
          chunkedLoading={true}
          showCoverageOnHover={false}
          iconCreateFunction={createGroupIcon}
        >
          {children}
        </MarkerClusterGroup>
      </MapContainer>
    </>
  );
};
