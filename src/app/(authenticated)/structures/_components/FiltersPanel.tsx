import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { FiltersBatis } from "./FiltersBatis";
import { FiltersPlacesAutorisees } from "./FiltersPlacesAutorisees";
import { FiltersReinitializer } from "./FiltersReinitializer";
import { FiltersTypes } from "./FiltersTypes";

export const FiltersPanel = () => {
  const [key, setKey] = useState(uuidv4());

  return (
    <div
      key={key}
      className="absolute top-full right-0 mt-1 w-96 bg-white rounded-md shadow-md"
    >
      <FiltersTypes />
      <hr className="p-1!" />
      <FiltersBatis />
      <hr className="p-1!" />
      <FiltersPlacesAutorisees />
      <hr className="p-1!" />
      <FiltersReinitializer setKey={setKey} />
    </div>
  );
};
