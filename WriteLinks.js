import fs from "fs";

let suffixes = new Set();
let links = "";

class WritePageLinks {

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
        fs.writeFileSync("pages.txt", this.filter().join("\n"));
    }

    /**
     * Filter links for binary files.
     * @returns {Array} Array of links to binary files.
     */
    filter() {
        const resultLinks = links.filter((link) => {

                console.log(link);
            if (link !== null) {
                if (!link.includes("/tag/") && !link.includes("/category/") ) {
                    return true;
                }
            }
        });
        return resultLinks;
    }
}

export default WritePageLinks;