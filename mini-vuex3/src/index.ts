import { store as Store } from './core';

export * from './core/helpers';
export default {
    Store,
    install: Store.install,
};
