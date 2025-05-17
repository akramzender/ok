import React from "react";
import { Spinner } from "./spinner";
import { cn } from "@/lib/utils";

interface Props {
    state: boolean;
    className?: string;
    color?: string;
    children?: React.ReactNode;
}

const Loader = ({ state, className, children }: Props) => {
    return state ? (
        <div className={cn(className)}>
            <Spinner />
        </div>
    ) : (
        // Render the children passed to the component
        <>{children}</>
    );
};

export default Loader;
