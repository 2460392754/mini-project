import type Vue from 'vue';
import { config } from '../config';
import { registerState, registerGetters, isModuleType } from '../utils';

type Payload = any;

type Getter = (state: State) => void;
type Mutation = (state: State, payload: Payload) => void;
type Action = ({ state: State, commit: Mutations }, payload: Payload) => void;

interface State {
    [key: string]: any;
}

export interface Getters {
    [key: string]: Getter;
}

interface Mutations {
    [key: string]: Mutation;
}

interface Actions {
    [key: string]: Action;
}

interface Module {
    name: string;
    state?: State;
    getters?: Getters;
    mutations?: Mutations;
    actions?: Actions;
}

interface Modules {
    [key: string]: Module;
}

export interface Opts {
    state?: State;
    getters?: Getters;
    mutations?: Mutations;
    actions?: Actions;
    modules?: Modules;
}

export class store {
    private _vm: Vue = null;
    private mutations = Object.create(null);
    private actions = Object.create(null);
    private modules = Object.create(null);

    getters = null;

    constructor(opts: Opts) {
        this._vm = new config._vue({
            data() {
                return {
                    $$state: registerState(opts)
                };
            }
        });

        this.getters = registerGetters(opts);
        this.mutations = opts.mutations || {};
        this.actions = opts.actions || {};
        this.modules = opts.modules || {};
    }

    get state() {
        return (this._vm as any)._data.$$state;
    }

    commit(type: string, payload: Payload) {
        let func: Mutation, state: State;

        if (isModuleType(type)) {
            const [name, moduleType] = type.split('/');
            const module = this.modules[name];

            state = module.state;
            func = module.mutations[moduleType];
        } else {
            state = this.state;
            func = this.mutations[type];
        }

        // 未定义属性
        if (typeof func === 'undefined') {
            throw new Error(`unknown mutation type: ${type}`);
        }

        func.call(this, state, payload);
    }

    dispatch(type: string, payload: Payload) {
        let func: Action, store: any;

        if (isModuleType(type)) {
            const [name, moduleType] = type.split('/');
            const module = this.modules[name];

            func = module.actions[moduleType];
            store = module;
            Object.assign(store, {
                commit: this.commit.bind(store),
                dispatch: this.commit.bind(store)
            });
        } else {
            store = this;
            func = this.actions[type];
        }

        // 未定义属性
        if (typeof func === 'undefined') {
            throw new Error(`unknown action type: ${type}`);
        }

        func.call(this, store, payload);
    }
}
