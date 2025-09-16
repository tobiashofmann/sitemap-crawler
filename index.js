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
let result = await sitemap.getUrls();

console.log(`Found ${result.links.length} links in sitemap`);
console.log(`Found ${result.sitemaps.length} sitemaps`);

try {
    //
    // write all urls to file data.json
    //
    const filePath = path.join('./data.json');
    const jsonString = JSON.stringify(result.links);
    fs.writeFileSync(filePath, jsonString, 'utf8');

    //
    // write all sitemaps to file sitemaps.json
    //
    const sitemapsFilePath = path.join('./sitemaps.json');
    const sitemapsJsonString = JSON.stringify(result.sitemaps);
    fs.writeFileSync(sitemapsFilePath, sitemapsJsonString, 'utf8');

    //
    // write all binary links to file links.txt
    //
    let writeFileLinks = new WriteFileLinks(result.links);
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
