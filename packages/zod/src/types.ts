import { z } from "zod";

export const CreateUserSchema=z.object({
    name:z.string(),
    username: z.string().min(5).max(10),
    email: z.string(),
    password: z.string()
});

export const SignInSchema=z.object({
    username: z.string().min(5).max(10),
    password: z.string()
});

export const RoomSchema=z.object({
    roomId:z.string()
});