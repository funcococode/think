import { env } from "process";

export const CONSTANTS = {
    'BASE_URL' : env.BASE_URL ?? 'http://localhost:3000',
    'SOCIAL_URL' : env.SOCIAL_URL ?? 'http://localhost:3000/home'
}