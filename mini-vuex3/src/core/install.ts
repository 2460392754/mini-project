import { config } from '../config';
import type { VueConstructor } from 'vue';

/**
 * 安装
 */
export const install = function (vue: VueConstructor) {
    config._vue = vue;

    vue.mixin({
        beforeCreate() {
            const opts = this.$options as any;

            // 数据挂载到原形链上
            if (typeof opts.store !== 'undefined') {
                vue.prototype.$store = opts.store;
            }
        }
    });
};
