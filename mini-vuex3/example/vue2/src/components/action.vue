<template>
    <div class="border">
        <div>
            <h2>this.$store.actions</h2>
        </div>
        <div>
            <h2>mapActions</h2>
            <button @click="() => handleCount(3)">handleCount</button>
            <button @click="() => handleUserInfo(3)">handleUserInfo</button>
            <button @click="() => myHandleUserInfo(3)">myHandleUserInfo</button>
        </div>
    </div>
</template>

<script>
import { mapActions } from '../../../../dist';

export default {
    methods: {
        ...mapActions(['handleCount']),
        ...mapActions('user', ['handleUserInfo']),
        ...mapActions('user', {
            myHandleUserInfo: 'handleUserInfo',
        }),
    },
};
</script>
