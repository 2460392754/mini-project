<template>
    <div class="border">
        <div>
            <h2>this.$store.state Module</h2>
            <div>user.state.name value: {{ $store.state.user.name }}</div>
            <div>user.state.age value: {{ $store.state.user.age }}</div>
            <div>mapState userAge value: {{ userAge }}</div>
            <div>mapState userAgeFunc value: {{ userAgeFunc }}</div>
            <div>{{ userAgeFunc2 }}</div>
        </div>
        <div>
            <h2>mapState Module</h2>
            <div>count value: {{ name }}</div>
            <div>countList value: {{ age }}</div>
        </div>
        <div>
            <button @click="onClickCommitAddUserModule">
                commit userModule
            </button>
            <button @click="onClickDispatchAddUserModule">
                dispatch userModule
            </button>
        </div>
    </div>
</template>

<script>
import { mapState } from '../../../../dist';

export default {
    data() {
        return {
            tips: 'mapState userAgeFunc2 value: '
        };
    },

    computed: {
        ...mapState('user', ['name', 'age']),
        ...mapState('user', {
            userAge: 'age',
            userAgeFunc: (state) => state.age,
            userAgeFunc2(state) {
                return this.tips + state.age;
            }
        })
    },

    methods: {
        onClickCommitAddUserModule() {
            this.$store.commit('user/addAge', 2);
        },

        onClickDispatchAddUserModule() {
            this.$store.dispatch('user/handleUserInfo', 2);
        }
    }
};
</script>
