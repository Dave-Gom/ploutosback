export const cleanFileName = (fileName: string) => {
    const file = fileName.split('.').shift();
    return file;
};
