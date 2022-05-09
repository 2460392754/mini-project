<template>
    <div id="app">
        <State />
        <Mutation />
        <Getter />
        <Action />
        <!-- <UserModule /> -->
    </div>
</template>

<script>
import State from './components/state.vue';
import Getter from './components/getter.vue';
import Mutation from './components/mutation.vue';
import Action from './components/action.vue';
import UserModule from './components/userModule.vue';

export default {
    name: 'App',

    components: {
        State,
        Getter,
        Mutation,
        Action,
        UserModule,
    },

    created() {
        console.log(this.$store);
    },
};
</script>

<style>
.border {
    border: 1px solid #ccc;
    padding: 20px;
    margin: 20px;
    border-radius: 10px;
}
</style>
