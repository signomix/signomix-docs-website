import { hcms } from '$lib/hcms.js';
import { dev } from '$app/environment';
import { goto } from '$app/navigation';

export async function load(params) {
    console.log('params.url.search', params.url.search)
    var token = null;
    // Get token from URL
    if(params.url.search!=undefined && params.url.search!=null){
        let paramsArray = null;
        if(params.url.search.startsWith('?')){
            paramsArray = params.url.search.substring(1).split('&');
        }else{
            paramsArray = params.url.search.split('&');
        }
        for (let i = 0; i < paramsArray.length; i++) {
            let param = paramsArray[i].split('=');
            if(param[0]=='token'){
                token = param[1];
            }
        }
    }
    console.log('token', token)
    if(process.env.PUBLIC_ORGANIZATIONS!=undefined && process.env.PUBLIC_ORGANIZATIONS!=null && token==null){ 
        goto('/login')
    }
    try {
        var organizationCode = null;
        if(process.env.PUBLIC_ORGANIZATIONS!=undefined && process.env.PUBLIC_ORGANIZATIONS!=null){ 
            organizationCode = 73
        }
        console.log('organizationCode', organizationCode)
        return await hcms.getDocument(
            dev,
            process.env.PUBLIC_HCMS_URL,
            params,
            process.env.PUBLIC_HCMS_INDEX,
            process.env.PUBLIC_HCMS_ROOT,
            null,
            null,
            process.env.PUBLIC_HCMS_LANGUAGE,
            process.env.PUBLIC_HCMS_LANGUAGES,
            organizationCode
        )
    } catch (err) {
        console.log(err)
    }
}   
