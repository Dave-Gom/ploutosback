const clientSecret = process.env.CLIENT_SECRET || 'clientSecret';

export const virifyToken = (secret: string) => {
    return secret === clientSecret;
};
