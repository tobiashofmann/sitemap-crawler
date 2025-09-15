import fs from "fs";
import path from "path";
import Sitemmap from "./Sitemap.js";
import WriteFileLinks from "./WriteFileLinks.js";
import process from 'node:process';

//
// read sitemap url
// either as user input on cli or use configured url
//
const configUrl = "";
const url = process.argv[2] || configUrl;

if (url === "" || url === undefined) {
    console.error("No URL provided. Please provide a sitemap URL as a command line argument.");
    process.exit(1);
}

//
// start crawling
//
console.log("Starting to crawl");

const sitemap = new Sitemmap(url);
let urls = await sitemap.getUrls();

console.log(`Found ${urls.length} links in sitemap`);

try {
    //
    // write all urls to file data.json
    //
    const filePath = path.join('./data.json');
    const jsonString = JSON.stringify(urls);
    fs.writeFileSync(filePath, jsonString, 'utf8');

    //
    // write all binary links to file links.txt
    //
    let writeFileLinks = new WriteFileLinks(urls);
    writeFileLinks.writeLinks();

    //
    // done
    //
    console.log("crawling done.");
    console.log("File: data.json contains all links retrieved from sitemap.");
    console.log("File: links.txt contains all links to binary files (PDF, DOCX, PPTX, etc.) retrieved from sitemap.");

} catch (error) {
    console.error("Error saving JSON data to file:", error.message);
}
