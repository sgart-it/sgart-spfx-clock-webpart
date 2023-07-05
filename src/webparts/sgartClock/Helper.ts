export const isNullOrWhiteSpace = (str: string): boolean => {
    if (undefined === str || null === str) return true;
    //if ('string' !== typeof str) throw 'Invalid type';
    if ((/^\s*$/g).test(str)) return true;
    return false;
};
