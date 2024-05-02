import { error } from '@sveltejs/kit';

export const hcms = {
    getDocuments: async function (devMode, serviceUrl, path, rootFolder, indexFileName) {
        console.log("hcms.getDocuments: devMode=" + devMode)
        if (devMode) {
            let docs = [
                { content:"<b>test</b> doc", path: "/doc1" },
            ]
            return { paths: this.getPaths(path.params.file), documents: docs }
        }
        let method = 'GET'
        let url = serviceUrl + "?path="
        if(path.params.file.length==0 && indexFileName!=undefined){
            url=url+rootFolder+'/'+indexFileName
        }else{
            url=url+rootFolder+'/'+path.params.file
        }
        console.log("hcms.getDocuments: url=" + url)
        const headers = new Headers()
        headers.set('Accept', 'application/json');
        const response = await fetch(url, { method: method, mode: 'cors', headers: headers })
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText+" "+response.status)
                    /* error(400, {
                        message: 'Not found or not handled file type'
                    }); */
                }
                let documents = response.json()
                return {
                    paths: this.getPaths(path.params.file),
                    documents: documents
                }
            })
            .catch(error => {
                console.error('There was an error!', error)
                return {
                    paths: this.getPaths(path.params.file),
                    documents: []
                }
            })
        return response
    },
    getPaths: function (docpath) {
        let paths = docpath.split("/")
        console.log("hcms.getPaths: paths=" + paths)
        // insert "home" path if not present
        if(paths.length>0 && paths[0].length>0){
            paths.splice(0, 0, "")
        }
        let result = []
        for (let i = 0; i < paths.length; i++) {
            result.push({
                name: paths[i],
                path: "/"
            })
        }
        for (let i = 1; i < paths.length; i++) {
            let tmp=result[i - 1].path + '/'+paths[i]
            if(tmp.startsWith("//")){
                tmp=tmp.substring(1)
            }
            result[i].path = tmp
        }
        console.log(result)
        return result
    },
    getElementPath: function (index, paths) {
        let path = ""
        for (let i = 0; i < index; i++) {
            path += paths[i]
        }
        return path
    }

}