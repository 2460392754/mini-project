/**
 * 闭包函数
 * @param func
 * @param args
 * @returns
 */
export function partial(func, args) {
    return function () {
        return func(args);
    };
}
