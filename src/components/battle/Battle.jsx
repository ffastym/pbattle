/**
 * @author Yuriy Matviyuk
 */
import axios from 'axios'
import React, {Component} from 'react'
import UserData from './UserData'
import Loader from '../global/Loader'
import ProgressBar from '../global/ProgressBar'
import {
    FacebookShareButton,
    TwitterShareButton,
    TelegramShareButton,
    WhatsappShareButton,
    ViberShareButton,
    FacebookIcon,
    TwitterIcon,
    TelegramIcon,
    WhatsappIcon,
    ViberIcon,
} from 'react-share';
import {Trans} from "react-i18next";

/**
 * Battle component
 */
class Battle extends Component {
    /**
     * Battle Constructor
     *
     * @param props
     */
    constructor(props) {
        super(props);
        
        this.state = {};
    }

    componentDidMount() {
        this.getRandomBattle()
    }

    /**
     * Get random battle
     */
    getRandomBattle = () => {
        const serverApiPath = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3001';

        axios.get(serverApiPath + "/api/getRandomBattle")
            .then(res => {
                this.setState({battle: res.data});
            }).catch(err => {
                console.log('Fetching random battle error ---> ', err);
            })
    };

    /**
     * Render Battle component
     */
    render() {
        const battle = this.state.battle;

        let usersData = [],
            index = 1;

        if (!battle) {
            return <Loader text="battleLoading"/>
        }

        for (let user in battle) {
            if (!battle.hasOwnProperty(user) || typeof battle[user] !== 'object') {
                continue
            }

            let userInfo = battle[user];

            usersData.push(
                <UserData name={userInfo.data.name}
                          key={index}
                          likes={userInfo.likes_qty}
                          photo={userInfo.photo}
                          rating={userInfo.data.rating}
                />
            );

            index++
        }

        const user1 = this.state.battle.user1,
              user2 = this.state.battle.user2;

        let user1Likes = user1.likes_qty,
            user2Likes = user2.likes_qty,
            allLikesQty = user1Likes + user2Likes,
            user1Progress = user1Likes !== 0 ? user1Likes / allLikesQty * 100 : 0,
            user2Progress = user2Likes !== 0 ? user2Likes / allLikesQty * 100 : 0;

        return (
            <div className="battle-wrapper">
                <div className="title">
                    <Trans>chosePhoto</Trans>
                </div>
                <div className="user-container">{usersData}</div>
                <div className="battle-summary">
                    <div className="battle-result user-1">
                        <ProgressBar percent={user1Progress.toFixed(1)}
                                     color="#4A9000"
                                     votes={user1Likes}
                        />
                    </div>
                    <div className="battle-result user-2">
                        <ProgressBar percent={user2Progress.toFixed(1)}
                                     color="dodgerblue"
                                     votes={user2Likes}
                        />
                    </div>
                </div>
                <div className="share-form">
                    <FacebookShareButton url="/" children={<FacebookIcon size={32} round={true}/>}/>
                    <TelegramShareButton url="/" children={<TelegramIcon size={32} round={true}/>}/>
                    <ViberShareButton url="/" children={<ViberIcon size={32} round={true}/>}/>
                    <WhatsappShareButton url="/" children={<WhatsappIcon size={32} round={true}/>}/>
                    <TwitterShareButton url="/" children={<TwitterIcon size={32} round={true}/>}/>
                </div>
            </div>
        )
    }
}

export default Battle
