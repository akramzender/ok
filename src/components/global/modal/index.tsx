
import { Dialog, DialogContent, DialogHeader, DialogTrigger,DialogTitle, DialogDescription } from "@/components/ui/dialog";
import React from "react";
type Props = {
    trigger: React.ReactNode;
    title: string;
    description: string;
    className?: string;
    children: React.ReactNode;
}
export const Modal = ({ trigger, title, description, children, className }: Props) => {
    return <Dialog>
        <DialogTrigger className={className} asChild>
            {trigger}
        </DialogTrigger>
        <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                {children}
        </DialogContent>
    </Dialog>
}

export default Modal;