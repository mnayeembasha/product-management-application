import crypto from "crypto";
export const sluggify = (input:string):string => {
    return input
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
}


export const generateSlug = (input:string):string => {
    const base = sluggify(input);
    const uniqueId = crypto.randomBytes(4).toString("hex");
    return `${base}-pm${uniqueId}`;
}
