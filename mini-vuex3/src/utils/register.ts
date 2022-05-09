import type {
    StoreOpts,
    State,
    Modules,
    Module,
    Mutations,
    Actions
} from '../types';
import { reactiveGetters } from './reactive';

/**
 * 修改 modules 中对象的键名, 使用 module.name 追加拼接
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

    return Object.assign(moduleStates, opts.state || {});
}

/**
 * 注册 getters
 */
export function registerGetters(state: State, opts: StoreOpts) {
    const getters: any = {};

    reactiveGetters(opts.getters, state, getters);

    Object.values(opts.modules || {}).forEach((module) => {
        if (module.namespaced === true) {
            const newGetters = setModuleNameDataKey(
                module.name,
                module.getters
            );
            reactiveGetters(newGetters, state[module.name], getters);
        } else {
            reactiveGetters(module.getters, state[module.name], getters);
        }
    });

    return getters;
}

/**
 * 注册 modules
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
