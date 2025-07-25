import React from "react";

export default function FinalisationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex flex-col gap-2 px-2">{children}</div>;
}
