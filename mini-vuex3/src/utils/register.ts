import type {
    StoreOpts,
    Modules,
    Module,
    Mutations,
    Actions,
    Action
} from '../types';
import { reactiveGetters } from './reactive';

/**
 * 设置
 * @param moduleName
 * @param data
 * @returns
 */
function setModuleNameDataKey(
    moduleName: string,
    data: { [key: string]: Function }
) {
    const res = {};

    Object.keys(data).forEach((key) => {
        const newKey = moduleName + '/' + key;

        res[newKey] = data[key];
    });

    return res;
}

/**
 * 注册 state
 * @param opts
 * @returns
 */
export function registerState(opts: StoreOpts) {
    const moduleStates = {};

    Object.values(opts.modules || {}).forEach((module) => {
        moduleStates[module.name] = module.state || {};
    });

    return {
        ...moduleStates,
        ...(opts.state || {})
    };
}

/**
 * 注册 getters
 * @param state
 * @param getters
 * @returns
 */
export function registerGetters(opts: StoreOpts) {
    const getters: any = {};

    reactiveGetters(opts.getters, this.state, getters);

    Object.values(opts.modules || {}).forEach((module) => {
        if (module.namespaced === true) {
            const newGetters = setModuleNameDataKey(
                module.name,
                module.getters
            );
            reactiveGetters(newGetters, this.state[module.name], getters);
        } else {
            reactiveGetters(module.getters, this.state[module.name], getters);
        }
    });

    return getters;
}

/**
 * 注册 modules
 * @param opts
 */
export function registerModules(
    mutations: Mutations,
    actions: Actions,
    modules: Modules
) {
    Object.keys(modules).forEach((key) => {
        const module = modules[key] as Module & {
            _actions: Actions;
            _mutations: Mutations;
        };

        // 修改键名
        Reflect.set(module, '_actions', module.actions);
        Reflect.set(module, '_mutations', module.mutations);
        Reflect.deleteProperty(module, 'actions');
        Reflect.deleteProperty(module, 'mutations');

        let moduleActions = module._actions;
        let moduleMutations = module._mutations;

        if (module.namespaced === true) {
            moduleMutations = setModuleNameDataKey(
                module.name,
                moduleMutations
            );
            moduleActions = setModuleNameDataKey(module.name, moduleActions);
        }

        Object.assign(mutations, moduleMutations);
        Object.assign(actions, moduleActions);
    });
}
