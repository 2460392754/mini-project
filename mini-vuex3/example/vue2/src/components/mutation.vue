<template>
    <div class="border">
        <div>
            <h2>mapMutations</h2>
        </div>
        <div>
            <button @click="() => addCount(2)">commit addCount</button>
            <button @click="() => myAddCount(2)">commit myAddCount</button>
        </div>
    </div>
</template>

<script>
import { mapMutations } from '../../../../dist';

export default {
    methods: {
        ...mapMutations(['addCount']),
        ...mapMutations({
            myAddCount: 'addCount'
        })
    }
};
</script>
