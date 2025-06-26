import { StateActionTypes, CustomAction } from './common.actions';
export interface CommonStateType {
    [key: string]: any;
}

export function commonReducer(state: CommonStateType={}, action: CustomAction) {
    let addNewState ={};
    addNewState = JSON.parse(JSON.stringify(state));
    switch (action.type) {
        case StateActionTypes.getStoreValue:
        return addNewState;

        case StateActionTypes.setStoreValue:
            addNewState[action.name] = action.payload;
        return addNewState;

        case StateActionTypes.resetStoreValue:
            addNewState[action.name] = {};
        return addNewState;

        case StateActionTypes.clearStoreValues:
        return addNewState = {};

        default:
        return addNewState;
    }
}
