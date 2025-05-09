"use client";

import { useEffect, useMemo } from "react";
import { useState } from "react";
import { getUser } from "./api/usersAPI";
import { Button, Card, Row } from "antd";
import Image from "next/image";
import { TPagination, TUser } from "./type";
import UsersAPIResponse from "./api/types/UsersAPIResponse";
import UsersAPIRequest from "./api/types/UsersApIRequest";

export default function Home() {
  const defaultPagination = { skip: 0, limit: 30, total: 0 };

  const [usersList, setUsersList] = useState<TUser[]>([]);
  const [currentPagination, setCurrentPagination] =
    useState<TPagination>(defaultPagination);
  const [isLoading, setIsLoading] = useState(true);
  const [isNextDisable, setIsNextDisable] = useState(false);

  const callUser = async (props: UsersAPIRequest) => {
    await setIsLoading(true);
    const response: UsersAPIResponse = await getUser(props);
    setIsLoading(false);
    await setUsersList(response.users);
    await setCurrentPagination({
      skip: response.skip,
      limit: response.limit,
      total: response.total,
    });
  };

  useEffect(() => {
    callUser({ skip: defaultPagination.skip, limit: defaultPagination.limit });
  }, []);

  const onNext = () => {
    const { limit, skip, total } = currentPagination;
    const newSkip =
      typeof skip === "number" && typeof limit === "number" ? skip + limit : 0;

    if (total > newSkip) {
      setCurrentPagination({ ...currentPagination, skip: newSkip });

      callUser({ skip: newSkip, limit });

      if (typeof total === "number" && typeof limit === "number")
        setIsNextDisable(total <= newSkip + limit);
    }
  };

  const onPreviews = () => {
    const { limit, skip } = currentPagination;
    const newSkip =
      typeof skip === "number" && typeof limit === "number" ? skip - limit : 0;
    if (newSkip >= 0) {
      setCurrentPagination({ ...currentPagination, skip: newSkip });
      callUser({ skip: newSkip, limit });
    }

    if (isNextDisable) setIsNextDisable(false);
  };

  const currentPage: number = useMemo(() => {
    const skip = currentPagination?.skip ?? 0;
    const limit = currentPagination?.limit ?? 30;

    return Math.floor(skip / limit) + 1;
  }, [currentPagination.limit, currentPagination.skip]);

  if (isLoading) return <p>Loading...</p>;

  return (
    <>
      <Row style={{ justifyContent: "center" }}>
        {usersList?.map((item) => {
          return (
            <Card
              key={`__${item.id}`}
              style={{ width: 200, margin: 16, textAlign: "center" }}
            >
              <p>{`${item.firstName} ${item.lastName}`}</p>
              {item?.image && (
                <Image
                  src={item.image}
                  width={50}
                  height={50}
                  alt={`image-${item.id}`}
                />
              )}
            </Card>
          );
        })}
      </Row>
      <Row style={{ alignItems: "center", justifyContent: "center" }}>
        <p>{`Page: ${currentPage}`}</p>
        <Button
          disabled={currentPage === 1}
          style={{ marginLeft: 16 }}
          onClick={onPreviews}
        >
          Prev
        </Button>
        <Button
          disabled={isNextDisable}
          style={{ marginLeft: 16 }}
          onClick={onNext}
        >
          Next
        </Button>
      </Row>
    </>
  );
}
