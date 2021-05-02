import { EmailPasswordInput } from "src/resolvers/EmailPasswordInput";

export const validateRegister = (options: EmailPasswordInput) => {
  if (options.email.length < 8) {
    return [
      {
        field: "email",
        message: "length must be greater than 8",
      },
    ];
  }
  if (!options.email.includes("@")) {
    return [
      {
        field: "email",
        message: "invalid email",
      },
    ];
  }
  if (options.password.length < 8) {
    return [
      {
        field: "password",
        message: "length must be greater than 8",
      },
    ];
  }

  return null;
};
