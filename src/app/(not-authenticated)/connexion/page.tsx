import { Logo } from "@/app/components/Logo";
import { ReactElement } from "react";
import { ProConnect } from "./ProConnect";

export default function Login(): ReactElement {
  return (
    <div className="fr-connect-group fr-mt-3w">
      <Logo />
      <ProConnect />
    </div>
  );
}
