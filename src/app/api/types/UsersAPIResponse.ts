import { TPagination, TUser } from "../../type";

type UsersAPIResponse = TPagination & {
  users: TUser[];
};

export default UsersAPIResponse;
