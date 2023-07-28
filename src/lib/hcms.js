export const hcms = {
    getDocuments: async function (devMode, serviceUrl, path) {
        console.log("hcms.getDocuments: devMode=" + devMode + " serviceUrl=" + serviceUrl + " path=" + path.params.file)
        let docs = [
            { id: 1, name: "doc1", path: "/doc1" },
        ]
        if (devMode) {
            return { paths: this.getPaths(path.params.file), documents: docs }
        }
        let method = 'GET'
        let url = serviceUrl + "/" + path.params.file
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

    },
    getPaths: function (docpath) {
        let paths = docpath.split("/")
        paths.splice(0, 0, "")
        let result = []
        result.push({
            name: "Home",
            path: "/"
        })
        for (let i = 1; i < paths.length; i++) {
            if (paths[i].indexOf(".") > 0) {
                result.push({
                    name: paths[i],
                    path: result[i - 1].path + paths[i]
                })
            } else {
                result.push({
                    name: paths[i],
                    path: result[i - 1].path + paths[i] + "/"
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