import { authClient } from "./auth-client";

export const getTokenFromClient = async () => {
  const { data, error } = await authClient.token();
  // console.log(data?.token);
  return data?.token;
};
