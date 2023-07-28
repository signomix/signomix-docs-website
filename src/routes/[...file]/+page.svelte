<div class="row container-fluid">
    <div class="col mb-2">
        {#await data}
        ...
        {:then data}
        {#if data.paths!=undefined && data.paths!=null && data.paths.length>0}
        {#each data.paths as pathelem, index}
        <a href={pathelem.path}>{pathelem.name==''?'home':pathelem.name}</a> {data.paths.length-1>index?' / ':''}
        {/each}
        {/if}
        {/await}
        <!--
        <nav aria-label="breadcrumb" class="d-fluid">
            <ol class="breadcrumb d-fluid">
                {#await data}
                ...
                {:then data}
                {#if data.paths!=undefined && data.paths!=null && data.paths.length>0}
                {#each data.paths as pathelem, index}
                <li class="breadcrumb-item"><a href={pathelem.path}>{pathelem.name==''?'home':pathelem.name}</a></li>
                {/each}
                {/if}
                {/await}
            </ol>
        </nav>
    -->
    </div>
</div>

<div class="row container-fluid">
    <div class="col">
        <div class="row w-100">
            <div class="col">
                {#await data}
                ...
                {:then result}
                {#if result!=undefined && result!=null && result.documents!=null && result.documents!=undefined &&
                result.documents.length>0}
                {@html result.documents[0].content}
                {:else}
                <h1>Welcome to Cricket website example</h1>
                <p>If you see this page, Cricket HCMS is probably unavailable at the configured address.</p>
                <a href="/toc.md">TOC</a>
                <a href="/test/test.md">test</a>
                {/if}
                {:catch error}
                {error.message}
                {/await}
            </div>
            <!--
            <div class="col-2 border-start border-end">
                Tags:<br>
                {#await data}
                ...
                {:then result}
                {#if result!=undefined && result!=null && result.tags!=null}
                {#each result.tags as tag, index}
                {tag}
                {/each}
                {/if}
                {:catch error}
                {error.message}
                {/await}
            </div>
        -->
        </div>
    </div>
</div>

<script>
    export let data
</script>