<div class="row container-fluid">
    <div class="col mb-2">
        {#await data}
        ...
        {:then data}
        <!-- breadcrumbs  -->
        {#each getPaths(data) as pathelem, index}
        <a href={getTargetPath(pathelem.path)}>{pathelem.name==''?'home':pathelem.name}</a>
        {#if index < getPaths(data).length - 1} &gt;&nbsp; {/if} {/each} {:catch error} {error.message} {/await} </div>
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
        import { hcms } from '$lib/hcms.js';
        import { page } from '$app/stores';
        import { goto } from '$app/navigation';
        import { onMount } from 'svelte';   

        export let data

        let indexFile = env.PUBLIC_HCMS_INDEX;
        let siteRoot = env.PUBLIC_HCMS_ROOT;
        let languages = env.PUBLIC_HCMS_LANGUAGES;
        let defaultLanguage = env.PUBLIC_HCMS_LANGUAGE;

        onMount(async () => {
            checkUrl()
        });


        function checkUrl() {
            let url = window.location.pathname
            console.log('url', url)
            if(url=='/'){
                goto('/'+defaultLanguage+'/'+indexFile)
            }
            let urlOk = false
            let langArray = languages.split(',')
            langArray.forEach(element => {
                if (url.startsWith('/' + element)) {
                    urlOk = true
                }
            });
            if (!urlOk) {
                goto('/' + defaultLanguage + '/'+indexFile)
            }
        }


        /**
         * Get the list of paths from element uri
         * @returns {Array} paths
         */
        function getPaths(data/* , siteRoot, indexFile */) {
            let result = []
            try {
                //console.log('data', data)
                let steps = data.name.split('/')
                // remowe first one or two steps elements that are numbers, starting from element 1
                // this is to remove organization and optionally organization/tenant from the path
                // start
                let index = 1
                while (index < steps.length) {
                    if (!isNaN(steps[index])) {
                        steps.splice(index, 1)
                    } else {
                        index++
                    }
                }
                // end

                //console.log('steps', steps)
                let path = ''
                for (let i = 0; i < steps.length; i++) {
                    if (steps[i] == '') {
                        continue
                    }
                    if (steps[i] == siteRoot) {
                        path = path
                        result.push(
                            { name: 'home', path: path + '/' + defaultLanguage }
                        )
                    } else {
                        path = path + '/' + steps[i]
                        result.push(
                            { name: steps[i], path: path }
                        )
                    }
                }
                if (result[result.length - 1].name == indexFile) {
                    result.pop()
                }
            } catch (e) {
                result.push({ name: 'home', path: '/' + defaultLanguage + '/' + indexFile })
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
            if (result.startsWith('//')) {
                result = result.substring(1)
            }
            return result;
        }
        function printData(name, data) {
            console.log(name, data)
            return ''
        }
    </script>