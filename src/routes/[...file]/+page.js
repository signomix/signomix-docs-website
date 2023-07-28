import { hcms } from '$lib/hcms.js';
import { dev } from '$app/environment';
import { PUBLIC_HCMS_URL } from '$env/static/public';

export async function load(params){

    try{
        return await hcms.getDocuments(dev, PUBLIC_HCMS_URL, params)
    }catch(err){
        console.log(err)
    }
}  