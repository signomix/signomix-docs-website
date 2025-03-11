import { hcms } from '$lib/hcms.js';
import { dev } from '$app/environment';
import { token } from '$lib/usersession.js';

export async function load({ url, cookies }) {

    let userToken
    //token.subscribe((value) => userToken = value)

    // Get token from URL
    /* if (params.url.search != undefined && params.url.search != null) {
        let paramsArray = null;
        if (params.url.search.startsWith('?')) {
            paramsArray = params.url.search.substring(1).split('&');
        } else {
            paramsArray = params.url.search.split('&');
        }
        for (let i = 0; i < paramsArray.length; i++) {
            let param = paramsArray[i].split('=');
            if (param[0] == 'sid') {
                //token.set(param[1]);
                cookies.set('sid', param[1], { path: '/' });
            }
        }
    } */
    
    console.log('url', url)
    if(url.pathname!=undefined && url.pathname.startsWith('/_app')) {
        return {}
    }
    if (url.search != undefined && url.search != null) {
        let paramsArray = null;
        if (url.search.startsWith('?')) {
            paramsArray = url.search.substring(1).split('&');
        } else {
            paramsArray = url.search.split('&');
        }
        for (let i = 0; i < paramsArray.length; i++) {
            let param = paramsArray[i].split('=');
            if (param[0] == 'sid') {
                //token.set(param[1]);
                cookies.set('sid', param[1], { path: '/' });
            }
        }
    }
    userToken = cookies.get('sid')
    console.log('token', userToken)
    if (process.env.PUBLIC_ORGANIZATIONS != undefined
        && process.env.PUBLIC_ORGANIZATIONS != null
        && (userToken == undefined || userToken == null || userToken == '')) {
        return {
            path: '',
            name: '',
            fileName: '',
            content: 'You must be logged in to view documentation.',
            binaryFile: false
            }
    } else {
        try {
            return await hcms.getDocument(
                dev,
                process.env.PUBLIC_HCMS_URL,
                url.pathname,
                process.env.PUBLIC_HCMS_INDEX,
                process.env.PUBLIC_HCMS_ROOT,
                userToken,
                null,
                process.env.PUBLIC_HCMS_LANGUAGE,
                process.env.PUBLIC_HCMS_LANGUAGES
            )
        } catch (err) {
            console.log(err)
        }
    }
}   
