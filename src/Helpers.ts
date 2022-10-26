export const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));
export const rand = (max: number) => Math.floor(Math.random() * max);
