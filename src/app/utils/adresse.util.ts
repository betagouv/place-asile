export const getCoordinates = async (address: string): Promise<Coordinates> => {
  try {
    const result = await fetch(
      `https://api-adresse.data.gouv.fr/search/?q=${address}&autocomplete=0&limit=1`
    );

    if (!result.ok) {
      throw new Error(`HTTP ${result.status}: ${result.statusText}`);
    }

    const data = await result.json();
    const coordinates = data?.features?.[0]?.geometry?.coordinates;
    return {
      longitude: coordinates?.[0],
      latitude: coordinates?.[1],
    };
  } catch (error) {
    console.warn(`Failed to get coordinates for address: ${address}`, error);
    return {
      longitude: undefined,
      latitude: undefined,
    };
  }
};

type Coordinates = {
  latitude: number | undefined;
  longitude: number | undefined;
};
