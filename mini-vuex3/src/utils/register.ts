import type { Opts } from '../core';

export function registerState(opts: Opts) {
    const moduleStates = {};

    Object.values(opts.modules || {}).forEach((module) => {
        moduleStates[module.name] = module.state || {};
    });

    return {
        ...moduleStates,
        ...(opts.state || {})
    };
}

function reactiveGetters({ getters = {}, state = {} }) {
    for (let key in getters) {
        return Object.defineProperty({}, key, {
            get() {
                let fn = Reflect.get(getters, key);

                if (typeof fn === 'function') {
                    return fn(state);
                }

                return undefined;
            },
            set(key) {
                console.error(`Cannot set getters ${key}`);
            }
        });
    }
}

/**
 * 注册 getters
 * @param state
 * @param getters
 * @returns
 */
export function registerGetters(opts: Opts) {
    const getters = {};

    if (typeof opts !== 'undefined') {
        Object.assign(getters, reactiveGetters(opts));
    }

    Object.values(opts.modules || {}).forEach((module) => {
        Object.assign(getters, {
            [module.name]: reactiveGetters(module)
        });
    });

    return getters;
}
