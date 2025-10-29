import { Notice } from "@codegouvfr/react-dsfr/Notice";

export const ContractualisationHuda = () => {
  return (
    <Notice
      severity="info"
      title=""
      className="rounded [&_p]:flex [&_p]:items-center mb-4 w-fit [&_.fr-notice\_\_desc]:text-text-default-grey"
      description="Dans le cas des structures HUDA, nous vous recommandons de renouveler les conventions sur un an seulement pour anticiper la transformation prochaine de ces structures en CADA."
    />
  );
};
