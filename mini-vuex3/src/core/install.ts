import { config } from '../config';

/**
 * 安装
 * @param {*} vue
 * @param {*} opts
 */
export const install = function (vue, opts) {
    config._vue = vue;

    vue.mixin({
        beforeCreate() {
            // 数据挂载到原形链上
            if (typeof this.$options.store !== 'undefined') {
                vue.prototype.$store = this.$options.store;
            }
        }
    });
};
