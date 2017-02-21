const tweets = (state = {}, action) => {
    switch (action.type) {
        case 'NEW_TWEET':
            state.push(action.data);
            return state;
        default:
            return state;
    }
};

export default tweets;