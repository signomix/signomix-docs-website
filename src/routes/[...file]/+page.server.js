import { hcms } from '$lib/hcms.js';
import { dev } from '$app/environment';
import { PUBLIC_HCMS_URL } from '$env/static/public';
import { PUBLIC_HCMS_INDEX } from '$env/static/public';
import { PUBLIC_HCMS_ROOT } from '$env/static/public';

export async function load(params){
    try{
        console.log('params.headers', params.request)
        return await hcms.getDocuments(dev, PUBLIC_HCMS_URL, params, PUBLIC_HCMS_ROOT, PUBLIC_HCMS_INDEX)
    }catch(err){
        console.log(err)
    }
}   