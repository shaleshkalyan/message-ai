import z from "zod";

const acceptMessage = z.boolean()

export const userMessageValidation = z.object({
    isAcceptingMessage : acceptMessage,
});
