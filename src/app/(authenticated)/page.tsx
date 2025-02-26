import { redirect } from "next/navigation";
import { ReactElement } from "react";

export default function AuthenticatedHome(): ReactElement {
  redirect("/centres");
}
