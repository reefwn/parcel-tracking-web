require("dotenv").config();

export const getThaiPostAuth = async () => {
  let res = await fetch(`${process.env.TP_AUTH_ENDPOINT}`, {
    method: "POST",
    headers: {
      Authorization: `Token ${process.env.TP_TOKEN}`,
      "Content-Type": "application/json",
    },
  });
  let response = await res.json();
  return response;
};
