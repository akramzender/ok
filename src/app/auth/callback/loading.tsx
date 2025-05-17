import React from "react";
import { Spinner } from "@/components/global/loader/spinner";

const AutoLoading = () => {
    return (
        <div>
            <div className="flex h-screen w-full justify-center items-center">
                <Spinner />
            </div>
        </div>
    )
}

export default AutoLoading;