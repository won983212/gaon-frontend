export function omitKeys(obj: any, keys: Array<string>) {
    let dup: any = {};
    for (const key in obj) {
        if (keys.indexOf(key) === -1) {
            dup[key] = obj[key];
        }
    }
    return dup;
}