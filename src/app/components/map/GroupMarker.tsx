import { DivIcon, divIcon } from "leaflet";

export const createGroupIcon = (cluster: Cluster): DivIcon => {
  return divIcon({
    html: `
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="20" fill="#000091" stroke="#DDDDDD"/>
        <text x="50%" y="50%" text-anchor="middle" alignment-baseline="middle" fill="white" font-size="" font-weight="700">
          ${cluster.getChildCount()}
        </text>
      </svg>
    `,
  });
};

type Cluster = {
  getChildCount: () => number;
};
