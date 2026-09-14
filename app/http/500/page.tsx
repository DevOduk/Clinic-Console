import { Metadata } from "next";
import Http500TestPage from "./ErrorPage";

export const metadata: Metadata = {
  title: "Error | Clinic - Inventory Management Solution",
  description:
    "Manage your clinic stock inventory with ease. Update prices and stock count with one click!",
};

export default function Http500() {
  return <Http500TestPage />;
}
