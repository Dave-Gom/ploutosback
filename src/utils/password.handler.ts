import { compare, hash } from "bcryptjs";

export const encript = async (passPlane: string) => {
    const passwordHash = await hash(passPlane, 8);
    return passwordHash;
}

export const verify = async (passPlane: string, passwordHash: string) => {
    const isCorrect = await compare(passPlane, passwordHash);
    return isCorrect;
}