export type Payload = any;

export type Getter = (state: State) => void;
export type Mutation = (state: State, payload: Payload) => void;
export type Action = (
    { state: State, commit: Mutations },
    payload: Payload
) => void;

export interface State {
    [key: string]: any;
}

export interface Getters {
    [key: string]: Getter;
}

export interface Mutations {
    [key: string]: Mutation;
}

export interface Actions {
    [key: string]: Action;
}

export interface Module {
    name: string;
    namespaced?: boolean;
    state?: State;
    getters?: Getters;
    mutations?: Mutations;
    actions?: Actions;
}

export interface Modules {
    [key: string]: Module;
}

export interface StoreOpts {
    state?: State;
    getters?: Getters;
    mutations?: Mutations;
    actions?: Actions;
    modules?: Modules;
}
