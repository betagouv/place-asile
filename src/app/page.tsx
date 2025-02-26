import { redirect } from "next/navigation";
import { ReactElement } from "react";

export default function Home(): ReactElement {
  redirect("/centres");
}
