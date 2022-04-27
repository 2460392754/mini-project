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
function handleModuleType(namespace: string | null, type: string) {
    return namespace === null ? this.$store[type] : this.$store[type][namespace];
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
                const state = handleModuleType.call(this, namespace, 'state');

                return state[stateKey];
            };
        });
    }

    // 处理对象结构
    else {
        for (const [key, val] of Object.entries<string | Function>(map)) {
            // mapState({ xxFunc: (state) => state.xx1 }) 或  mapState({ xxFunc(state){ return state.xx1 + this.xxx1 } })
            if (typeof val === 'function') {
                resFunc[key] = function () {
                    const state = handleModuleType.call(this, namespace, 'state');

                    // 修改this指向，处理 回调函数中使用当前vm实例中的 data 或 computed 变量
                    return val.call(this, state);
                };
            }

            // mapState({ xxxxxxx1: 'x1' })
            else {
                resFunc[key] = function () {
                    const state = handleModuleType.call(this, namespace, 'state');

                    return state[val];
                };
            }
        }
    }

    return resFunc;
}
