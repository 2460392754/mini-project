<template>
    <div id="app">
        <State />
        <UserModule />
    </div>
</template>

<script>
import State from './components/state.vue';
import UserModule from './components/userModule.vue';

export default {
    name: 'App',

    components: {
        State,
        UserModule
    }
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
