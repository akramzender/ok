import { AiFillHome } from "react-icons/ai";
import { MdLibraryAdd } from "react-icons/md";
import { IoIosNotifications } from "react-icons/io";
import { MdLocalGroceryStore } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";





export const MENU_ITEMS = (workspaceId:string):{
        title:string; href:string ; icon:React.ReactNode

}[]=>[
    {title:'home',href:`/dashboard/${workspaceId}/home`, icon:<AiFillHome/>},
    {title:'My Library',href:`/dashboard/${workspaceId}`, icon:<MdLibraryAdd/>},
    {title:'Notifications',href:`/dashboard/${workspaceId}/notifications`, icon:<IoIosNotifications/>},
    {title:'Billing',href:`/dashboard/${workspaceId}/billing`, icon:<MdLocalGroceryStore/>},
    {title:'Settings',href:`/dashboard/${workspaceId}/settings`, icon:<IoMdSettings/>},

    

]