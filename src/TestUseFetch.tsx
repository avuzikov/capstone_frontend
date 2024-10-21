import React from "react";

import useFetch from "./hooks/useFetch.tsx";

const successFn = async () => {
  const response = await fetch("/users/login", {
    method: "POST",
    body: JSON.stringify({ email: "john@example.com", password: "password" }),
  });

  const resData = await response.json();

  if (!response.ok) {
    throw new Error(resData.message || "Failed to login!");
  }
  return resData;
};

const TestUseFetch = () => {
  const { data, isPending, error, fetchDispatch } = useFetch(successFn);

  console.log("Data: ", data);
  console.log("Is Pending: ", isPending);
  console.log("Error: ", error);

  return (
    <div>
      <div>{JSON.stringify(data)}</div>
      <button onClick={fetchDispatch}>Dispatch</button>
    </div>
  );
};

export default TestUseFetch;
