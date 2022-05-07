/**
 * 格式化 参数（命名空间和数据）
 * @param namespace
 * @param map
 * @returns
 */
function normalizeNamespace(namespace, map) {
    if (typeof namespace !== 'string') {
        map = namespace;
        namespace = null;
    }

    return {
        namespace,
        map
    };
}

/**
 * 处理命名空间（module类型）
 * @param namespace
 */
function handleModuleStore(namespace: string | null) {
    return namespace === null ? this.$store : this.$store._modules[namespace];
}

/**
 * 处理命名空间（module类型）
 * @param namespace
 */
function handleModuleType(
    namespace: string | null,
    type: string,
    key: string | undefined
) {
    if (type === 'state') {
        return namespace === null
            ? this.$store[type]
            : this.$store[type][namespace];
    }

    if (key === undefined) {
        return this.$store[type];
    }

    let newKey = key;

    if (namespace !== null) {
        newKey = namespace + '/' + key;
    }

    return this.$store[type][newKey];
}

/**
 * 辅助工具 mapState
 * @returns
 */
export function mapState() {
    const { namespace, map } = normalizeNamespace(arguments[0], arguments[1]);
    const resFunc = {};

    // 数组内容，例如： mapState(['x1', 'x2']) 或 mapState('xxxModule', ['xxx1', 'xxx2'])
    if (Array.isArray(map)) {
        map.forEach((stateKey) => {
            resFunc[stateKey] = function () {
                return handleModuleType.call(this, namespace, 'state')[
                    stateKey
                ];
            };
        });
    }

    // 处理对象结构
    else {
        for (const [newStateKey, val] of Object.entries<string | Function>(
            map
        )) {
            // mapState({ xxFunc: (state) => state.xx1 }) 或  mapState({ xxFunc(state){ return state.xx1 + this.xxx1 } })
            if (typeof val === 'function') {
                resFunc[newStateKey] = function () {
                    const state = handleModuleType.call(
                        this,
                        namespace,
                        'state'
                    );

                    // 修改this指向，处理 回调函数中使用当前vm实例中的 data 或 computed 变量
                    return val.call(this, state);
                };
            }

            // mapState({ xxxxxxx1: 'x1' }) 或 mapState('xxxModule', { xxxxxxx1: 'x1' })
            else {
                resFunc[newStateKey] = function () {
                    return handleModuleType.call(this, namespace, 'state')[val];
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
    const { namespace, map } = normalizeNamespace(arguments[0], arguments[1]);
    const resFunc = {};

    // 数组内容，例如： mapGetters(['x1', 'x2']) 或 mapGetters('xxxModule', ['xxx1', 'xxx2'])
    if (Array.isArray(map)) {
        map.forEach((getterKey) => {
            resFunc[getterKey] = function () {
                return handleModuleType.call(
                    this,
                    namespace,
                    'getters',
                    getterKey
                );
            };
        });
    } else {
        // mapGetters({ xxxxxxx1: 'x1' }) 或 mapGetters('xxxModule', { xxxxxxx1: 'x1' })
        for (const [newGetterKey, oldGetterKey] of Object.entries<string>(
            map
        )) {
            resFunc[newGetterKey] = function () {
                return handleModuleType.call(
                    this,
                    namespace,
                    'getters',
                    oldGetterKey
                );
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
    const { namespace, map } = normalizeNamespace(arguments[0], arguments[1]);
    const resFunc = {};

    // 数组内容，例如： mapMutations(['x1', 'x2']) 或 mapMutations('xxxModule', ['xxx1', 'xxx2'])
    if (Array.isArray(map)) {
        map.forEach((getterKey) => {
            resFunc[getterKey] = function (payload) {
                const func = handleModuleType.call(
                    this,
                    namespace,
                    '_mutations',
                    getterKey
                );
                const state = handleModuleType.call(this, namespace, 'state');

                return func(state, payload);
            };
        });
    } else {
        for (const [newGetterKey, oldGetterKey] of Object.entries<string>(
            map
        )) {
            // mapMutations({ xxxxxxx1: 'x1' }) 或 mapMutations('xxxModule', { xxxxxxx1: 'x1' })
            resFunc[newGetterKey] = function (payload) {
                const func = handleModuleType.call(
                    this,
                    namespace,
                    '_mutations',
                    oldGetterKey
                );
                const state = handleModuleType.call(this, namespace, 'state');

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
    const { namespace, map } = normalizeNamespace(arguments[0], arguments[1]);
    const resFunc = {};

    // 数组内容，例如： mapActions(['x1', 'x2']) 或 mapActions('xxxModule', ['xxx1', 'xxx2'])
    if (Array.isArray(map)) {
        map.forEach((getterKey) => {
            resFunc[getterKey] = function (payload) {
                const func = handleModuleType.call(
                    this,
                    namespace,
                    '_actions',
                    getterKey
                );
                let store = handleModuleStore.call(this, namespace);

                store = Object.assign(
                    { ...store },
                    {
                        commit: this.$store.commit.bind(store),
                        dispatch: this.$store.dispatch.bind(store)
                    }
                );

                return func(store, payload);
            };
        });
    } else {
        for (const [newGetterKey, oldGetterKey] of Object.entries<string>(
            map
        )) {
            // mapActions({ xxxxxxx1: 'x1' }) 或 mapActions('xxxModule', { xxxxxxx1: 'x1' })
            resFunc[newGetterKey] = function (payload) {
                let store = handleModuleStore.call(
                    this,
                    namespace,
                    '_actions',
                    oldGetterKey
                );

                store = Object.assign(
                    { ...store },
                    {
                        commit: this.$store.commit.bind(store),
                        dispatch: this.$store.dispatch.bind(store)
                    }
                );

                console.log(store);

                return store['_actions'][oldGetterKey](store, payload);
            };
        }
    }

    return resFunc;
}
