import Vue from 'vue';
import Vuex from '../../../dist';

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        count: 0,
        countList: [0],
    },

    getters: {
        getCount(state) {
            return `count: ${state.count}`;
        },
    },

    mutations: {
        addCount(state, n) {
            console.log('mutations addCount', arguments);
            state.count += n;
        },
        addCountList(state, n) {
            state.countList.push(state.count);
        },
    },

    actions: {
        handleCount(store, payload) {
            store.commit('addCount', payload);
            store.commit('addCountList');
        },
    },

    modules: {
        user: {
            name: 'user',
            namespaced: true,
            state: {
                name: 'fty',
                age: 22,
            },

            getters: {
                getUserInfo(state) {
                    return `name: ${state.name}, age: ${state.age}`;
                },
            },

            mutations: {
                addAge(state, n) {
                    console.log('addAge', JSON.stringify(state.age));
                    state.age += n;
                },
            },

            actions: {
                handleUserInfo(store, n) {
                    store.commit('addAge', n);
                },
            },
        },
    },
});
