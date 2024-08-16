import { hcms } from '$lib/hcms.js';
import { dev } from '$app/environment';

export async function load(params){
    try{
        return await hcms.getDocument(dev, process.env.PUBLIC_HCMS_URL, params, process.env.PUBLIC_HCMS_INDEX, process.env.PUBLIC_HCMS_ROOT)
    }catch(err){
        console.log(err)
    }
}   