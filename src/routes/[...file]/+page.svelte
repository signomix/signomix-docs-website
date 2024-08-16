<div class="row container-fluid">
    <div class="col mb-2">
        {#await data}
        ...
        {:then data}
        <!-- breadcrumbs  -->
        {#each getPaths(data, siteRoot, indexFile) as pathelem, index}
        <a href={getTargetPath(pathelem.path)}>{pathelem.name==''?'home':pathelem.name}</a>
        {#if index < getPaths(data, siteRoot, indexFile).length - 1}
        &gt;&nbsp;
        {/if}
        {/each}
        {:catch error}
        {error.message}
        {/await}
    </div>
</div>
<div class="row container-fluid">
    <div class="col">
        <div class="row w-100">
            <div class="col">
                {#await data}
                ...
                {:then result}
                {#if result!=undefined && result!=null}
                {@html result.content}
                {:else}
                <h1>404</h1>
                <p>Page not found.</p>
                {/if}
                {:catch error}
                {error.message}
                {/await}
            </div>
        </div>
    </div>
</div>
<script>
    import { env } from '$env/dynamic/public';
    import {hcms} from '$lib/hcms.js';
    export let data
    
    let indexFile = env.PUBLIC_HCMS_INDEX;
    let siteRoot = env.PUBLIC_HCMS_ROOT;


    /**
     * Get the list of paths from element uri
     * @returns {Array} paths
     */
    function getPaths(data, siteRoot, indexFile) {
        let result = []
        try {
            //console.log('data', data)
            let steps = data.name.split('/')
            //console.log('steps', steps)
            let path = ''
            for (let i = 0; i < steps.length; i++) {
                if (steps[i] == '') {
                    continue
                }
                if (steps[i] == siteRoot) {
                    path = path + '/'
                    result.push(
                        { name: 'home', path: path }
                    )
                } else {
                        path=path+'/'+steps[i]
                    result.push(
                        { name: steps[i], path: path }
                    )
                }
            }
            if(result[result.length-1].name==indexFile){
                result.pop()
            }
        } catch (e) {
            result.push({ name: 'home', path: '/'+indexFile })
        }
        //console.log('paths', result)
        return result
    }
    function getTargetPath(path) {
        let result = path
        if (path == null || path == undefined || path == '' || path == '/') {
            result = '/' + indexFile;
        } else if (!(path.endsWith('.md') || path.endsWith('.html'))) {
            result = path + '/' + indexFile
        }
        if(result.startsWith('//')){
            result=result.substring(1)
        }
        return result;
    }
    function printData(name, data) {
        console.log(name, data)
        return ''
    }
</script>