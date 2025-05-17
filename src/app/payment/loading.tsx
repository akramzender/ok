import React from "react";
import { Spinner } from "@/components/global/loader/spinner";
import { Spinners } from "@/components/global/loader/spinnerStripe";

type Props = {};

const LoadingPage = (props: Props) => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-[#1e1e1e] to-[#121212]">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <Spinners color="#00d293" />

        {/* Loading Text */}
        <p className="text-lg font-medium text-gray-300 animate-pulse">
          Loading, please wait...
        </p>
      </div>
    </div>
  );
};

export default LoadingPage;