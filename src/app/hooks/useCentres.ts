import { useEffect, useState } from "react";
import { Centre } from "../../types/centre.type";

export const useCentres = () => {
  const [centres, setCentres] = useState<Centre[]>([]);
  useEffect(() => {
    const getCentres = async () => {
      const result = await fetch("/api/centres");
      const centres = await result.json();
      setCentres(centres);
    };
    getCentres();
  }, []);

  return centres;
};
