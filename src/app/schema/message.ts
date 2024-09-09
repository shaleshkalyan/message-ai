import z from "zod";

const Message = z
            .string()
            .min(10, "Message must contain atleast 5 characters")
            .max(200, "Message length should not be more than 200 characters")

export const messageValidation = z.object({
    content : Message,
});
