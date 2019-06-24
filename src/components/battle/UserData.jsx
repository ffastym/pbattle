/**
 * @author Yuriy Matviyuk
 */
import React from 'react'

/**
 * UserData component
 *
 * @param photo
 * @param firstname
 * @param rating
 * @param likes
 *
 * @returns {*}
 * @constructor
 */
const UserData = ({photo, name, rating, likes}) => {
    return (
        <div className="battle-user">
            <div className="user-photo">
                <img src={photo} alt=""/>
            </div>
            <div className="user-summary">
                <div className="user-name">{name}</div>
                <div className="user-likes user-qty">{likes}</div>
                <div className="user-rating user-qty">{rating}</div>
            </div>
        </div>
    )
};

export default UserData
