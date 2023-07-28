<div class="row container-fluid">
    <div class="col">
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb p-0 bg-body-tertiary rounded-3">
                {#await data}
                ...
                {:then result}
                {#if result!=null && result!=undefined && result.paths!=null}
                {#each result.paths as pathelem, index}
                <li class="breadcrumb-item"><a href={pathelem.path}>{pathelem.name}</a></li>
                {/each}
                {/if}
                {/await}
            </ol>
        </nav>
    </div>
</div>
<div class="row container-fluid">
    <div class="col">
        <div class="row w-100">
            <div class="col-10">
                {#await data}
                ...
                {:then result}
                {#if result!=undefined && result!=null && result.documents!=null && result.documents!=undefined && result.documents.length>0}
                {result.documents[0].id }
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
        </div>
    </div>
</div>

<script>
    export let data
</script>