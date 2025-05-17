import React from "react";
import LandingPageNavbar from "./_components/navbar";
import LandingPage from "./_components/landingPage";

type Props = {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <div className="flex flex-col py-10 px-10 xl:px-0 container">
         
      {children}
    </div>
  )
}

export default Layout;
