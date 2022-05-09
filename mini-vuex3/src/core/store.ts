import type { VueConstructor } from 'vue';
import type Vue from 'vue';
import { registerState, registerGetters, registerModules, isModuleType } from '../utils';
import type { StoreOpts, Payload, Mutation, Action, State } from '../types';

// 保存当前vue引用, 确保和项目使用相同的引用
let _vue: VueConstructor;

export class store {
    private _vm: Vue = null;
    private _mutations = null;
    private _actions = null;
    private _modules = null;

    getters = null;

    /**
     * 插件注册
     * @param vue
     */
    static install(vue: VueConstructor) {
        _vue = vue;
    }

    /**
     * 设置 state的get访问器
     */
    get state(): State {
        return this._vm.$data._state;
    }

    /**
     * 设置 state的set访问器
     * 禁止直接写入数据
     */
    set state(v: any) {
        throw new Error("can't set state: " + v);
    }

    constructor(opts: StoreOpts) {
        // 添加 原型属性，指向当前store实例化后的对象
        _vue.prototype.$store = this;

        // _state对象 响应式处理, 需要通知项目视图更新
        this._vm = new _vue({
            data() {
                return {
                    _state: registerState(opts),
                };
            },
        });

        this.getters = registerGetters(this.state, opts || {});
        this._mutations = opts.mutations || {};
        this._actions = opts.actions || {};
        this._modules = opts.modules || {};

        registerModules(this._mutations, this._actions, this._modules);
    }

    /**
     *
     * @param type
     * @param payload
     */
    commit(type: string, payload: Payload) {
        const func: Mutation = this._mutations[type];
        let state: State;

        // 未定义属性
        if (typeof func === 'undefined') {
            throw new Error(`unknown mutation type: ${type}`);
        }

        if (isModuleType(type)) {
            const name = type.split('/')[0];
            const module = this._modules[name];

            state = module.state;
        } else {
            state = this.state;
        }

        func.call(this, state, payload);
    }

    /**
     *
     * @param type
     * @param payload
     */
    dispatch(type: string, payload: Payload) {
        const func: Action = this._actions[type];
        let store: any;

        // 未定义属性
        if (typeof func === 'undefined') {
            throw new Error(`unknown action type: ${type}`);
        }

        if (isModuleType(type)) {
            const name = type.split('/')[0];
            const module = this._modules[name];

            store = module;
            // 修改作用域范围
            Object.assign(store, {
                commit: this.commit.bind(store),
                dispatch: this.dispatch.bind(store),
            });
        } else {
            store = this;
        }

        func.call(this, store, payload);
    }
}
