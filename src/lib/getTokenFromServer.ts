import { headers } from "next/headers";
import { auth } from "./auth";

export const getTokenFromServer = async () => {
  const jwtToken = await auth.api.getToken({
    headers: await headers(),
  });
  return jwtToken?.token;
};
