import { PropsWithChildren, ReactElement } from "react";

export const Block = ({
  title,
  iconClass,
  onEdit,
  children,
}: Props): ReactElement => {
  return (
    <div className="bg-white p-8 border border-default-grey rounded-[10px] border-solid">
      <div className="flex justify-between items-start">
        <div className="flex">
          <span className={`text-title-blue-france fr-mr-1w ${iconClass}`} />
          <h3 className="text-title-blue-france fr-h5">{title}</h3>
        </div>
        {onEdit && (
          <button className="fr-btn fr-btn--tertiary" onClick={onEdit}>
            <span className="fr-icon-edit-line fr-icon--sm pr-2" />
            Modifier
          </button>
        )}
      </div>
      {children}
    </div>
  );
};

type Props = PropsWithChildren<{
  title: string;
  iconClass: string;
  onEdit?: () => void;
}>;
