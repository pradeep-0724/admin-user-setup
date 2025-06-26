import { Action } from '@ngrx/store';

export interface CustomAction extends Action {
    type: string;
    payload?: any;
    name?: string;
}

export enum StateActionTypes {
    setStoreValue = 'Set Store Value',
    getStoreValue = 'Get Store Value',
    resetStoreValue = 'Reset Store Value',
    clearStoreValues = 'Clear Store Values'
}

export class SetStoreValue implements CustomAction {
    payload: any;
    name: string;
    readonly type = StateActionTypes.setStoreValue;

    constructor(name: string, payload: any) {
        this.payload = payload;
        this.name = name;
    }
}

export class GetStoreValue implements CustomAction {
    name: string;
    readonly type = StateActionTypes.getStoreValue;

    constructor(name: string) {
        this.name = name;
    }
}

export class ResetStoreValue implements CustomAction {
    name: string;
    readonly type = StateActionTypes.resetStoreValue;

    constructor(name: string) {
        this.name = name;
    }
}

export class ClearStoreValues implements CustomAction {
    readonly type = StateActionTypes.clearStoreValues;
}
