import type { VueConstructor } from 'vue';
import type Vue from 'vue';
import {
    registerState,
    registerGetters,
    registerModules,
    isModuleType
} from '../utils';
import type { StoreOpts, Payload, Mutation, Action, State } from '../types';

let _vue: VueConstructor;

export class store {
    private _vm: Vue = null;
    private _mutations = Object.create(null);
    private _actions = Object.create(null);
    private _modules = Object.create(null);

    static install(vue: VueConstructor) {
        _vue = vue;
    }

    getters = null;

    constructor(opts: StoreOpts) {
        _vue.prototype.$store = this;

        this._vm = new _vue({
            data() {
                return {
                    $$state: registerState(opts)
                };
            }
        });

        this.getters = registerGetters.call(this, opts || {});
        this._mutations = opts.mutations || {};
        this._actions = opts.actions || {};
        this._modules = opts.modules || {};

        registerModules(this._mutations, this._actions, this._modules);
    }

    get state() {
        return (this._vm as any)._data.$$state;
    }

    commit(type: string, payload: Payload) {
        const func: Mutation = this._mutations[type];
        let state: State;

        if (isModuleType(type)) {
            const name = type.split('/')[0];
            const module = this._modules[name];

            state = module.state;
        } else {
            state = this.state;
        }

        // 未定义属性
        if (typeof func === 'undefined') {
            throw new Error(`unknown mutation type: ${type}`);
        }

        func.call(this, state, payload);
    }

    dispatch(type: string, payload: Payload) {
        const func: Action = this._actions[type];
        let store: any;

        if (isModuleType(type)) {
            const name = type.split('/')[0];
            const module = this._modules[name];

            store = module;
            // 修改作用域范围
            Object.assign(store, {
                commit: this.commit.bind(store),
                dispatch: this.dispatch.bind(store)
            });
        } else {
            store = this;
        }

        // 未定义属性
        if (typeof func === 'undefined') {
            throw new Error(`unknown action type: ${type}`);
        }

        func.call(this, store, payload);
    }
}
