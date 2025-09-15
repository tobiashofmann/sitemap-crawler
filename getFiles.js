//
// Test file
// Takes the links from data.json as created by Sitemap.js and creates the links.txt file from it.
//
import urls from "./data.json" with { type: "json" };
import WriteFileLinks from "./WriteFileLinks.js";

let writeFileLinks = new WriteFileLinks(urls);
writeFileLinks.writeLinks();