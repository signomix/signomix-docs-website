export const hcms = {
    getDocuments: async function (devMode, serviceUrl, path, indexFileName) {
        console.log("hcms.getDocuments: devMode=" + devMode)
        let docs = [
            { content:"<b>test</b> doc", path: "/doc1" },
        ]
        if (devMode) {
            return { paths: this.getPaths(path.params.file), documents: docs }
        }
        let method = 'GET'
        let url = serviceUrl + "?path="
        if(path.params.file.length==0 && indexFileName!=undefined){
            url=url+indexFileName
        }else{
            url=url+path.params.file
        }
        console.log("hcms.getDocuments: url=" + url)
        const headers = new Headers()
        headers.set('Accept', 'application/json');
        const response = await fetch(url, { method: method, mode: 'cors', headers: headers })
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText)
                }
                let documents = response.json()
                return {
                    paths: this.getPaths(path.params.file),
                    documents: documents
                }
            })
            .catch(error => {
                console.error('There was an error!', error)
                return {}
            })
        return response
    },
    getPaths: function (docpath) {
        let paths = docpath.split("/")
        console.log("hcms.getPaths: paths=" + paths)
        paths.splice(0, 0, "")
        let result = []
        result.push({
            name: "", //home folder on index 0
            path: "/"
        })
        for (let i = 1; i < paths.length; i++) {
            if(paths[i].length==0){
                continue
            }
            if (paths[i].indexOf(".") > 0) {
                result.push({
                    name: paths[i],
                    path: result[i - 1].path + paths[i]
                })
            } else {
                result.push({
                    name: paths[i],
                    path: result[i - 1].path + paths[i] // + "/"
                })
            }

        }
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