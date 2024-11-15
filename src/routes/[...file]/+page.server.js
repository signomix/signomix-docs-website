import { hcms } from '$lib/hcms.js';
import { dev } from '$app/environment';
import { goto } from '$app/navigation';

export async function load(params) {
    try {
        return await hcms.getDocument(
            dev,
            process.env.PUBLIC_HCMS_URL,
            params,
            process.env.PUBLIC_HCMS_INDEX,
            process.env.PUBLIC_HCMS_ROOT,
            null,
            null,
            process.env.PUBLIC_HCMS_LANGUAGE,
            process.env.PUBLIC_HCMS_LANGUAGES
        )
    } catch (err) {
        console.log(err)
    }
}   
