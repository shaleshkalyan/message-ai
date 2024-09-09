import z from "zod";

const UserNameValidation = z
        .string()
        .min(5, "User Name must contain atleast 5 characters")
        .max(8, "User Name must not be more than 8 characters")
const passwordValidation = z
        .string()
        .min(5, "Password must contain atleast 5 characters")
        .max(8, "Password must not be more than 8 characters")

export const LoginValidation = z.object({
    username : UserNameValidation,
    password : passwordValidation
});
