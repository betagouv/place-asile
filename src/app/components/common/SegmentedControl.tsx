import { PropsWithChildren, ReactElement } from "react";

export const SegmentedControl = ({
  children,
  name,
  options,
}: Props): ReactElement => {
  return (
    <fieldset className="fr-segmented fr-segmented--sm">
      <legend className="fr-segmented__legend fr-segmented__legend--inline">
        {children}
      </legend>
      <div className="fr-segmented__elements">
        {options.map(({ id, isChecked, label, value, icon }) => (
          <div className="fr-segmented__element" key={id}>
            <input
              defaultChecked={isChecked}
              id={id}
              name={name}
              type="radio"
              value={value}
            />
            <label className={`fr-label ${icon} justify-center`} htmlFor={id}>
              {label}
            </label>
          </div>
        ))}
      </div>
    </fieldset>
  );
};

type Props = PropsWithChildren<
  Readonly<{
    name: string;
    options: ReadonlyArray<{
      id: string;
      isChecked: boolean;
      label: string;
      value: string;
      icon?: string;
    }>;
  }>
>;
