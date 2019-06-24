/**
 * @author Yuriy Matviyuk
 */
const notifyActions = {
    /**
     * Set message of Material UI snackbar
     *
     * @param message
     * @param type string
     * @returns {{payload: *, type: string}}
     */
    setMessage: (message, type = 'success') => {
        console.log('test ---> ', type);
        return {
            type: 'SET_MESSAGE',
            payload: {message, type}
        }
    }
};

export default notifyActions;
