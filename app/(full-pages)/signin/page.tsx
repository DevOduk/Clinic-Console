import { Metadata } from "next";
import SigninPage from "@/app/components/Pages/SigninPage";

export const metadata: Metadata = {
  title: "Signin | Clinic - Inventory Management Solution",
  description:
    "Manage your clinic stock inventory with ease. Update prices and stock count with one click!",
};

function Signin() {
  return (
    <SigninPage />
  )
}

export default Signin;
