export type TUser = {
  id: number,
  firstName: string,
  lastName: string,
  image: string,
}

export type TBasicPagination = {
  skip?: number,
  limit?: number,
}

export type TPagination = TBasicPagination & {
  total: number,
}