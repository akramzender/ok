import Image from "next/image";
import styles from "./page.module.css";
import { SignIn } from "@clerk/nextjs";
import LandingPage from "./_components/landingPage";
import LandingPageNavbar from "./_components/navbar";

export default function Home() {
  return (
    <div>
      <LandingPageNavbar />
      <LandingPage />
    </div>
  )
}
