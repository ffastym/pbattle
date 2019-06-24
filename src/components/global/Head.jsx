/**
 * @author Yuriy Matviyuk
 */
import React from 'react'
import {Helmet} from "react-helmet"
/**
 * Head component
 *
 * @param name
 * @param ssr
 *
 * @returns {*}
 * @constructor
 */
const Head = ({name, ssr}) => {
    let title = 'Підслухано',
        description = 'Цікаві історії, захоплюючі зізнання',
        keywords = 'форум, анонімний форум, шукаю тебе, тз, шт, зізнання, типове зізнання, підслухано';

    if (name) {
        let location = ' ' + name;

        title += location;
        description += location;
        keywords += location;
    }

    return (
        !ssr
            ? <Helmet>
                <title>{title}</title>
                <meta name='description' content={description}/>
                <meta name='keywords' content={keywords}/>
            </Helmet>
            : <React.Fragment>
                <title>{title}</title>
                <meta name='description' content={description}/>
                <meta name='keywords' content={keywords}/>
            </React.Fragment>
    )
};

export default Head
