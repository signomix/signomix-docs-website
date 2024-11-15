/**
 * Cricket HCMS API client library
 */
export const hcms = {
    /**
     * Get documents from Cricket HCMS
     * @param {boolean} devMode - true if development mode
     * @param {string} serviceUrl - HCMS service URL
     * @param {object} pathObject - path object. See: https://kit.svelte.dev/docs/routing#page-page-js
     * @param {string} rootFolder - root folder (for future use - actualy should be empty string)
     * @param {string} indexFileName - index file name
     * @returns {object} - documents
     */
    getDocuments: async function (devMode, serviceUrl, pathObject, rootFolder, indexFileName) {
        //console.log("hcms.getDocuments: devMode=" + devMode +" serviceUrl=" + serviceUrl)
        if (devMode) {
            let docs = [
                { content: "<b>test</b> doc", path: "/doc1" },
            ]
            return { paths: this.getPaths(pathObject.params.file), documents: docs }
        }
        let method = 'GET'
        let url = serviceUrl + "/api/docs?content=true&path="
        //console.log("hcms.getDocuments: path", pathObject)
        if (typeof pathObject === 'string' || pathObject instanceof String) {
            url = url + rootFolder + '/' + pathObject
        } else {
            if (pathObject.params.file.length == 0 && indexFileName != undefined) {
                url = url + rootFolder + '/' + indexFileName
            } else {
                url = url + rootFolder + '/' + pathObject.params.file
            }
        }
        const headers = new Headers()
        headers.set('Accept', 'application/json');
        const response = await fetch(url, { method: method, mode: 'cors', headers: headers })
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText + " " + response.status)
                }
                let documents = response.json()
                return {
                    paths: this.getPaths(pathObject),
                    documents: documents
                }
            })
            .catch(error => {
                console.error('There was an error!', error)
                return {
                    paths: this.getPaths(pathObject),
                    documents: []
                }
            })
        return response
    },
    findDocuments: async function (devMode, serviceUrl, pathObject, rootFolder, tagName, tagValue, sortBy, sortOrder, content) {
        //console.log("hcms.getDocuments: devMode=" + devMode +" serviceUrl=" + serviceUrl)
        if (devMode) {
            let docs = [
                { content: "<b>test</b> doc", path: "/doc1" },
            ]
            return { paths: this.getPaths(pathObject.params.file), documents: docs }
        }
        let method = 'GET'
        let url = serviceUrl + "/api/find?tag=" + tagName + ":" + tagValue + "&sort=" + sortBy + "&direction=" + sortOrder + "&content=" + content + "&path="
        let pathFolder = ""
        if (typeof pathObject === 'string' || pathObject instanceof String) {
            pathFolder = pathObject
        } else {
            if (pathObject.url.pathname.lastIndexOf('.') > 0 && pathObject.url.pathname.lastIndexOf('.') > pathObject.url.pathname.lastIndexOf('/')) {
                pathFolder = pathObject.url.pathname.substring(0, pathObject.url.pathname.lastIndexOf('/'))
            } else {
                pathFolder = pathObject.url.pathname
            }
        }
        if (!pathFolder.endsWith('/')) {
            pathFolder += '/'
        }
        url = url + '/' + rootFolder + pathFolder
        const headers = new Headers()
        headers.set('Accept', 'application/json');
        const response = await fetch(url, { method: method, mode: 'cors', headers: headers })
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText + " " + response.status)
                }
                let documents = response.json()
                return {
                    paths: this.getPaths(pathObject),
                    documents: documents
                }
            })
            .catch(error => {
                console.error('There was an error!', error)
                return {
                    paths: this.getPaths(pathObject),
                    documents: []
                }
            })
        return response
    },
    /**
     * Get paths
     * @param {string} docpath - document path
     * @returns {object} - paths
    */
    getPaths: function (docpath, rootFolder, indexFileName) {
        let paths;
        //pathObject.params.file
        if (typeof docpath === 'string' || docpath instanceof String) {
            paths = docpath.split("/")
        } else {
            paths = docpath.params.file.split("/")
        }
        //console.log("hcms.getPaths: paths=" + paths)
        // insert "home" path if not present
        if (paths.length > 0 && paths[0].length > 0) {
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
            let tmp = result[i - 1].path + '/' + paths[i]
            if (tmp.startsWith("//")) {
                tmp = tmp.substring(1)
            }
            result[i].path = tmp
        }
        //console.log(result)
        return result
    },
    getElementPath: function (index, paths) {
        let path = ""
        for (let i = 0; i < index; i++) {
            path += paths[i]
        }
        return path
    },
    /**
     * Get document
     * @param {boolean} devMode - true if development mode
     * @param {string} serviceUrl - HCMS service URL
     * @param {string} path - document path
     * @param {string} indexFile - index file name
     * @param {string} token - optional authentication token (for future use)
     * @param {string} type - document type (use "navigation" to get example navigation.json in development mode
     * @returns {object} - document
     * @throws {Error} - error
     * */
    getDocument: function (devMode, serviceUrl, path, indexFile, rootFolder, token, type, language, languages) {
        try {
            return Promise.resolve(getHcmsDocument(devMode, serviceUrl, path, indexFile, rootFolder, token, type, language, languages)).then((result) => result);
        } catch (e) {
            throw new Error(e);
        }
    },
    /**
     * Find first document
     * @param {boolean} devMode - true if development mode
     * @param {string} serviceUrl - HCMS service URL
     * @param {string} path - document path
     * @param {string} indexFile - index file name
     * @param {string} token - optional authentication token (for future use)
     * @param {string} tagName - tag name
     * @param {string} tagValue - tag value
     * @param {string} sortBy - sort by
     * @param {string} sortOrder - sort order
     * @returns {object} - document
     * @throws {Error} - error
     * */
    findFirstDocument: function (devMode, serviceUrl, path, indexFile, rootFolder, token, tagName, tagValue, sortBy, sortOrder) {
        try {
            return Promise.resolve(findHcmsDocument(devMode, serviceUrl, path, indexFile, rootFolder, token, tagName, tagValue, sortBy, sortOrder)).then((result) => result);
        } catch (e) {
            throw new Error(e);
        }
    }

}

const getHcmsDocument = async function (devMode, serviceUrl, path, indexFile, rootFolder, token, type, language, languages) {
    //console.log("hcms.getDocument: devMode=" + devMode +" serviceUrl=" + serviceUrl)
    if (devMode) {
        if (type != undefined && type == "navigation") {
            return {
                "title": "EXPERIOT",
                "logo": "logo.svg",
                "elements": [
                    { url: { pl: "pl", en: "en" }, label: { en: "Home", pl: "Start" }, target: "" }
                ]
            }
        } else {
            return {
                document:
                {
                    content: "<b>test</b> doc<br>" + path
                }
            }
        }
    }
    try {
        const headers = new Headers()
        //headers.set('Accept', 'application/json');
        if (token != undefined && token != null) {
            headers.set('Authentication', token);
        }
        let siteRoot = rootFolder == undefined ? "" : rootFolder
        let endpoint;
        let docPath
        if (typeof path === 'string' || path instanceof String) {
            docPath = path
        } else {
            docPath = path.url.pathname
        }
        if (language != undefined && language != null && languages != undefined && languages != null) {
            let langArr = languages.split(",")
            let langIsOK = false
            // if path starts with one of the languages it's OK
            for (let i = 0; i < langArr.length; i++) {
                if (docPath.startsWith("/" + langArr[i] + "/")) {
                    langIsOK = true
                    break
                }
            }
            // otherwise add language to the path
            if (!langIsOK) {
                docPath = "/" + language + docPath
            }

        }else{
            console.log("language or languages not defined")
        }
        endpoint = serviceUrl + "/api/document?name=/" + siteRoot + docPath
        if (!(endpoint.endsWith(".md") || endpoint.endsWith(".html") || endpoint.endsWith(".json"))) {
            endpoint = endpoint + indexFile
        }
        const res = await fetch(endpoint, {
            mode: 'cors',
            method: 'GET',
            headers: headers
        });
        let data;
        //console.log("res:", res.type)
        //console.log("res:", res.status)
        if (res.status == 200) {
            //if(type.toLowerCase() !== "file") {
            return await res.json();
            //}else{
            //    data = { content: "binary content" }
            //    return data
            //}
        } else {
            data = { content: "No content" }
            return data
        }
    } catch (e) {
        throw new Error(e);
    }
}

const findHcmsDocument = async function (devMode, serviceUrl, path, indexFile, rootFolder, token, tagName, tagValue, sortBy, sortOrder) {
    if (devMode) {
        return {
            document:
            {
                content: "<b>test</b> doc<br>" + path
            }
        }
    }
    try {
        const headers = new Headers()
        //headers.set('Accept', 'application/json');
        if (token != undefined && token != null) {
            headers.set('Authentication', token);
        }
        let siteRoot = rootFolder == undefined ? "" : rootFolder
        let endpoint;
        if (typeof path === 'string' || path instanceof String) {
            //console.log("path is a string")
            let path2 = path
            if (path.endsWith('index.md' || path.endsWith('index.html'))) {
                path2 = path.substring(0, path.lastIndexOf('/') + 1)
            }
            endpoint = serviceUrl + "/api/findfirst?content=true&sort=" + sortBy + "&direction=" + sortOrder + "&tag=" + tagName + ":" + tagValue + "&path=/" + siteRoot + path2
        } else {
            //console.log("path is an object")
            let path2 = path.url.pathname
            if (path2.endsWith('index.md' || path2.endsWith('index.html'))) {
                path2 = path2.substring(0, path2.lastIndexOf('/') + 1)
            }
            endpoint = serviceUrl + "/api/findfirst?content=true&sort=" + sortBy + "&direction=" + sortOrder + "&tag=" + tagName + ":" + tagValue + "&path=/" + siteRoot + path2 //+ "/"+path.params.file
        }
        /* if (!(endpoint.endsWith(".md") || endpoint.endsWith(".html") || endpoint.endsWith(".json"))) {
            endpoint = endpoint + "/" + indexFile
        } */
        const res = await fetch(endpoint, {
            mode: 'cors',
            method: 'GET',
            headers: headers
        });
        let data;
        //console.log("res:", res.type)
        //console.log("res:", res.status)
        if (res.status == 200) {
            //if(type.toLowerCase() !== "file") {
            return await res.json();
            //}else{
            //    data = { content: "binary content" }
            //    return data
            //}
        } else {
            data = { content: "No content" }
            return data
        }
    } catch (e) {
        throw new Error(e);
    }
}