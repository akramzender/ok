import { onAuthenticateUser } from "@/actions/user";
import { redirect } from "next/navigation";


const AutoCallbackPage = async () => {
  const Auth = await onAuthenticateUser();
  if (Auth.status === 200 || Auth.status === 201) {
    return redirect(`/dashboard/${Auth.user?.workspace[0].id}`);
  }
  if (Auth.status === 400 || Auth.status === 500 || Auth.status === 404) {
    return redirect('/auth/sign-in');
    }
  }


export default AutoCallbackPage;
