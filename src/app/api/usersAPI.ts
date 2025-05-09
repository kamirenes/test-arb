import UsersAPIRequest from "./types/UsersApIRequest";

export const getUser = async (props: UsersAPIRequest) => {
  const { skip, limit } = props;

  const skipString = `skip=${skip}`;
  const limitString = limit ? `&limit=${limit}` : "";

  const response = await fetch(
    `https://dummyjson.com/users?${skipString}${limitString}`,
    { method: "GET", headers: { "Content-type": "application/json" } }
  );
  if (!response) return null;
  return response.json();
};
