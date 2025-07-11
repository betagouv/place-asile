import { PropsWithChildren, ReactElement } from "react";

export const Block = ({ title, iconClass, children }: Props): ReactElement => {
  return (
    <div className="bg-white p-8 border border-default-grey rounded-[10px] border-solid">
      <div className="flex">
        <span className={`text-title-blue-france fr-mr-1w ${iconClass}`} />
        <h3 className="text-title-blue-france fr-h5">{title}</h3>
      </div>
      {children}
    </div>
  );
};

type Props = PropsWithChildren<{
  title: string;
  iconClass: string;
}>;
