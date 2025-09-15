import fs from "fs";

let suffixes = new Set();
let links = "";

class WriteFileLinks {

    /**
     * Configures sitemap url.
     * @param {string} urls 
     */
    constructor(urls) {
        links = urls;
    }

    /**
     * Write links to file links.txt
     */
    writeLinks() {
        fs.writeFileSync("links.txt", this.filter().join("\n"));
    }

    /**
     * Filter links for binary files.
     * @returns {Array} Array of links to binary files.
     */
    filter() {
        const resultLinks = links.filter((link) => {

            if (link !== null) {
            
                let url = link.split(".");
                const suffix = url[url.length-1];

                // find links that point to binary files
                if (suffix.length >= 3 && suffix.length < 5 && suffix !== "html" && suffix !== "htm" && suffix !== "HTM" && suffix !== "YMKT" && suffix !== "ttf" && suffix !== "Test" && suffix !== "WIP" && suffix !== "CCV2" && isNaN(parseFloat(suffix))  ) {
                    suffixes.add(suffix);        
                    return true;
                }
            }
        });
        return resultLinks;
    }
}

export default WriteFileLinks;