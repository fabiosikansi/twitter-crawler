const alerts = (state = {}, action) => {
    switch (action.type) {
        case 'ADD_ALERT':
            state.push(action.data);
            return state;
        case 'GET_ALERTS':
            state = action.data;
            return state;
        default:
            return state;
    }
};

export default alerts;