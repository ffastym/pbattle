/**
 * @author Yuriy Matviyuk
 */
import React from 'react'
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import appActions from "../../actions/appActions";

/**
 * CookiesBanner component
 *
 * @returns {*}
 * @constructor
 */
const CookiesBanner = (props) => {
    return (
        <div className='cookies-banner'>
            <p>
                Для ведення аналітики відвідування додатку та розміщення корректної реклами ми використовуємо
                файли cookies, а також записуємо дані про сесію до локального сховища Вашого браузера.
                Натискаючи на кнопку нижче ви підтверджуєте, що погоджуєтеся з даними умовами та з
                умовами нашої <a href="/privacy_policy">Політики конфіденційності</a>
            </p>
            <button className="button ok-button" onClick={props.acceptCookies}>Погоджуюся</button>
        </div>
    )
};

const mapDispatchToProps = (dispatch) => {
    return {
        /**
         * Accept Cookies
         */
        acceptCookies: () => {
            dispatch(appActions.acceptCookies())
        }
    }
};

export default withRouter(connect(()=>{return {}}, mapDispatchToProps)(CookiesBanner))
