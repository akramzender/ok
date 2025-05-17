import React from "react";
export const  WorkspacePlaceholder = ({children}:{children:React.ReactNode}) => {
    return <span className="bg-[#545454] flex items-center font-bold justify-center w-8 px-2 h-7 rounded-sm text-[#1d1d1d]">{children}</span>
}



export default WorkspacePlaceholder