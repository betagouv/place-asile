import { ReactElement } from "react";

export const InformationCard = ({
  primaryInformation,
  secondaryInformation,
}: Props): ReactElement => {
  return (
    <div className="px-3 py-1 rounded-xl bg-alt-blue-france flex-col w-[200] h-full flex justify-center items-center">
      <div className="text-2xl font-bold mb-0">{primaryInformation}</div>
      <div className="text-center">{secondaryInformation}</div>
    </div>
  );
};

type Props = {
  primaryInformation: string | number;
  secondaryInformation: string;
};
