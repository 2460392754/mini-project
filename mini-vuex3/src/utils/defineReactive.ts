import { Getters } from '../core';

/**
 * 数据代理
 * @param getters
 * @param key
 */
export function defineReactive(getters: Getters, key: string) {
    Object.defineProperty(getters, key, {
        enumerable: true,
        get: () => getters[key]
    });
}
