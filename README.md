# sitemap-crawler

Crawl links from a sitemap.xml file and extract the link to binary files.

## Run

Clone the repo, install the dependencies and provide a sitemap URL.

```sh
npm i
npm start [[sitemap url]]
```

The URL to a sitemap can be provided as variable in file index.js:

```javascript
const configUrl = "<path to sitemap.xml>";
```

## Result

The provided sitemap will be crawled recursively for links. The file data.json is a JSON array with all links found. The file links.txt contains all links to binary files like PDF, PPTX, DOCX, etc.

The file links.txt can be used as input for wget to download the files.

## Example: download files using wget for Windows

Make sure you have wget for Windows installed. You can get it here: https://eternallybored.org/misc/wget/

Download e.g. the exe version and save it in the directory of this project. Provide as input the links.txt file to download all files.

```sh
 .\wget.exe --content-disposition -i .\links.txt
```

**Note**

Make sure to only download the files you need! Depending on the sitemap.xml, there might be none or thousands of files!

## Example

As an example, take the sitemap.xml from SAP Help. The location of the sitemap is given by the file [robots.txt](https://help.sap.com/robots.txt). At the end of the file: 

Sitemap: https://help.sap.com/http.svc/sitemapxml/sitemaps/sitemap_index.xml

The URL can be used as input for the script

npm run https://help.sap.com/http.svc/sitemapxml/sitemaps/sitemap_index.xml

### Output

```sh
npm start

> sitemap-crawler@1.0.0 start
> node index.js

Starting to crawl
Crawling sitemap: https://help.sap.com/http.svc/sitemapxml/sitemaps/sitemap_index.xml
Found another sitemap
Found 60131 links in sitemap
crawling done.
File: data.json contains all links retrieved from sitemap.
File: links.txt contains all links to binary files (PDF, DOCX, PPTX, etc.) retrieved from sitemap.
```

The file data.json will contain an array with over 60.000 entries. The file links.txt will list over 22.500 entries. To download those rung

```sh
 .\wget.exe --content-disposition -i .\links.txt
```

**again:** you might not want to download all the files. Make sure to clean the list to what you really need!