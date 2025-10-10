export const getFinanceFormTutorialLink = ({
  isAutorisee,
  isSubventionnee,
  hasCpom,
}: {
  isAutorisee: boolean;
  isSubventionnee: boolean;
  hasCpom: boolean;
}): string => {
  if (isAutorisee && hasCpom) {
    return "https://www.loom.com/share/e27a0e312d3c4d0d9aa609970ae5a7f4?sid=4bfe4fbd-32de-4560-b7e2-6ab576cadaaf";
  }
  if (isAutorisee && !hasCpom) {
    return "https://www.loom.com/share/c5f156d305404effb7e6b33b82afb7eb?sid=a4939232-0a86-466a-9c0c-44d32c1b8b80";
  }
  if (isSubventionnee && hasCpom) {
    return "https://www.loom.com/share/afb74bbadc604e48ab64c854f41223aa?sid=8188601d-3ba8-40d7-b6f2-3dca761d831b";
  }
  if (isSubventionnee && !hasCpom) {
    return "https://www.loom.com/share/558e836ecbfe45cc9afaedd6851ca5c4?sid=f00d8670-f7ee-43b8-ae4c-5269ae857ba2";
  }
  return "";
};
