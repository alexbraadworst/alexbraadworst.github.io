// eleventy.config.js
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import markdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";
import eleventyPluginToc from "eleventy-plugin-toc";

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("img");
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("fonts");
  eleventyConfig.addPassthroughCopy("blog");
  eleventyConfig.addPassthroughCopy("*.{css,html,txt}");
  eleventyConfig.addTransform("fix-media-paths", function (content) {
    if (this.page.outputPath && this.page.outputPath.endsWith(".html")) {
      return content.replace(/src="\.\.\/media\//g, 'src="/blog/media/');
    }
    return content;
  });

  eleventyConfig.addFilter("readableDate", function(dateVal) {
    if (!dateVal) return "";
    
    const dateObj = typeof dateVal === "string" ? new Date(dateVal) : dateVal;
    
    if (dateObj instanceof Date && !isNaN(dateObj)) {
      return dateObj.toDateString();
    }
    
    return "";
  });

  const mdLib = markdownIt({ html: true }).use(markdownItAnchor, {
    permalink: markdownItAnchor.permalink.headerLink()
  });
  eleventyConfig.setLibrary("md", mdLib);

  eleventyConfig.addPlugin(eleventyPluginToc, {
    tags: ['h2', 'h3'],
    wrapperClass: 'toc-nav-list'
  });

  eleventyConfig.addFilter("readingTime", function(content) {
    const wordsPerMinute = 200;
    const textLength = content.split(/\s+/g).length;
    const minutes = Math.ceil(textLength / wordsPerMinute);
    return `${minutes} min read`;
  });

  eleventyConfig.addPlugin(feedPlugin, {
    type: "rss",
    outputPath: "/feed.xml",
    collection: {
      name: "posts",
      limit: 10,
    },
    metadata: {
      language: "en",
      title: "harakiri.moe",
      subtitle: "a lazy high schooler's blog",
      base: "https://harakiri.moe/",
      author: {
        name: "juniper",
      }
    }

  });
};
