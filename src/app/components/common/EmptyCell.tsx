import { ReactElement } from "react";

export const EmptyCell = (): ReactElement => {
  return (
    <div className="flex justify-center">
      <div className="w-2 h-2 bg-disabled-grey rounded-lg m-4" />
    </div>
  );
};
