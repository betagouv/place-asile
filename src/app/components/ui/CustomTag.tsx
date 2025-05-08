import { PropsWithChildren, ReactElement } from "react";

export const CustomTag = ({ children }: PropsWithChildren): ReactElement => {
  return (
    <span className="bg-[#FEE7FC] text-[#6E445A] uppercase font-bold text-xs flex justify-center items-center rounded-sm px-2 ">
      {children}
    </span>
  );
};
