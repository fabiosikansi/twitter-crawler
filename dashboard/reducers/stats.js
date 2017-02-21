const stats = (state = {}, action) => {
    switch (action.type) {
        case 'UPDATE_STATS':
            state = action.data;
            return state;
        default:
            return state;
    }
};

export default stats;