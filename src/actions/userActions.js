/**
 * @author Yuriy Matviyuk
 */
const userActions = {
    /**
     * Set user as logged in
     *
     * @param userData
     *
     * @returns {{payload: *, type: string}}
     */
    signIn(userData) {
        localStorage.setItem('credentials', JSON.stringify({
            email: userData.email,
            password: userData.password
        }));

        delete userData.password;
        userData.isLoggedIn = true;

        return {
            type: 'SIGN_IN',
            payload: userData
        }
    },

    /**
     * Logout
     *
     * @returns {{type: string}}
     */
    logOut: () => {
        let userData = {
                nick: null,
                login: null
            };

        localStorage.removeItem('credentials');
        localStorage.removeItem('nick');

        return {
            type: "LOGOUT",
            payload: userData
        }
    }
};

export default userActions;
