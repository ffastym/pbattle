/**
 * @author Yuriy Matviyuk
 */
const initialState = {
    message: null,
    type: 'success'
};

const notifyReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_MESSAGE':
            state = {
                ...state,
                ...action.payload
            };
            break;
        case 'SET_TYPE':
            state = {
                ...state,
                type: action.payload
            };
            break;
        default:
            state = {
                ...state
            };
    }

    return state;
};

export default notifyReducer
