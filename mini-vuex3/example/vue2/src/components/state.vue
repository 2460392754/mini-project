<template>
    <div class="border">
        <div>
            <h2>this.$store.state</h2>
            <div>state.count value: {{ $store.state.count }}</div>
            <div>mapState.countList value: {{ cList }}</div>
            <div>mapState.countListFunc value: {{ cListFunc }}</div>
            <div>{{ cListFunc2 }}</div>
        </div>
        <div>
            <h2>mapState</h2>
            <div>count value: {{ count }}</div>
            <div>countList value: {{ countList }}</div>
        </div>
        <div>
            <button @click="onClickCommitAddCount">commit addCount</button>
            <button @click="onClickDispatchAddCount">dispatch addCount</button>
        </div>
    </div>
</template>

<script>
import { mapState } from '../../../../dist';

export default {
    data() {
        return {
            tips: 'mapState.countListFunc2 value: ',
        };
    },

    computed: {
        ...mapState(['count', 'countList']),
        ...mapState({
            cList: 'countList',
            cListFunc: (state) => state.countList,
            cListFunc2(state) {
                return this.tips + '[ ' + state.countList.join(', ') + ' ]';
            },
        }),
    },

    methods: {
        onClickCommitAddCount() {
            this.$store.commit('addCount', 2);
        },

        onClickDispatchAddCount() {
            this.$store.dispatch('handleCount', 2);
        },
    },
};
</script>
