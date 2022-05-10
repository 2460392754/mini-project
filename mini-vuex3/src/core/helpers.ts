/**
 * 格式化 参数（命名空间和数据）
 * @param namespace
 * @param map
 * @returns
 */
function normalizeNamespace(moduleName: string, opts: any) {
    // 未定义 moduleName
    if (typeof moduleName !== 'string') {
        return {
            moduleName: null,
            opts: moduleName,
        };
    }

    return {
        moduleName,
        opts,
    };
}

/**
 * 处理命名空间（module类型）
 * @param moduleName
 */
function handleModuleStore(moduleName: string | null) {
    return moduleName === null ? this.$store : this.$store._modules[moduleName];
}

/**
 * 处理命名空间（module类型）
 * @param moduleName
 */
function handleModuleType(moduleName: string | null, type: string, key: string | undefined) {
    if (type === 'state') {
        return moduleName === null ? this.$store[type] : this.$store[type][moduleName];
    }

    if (key === undefined) {
        return this.$store[type];
    }

    let newKey = key;

    if (moduleName !== null) {
        newKey = moduleName + '/' + key;
    }

    return this.$store[type][newKey];
}

/**
 * 辅助工具 mapState
 * @returns
 */
export function mapState() {
    const { moduleName, opts } = normalizeNamespace(arguments[0], arguments[1]);
    const resFunc = {};

    // 数组内容，例如： mapState(['x1', 'x2']) 或 mapState('xxxModule', ['xxx1', 'xxx2'])
    if (Array.isArray(opts)) {
        opts.forEach((stateKey) => {
            resFunc[stateKey] = function () {
                return handleModuleType.call(this, moduleName, 'state')[stateKey];
            };
        });
    }

    // 处理对象结构
    else {
        for (const [newStateKey, val] of Object.entries<string | Function>(opts)) {
            // mapState({ xxFunc: (state) => state.xx1 }) 或  mapState({ xxFunc(state){ return state.xx1 + this.xxx1 } })
            if (typeof val === 'function') {
                resFunc[newStateKey] = function () {
                    const state = handleModuleType.call(this, moduleName, 'state');

                    // 修改this指向，处理 回调函数中使用当前vm实例中的 data 或 computed 变量
                    return val.call(this, state);
                };
            }

            // mapState({ xxxxxxx1: 'x1' }) 或 mapState('xxxModule', { xxxxxxx1: 'x1' })
            else {
                resFunc[newStateKey] = function () {
                    return handleModuleType.call(this, moduleName, 'state')[val];
                };
            }
        }
    }

    return resFunc;
}

/**
 * 辅助工具 mapGetters
 * @returns
 */
export function mapGetters() {
    const { moduleName, opts } = normalizeNamespace(arguments[0], arguments[1]);
    const resFunc = {};

    // 数组内容，例如： mapGetters(['x1', 'x2']) 或 mapGetters('xxxModule', ['xxx1', 'xxx2'])
    if (Array.isArray(opts)) {
        opts.forEach((getterKey) => {
            resFunc[getterKey] = function () {
                return handleModuleType.call(this, moduleName, 'getters', getterKey);
            };
        });
    } else {
        // mapGetters({ xxxxxxx1: 'x1' }) 或 mapGetters('xxxModule', { xxxxxxx1: 'x1' })
        for (const [newGetterKey, oldGetterKey] of Object.entries<string>(opts)) {
            resFunc[newGetterKey] = function () {
                return handleModuleType.call(this, moduleName, 'getters', oldGetterKey);
            };
        }
    }

    return resFunc;
}

/**
 * 辅助工具 mapMutations
 * @returns
 */
export function mapMutations() {
    const { moduleName, opts } = normalizeNamespace(arguments[0], arguments[1]);
    const resFunc = {};

    // 数组内容，例如： mapMutations(['x1', 'x2']) 或 mapMutations('xxxModule', ['xxx1', 'xxx2'])
    if (Array.isArray(opts)) {
        opts.forEach((getterKey) => {
            resFunc[getterKey] = function (payload) {
                const func = handleModuleType.call(this, moduleName, '_mutations', getterKey);
                const state = handleModuleType.call(this, moduleName, 'state');

                return func(state, payload);
            };
        });
    } else {
        for (const [newGetterKey, oldGetterKey] of Object.entries<string>(opts)) {
            // mapMutations({ xxxxxxx1: 'x1' }) 或 mapMutations('xxxModule', { xxxxxxx1: 'x1' })
            resFunc[newGetterKey] = function (payload) {
                const func = handleModuleType.call(this, moduleName, '_mutations', oldGetterKey);
                const state = handleModuleType.call(this, moduleName, 'state');

                return func(state, payload);
            };
        }
    }

    return resFunc;
}

/**
 * 辅助工具 mapActions
 * @returns
 */
export function mapActions() {
    const { moduleName, opts } = normalizeNamespace(arguments[0], arguments[1]);
    const resFunc = {};

    // 数组内容，例如： mapActions(['x1', 'x2']) 或 mapActions('xxxModule', ['xxx1', 'xxx2'])
    if (Array.isArray(opts)) {
        opts.forEach((getterKey) => {
            resFunc[getterKey] = function (payload) {
                const func = handleModuleType.call(this, moduleName, '_actions', getterKey);
                let store = handleModuleStore.call(this, moduleName);

                store = Object.assign(
                    { ...store },
                    {
                        commit: this.$store.commit.bind(store),
                        dispatch: this.$store.dispatch.bind(store),
                    }
                );

                return func(store, payload);
            };
        });
    } else {
        for (const [newGetterKey, oldGetterKey] of Object.entries<string>(opts)) {
            // mapActions({ xxxxxxx1: 'x1' }) 或 mapActions('xxxModule', { xxxxxxx1: 'x1' })
            resFunc[newGetterKey] = function (payload) {
                let store = handleModuleStore.call(this, moduleName, '_actions', oldGetterKey);

                store = Object.assign(
                    { ...store },
                    {
                        commit: this.$store.commit.bind(store),
                        dispatch: this.$store.dispatch.bind(store),
                    }
                );

                return store['_actions'][oldGetterKey](store, payload);
            };
        }
    }

    return resFunc;
}
