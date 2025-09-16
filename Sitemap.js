import parser from "fast-xml-parser";
import fetch from "node-fetch";
import https from "https";

// setup http agent. Too many sockets may cause problems on the server side.
const agent = new https.Agent({
  rejectUnauthorized: false,
  keepAlive: true,
  maxSockets: 5
});

let sitemapUrl = "";
//const timeout = 60000;
let sitemapSet = new Set();

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.82 Safari/537.36',
  'Accept-Language': 'de,en'
};

class Sitemap {

  /**
   * Set sitemap URL.
   * @param {string} sitemapUrl 
   */
  constructor(url) {
    sitemapUrl = url;
  }

  /**
   * Crawl sitemap recursively
   * @param {string} url 
   */
  async crawl_sitemap(url) {
    let  timeout = 6000;

    //console.log("url");

    return fetch(url, { timeout, agent, headers })
      .then(res => res.text())
      .then(xml => {
        
        const { sitemapindex, urlset } = parser.parse(xml);

        // sitemap contains URLs directly, return them
        if (urlset) {
          // Sitemap contains URLs directly, return them
          return urlset.url.loc
            ? urlset.url.loc // Only single URL in sitemap
            : urlset.url.map(link => link.loc); // Multiple URLs. in sitemap
        }
        // Sitemap contains URLs to other sitemap(s), download them resursively
        if (sitemapindex) {
          // Contains only a single sitemap
          if (sitemapindex.sitemap.loc) {
            sitemapSet.add(sitemapindex.sitemap.loc);
            return Promise.all([
              this.crawl_sitemap(sitemapindex.sitemap.loc),
            ]);
          } else {
            // Recursively fetch all sitemaps inside current sitemap and fetch links
            return Promise.all(
              sitemapindex.sitemap.map(sitemap => {

                  sitemapSet.add(sitemap.loc);

                  return this.crawl_sitemap(sitemap.loc);
                }
              )
            );
          }
        }

        // Something else, return empty array
        return [];
      })
      .catch(e => {
        //console.log(e.message)
        const start = e.message.indexOf("https");
        const end = e.message.lastIndexOf(".xml") + 4;
        const url = e.message.substring(start, end);
        console.log(`retry ${url}`);

        return this.crawl_sitemap(url);
      });
    
  }

  /**
   * Flatten links array
   * @param {Array} links 
   * @returns {Array} flattened links array
   */
  flattenLinks(links) {
    return links.flat(Infinity);
  }

  /**
   * Get unique entries
   * @param {Array} links 
   * @returns {Set} Set of unique links
   */
  getUniqueLinks(links) {
    return links = [...new Set(links)];
  }

  /**
   * Retrieve URLs from sitemap
   * @returns {Set, Set} Links found in sitemap and all found sitemaps
   */
  async getUrls() {

    console.log(`Crawling sitemap: ${sitemapUrl}`);
    try {
      // Fetch sitemap recursively
      let links = await this.crawl_sitemap(sitemapUrl);

      links = this.flattenLinks(links);
    
      links = this.getUniqueLinks(links);

      let sitemaps = this.getUniqueLinks(sitemapSet);

      return {links, sitemaps};

    } catch (err) {
      throw new Error('Unable to fetch sitemap.', err);
    }
  }

}

export default Sitemap;