import React from "react";

export const Button = ({ title }: Props) => {
  return <button className="fr-btn">{title}</button>;
};

type Props = {
  title: string;
};
