<div class="row container-fluid">
    <div class="col mb-2">
        {#await data}
        ...
        {:then data}
        <!-- breadcrumbs -->
        {#if data.paths!=undefined && data.paths!=null && data.paths.length>0}
        {#each data.paths as pathelem, index}
        <a href={getTargetPath(pathelem.path)}>{pathelem.name==''?'home':pathelem.name}</a> {data.paths.length-1>index?' / ':''}
        {/each}
        {/if}
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
                {#if result!=undefined && result!=null && result.documents!=null && result.documents!=undefined && result.documents.length>0}
                {@html result.documents[0].content}
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
    import { PUBLIC_HCMS_INDEX } from '$env/static/public';
    export let data
    function getTargetPath(path){
        let result = path
        if(path==null || path==undefined || path=='' || path=='/'){
            result = '/'+PUBLIC_HCMS_INDEX;
        }else if(!(path.endsWith('.md') || path.endsWith('.html'))){
            result = path+'/'+PUBLIC_HCMS_INDEX
        }
        //console.log('index file',PUBLIC_HCMS_INDEX)
        //console.log('getTargetPath',result)
        return result;
    }
</script>