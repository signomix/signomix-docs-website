import { hcms } from '$lib/hcms.js';
import { dev } from '$app/environment';
import { goto } from '$app/navigation';
import { token } from '$lib/usersession.js';
import { get } from 'svelte/store';

export async function load(params) {
    console.log('params.url.search', params.url.search)
    let userToken
    token.subscribe((value) => userToken = value)
    // Get token from URL
    if (params.url.search != undefined && params.url.search != null) {
        let paramsArray = null;
        if (params.url.search.startsWith('?')) {
            paramsArray = params.url.search.substring(1).split('&');
        } else {
            paramsArray = params.url.search.split('&');
        }
        for (let i = 0; i < paramsArray.length; i++) {
            let param = paramsArray[i].split('=');
            if (param[0] == 'token') {
                token.set(param[1]);
            }
        }
    }
    console.log('token', userToken)
    if (process.env.PUBLIC_ORGANIZATIONS != undefined && process.env.PUBLIC_ORGANIZATIONS != null && userToken == null) {
        try {
            goto('/login')
        } catch (err) {
            console.log(err)
        }
    }
    try {
        /* var organizationCode = null;
        if(process.env.PUBLIC_ORGANIZATIONS!=undefined && process.env.PUBLIC_ORGANIZATIONS!=null){ 
            organizationCode = 73
        }
        console.log('organizationCode', organizationCode) */
        return await hcms.getDocument(
            dev,
            process.env.PUBLIC_HCMS_URL,
            params,
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
