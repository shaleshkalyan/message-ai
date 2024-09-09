import z from "zod";

const acceptMessage = z.boolean()

export const userMessage = z.object({
    isAcceptingMessage : acceptMessage,
});
