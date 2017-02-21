const configuration = (state = {}, action) => {
    switch (action.type) {
        case 'GET_CONFIGURATION':
            return state;
        default:
            return state;
    }
};

export default configuration;