export const generateErrorPayload = (error) => {
  let errorPayload = {
    message: error.message,
  };
  if (error.response) {
    errorPayload =
      error.response.data?.code === 500
        ? {
            message: "Something went wrong!",
          }
        : error.response.data;
  }

  return errorPayload;
};
