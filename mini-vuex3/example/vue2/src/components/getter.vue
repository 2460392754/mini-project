<template>
    <div class="border">
        <div>
            <h2>this.$store.getters</h2>
            <div>getCount value: {{ $store.getters.getCount }}</div>
        </div>
        <div>
            <h2>mapGetters</h2>
            <div>getCount value: {{ getCount }}</div>
            <div>getCount value: {{ myGetCount }}</div>
            <div>user.getUserInfo value: {{ getUserInfo }}</div>
            <div>user.getUserInfo value: {{ myGetUserInfo }}</div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from '../../../../dist';

export default {
    computed: {
        ...mapGetters(['getCount']),
        ...mapGetters({
            myGetCount: 'getCount',
        }),

        ...mapGetters('user', ['getUserInfo']),
        ...mapGetters('user', {
            myGetUserInfo: 'getUserInfo',
        }),
    },
};
</script>
