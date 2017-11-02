/**
 * Bcpt Middleware Utils
 *
 * Created by Alex Elkin on 02.11.2017.
 */


export const validateCallApiTypes = (types) => {
    if (!Array.isArray(types) || types.length !== 3)
        throw new Error('Expected an array of three action types.');
    if (!types.every(type => typeof type === 'string'))
        throw new Error('Expected action types to be strings.');
};

export const validateIsString = (value, error) => {
    if (!(typeof value === 'string'))
        throw new Error((error ? error + ": " : "") + 'Expected type: string. Provided type: ' + (typeof value));
};