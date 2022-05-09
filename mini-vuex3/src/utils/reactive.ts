import { Getters, State } from '../types';

/**
 * 劫持 getters 对象，处理成响应式内容
 * @param getters
 * @param state
 * @param res
 */
export function reactiveGetters(getters: Getters, state: State, res: { [key: string]: Function }) {
    for (let key in getters) {
        Object.defineProperty(res, key, {
            get: () => {
                return getters[key](state);
            },

            set(key) {
                console.error(`Cannot set getters ${key}`);
            },
        });
    }
}
