// eleventy.config.js
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import markdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";
import eleventyPluginToc from "eleventy-plugin-toc";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("img");
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("fonts");
  eleventyConfig.addPassthroughCopy("blog");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("*.{css,html,txt}");
  eleventyConfig.on("eleventy.after", async ({ dir }) => {
    if (process.env.ELEVENTY_RUN_MODE !== "build") return;

    const mediaDir = path.join(dir.output, "blog/posts/media");
    if (!fs.existsSync(mediaDir)) return;

    const files = fs.readdirSync(mediaDir, { recursive: true });

    for (const file of files) {
      const filePath = path.join(mediaDir, file);
      if (!fs.statSync(filePath).isFile()) continue;

      const ext = path.extname(file).toLowerCase();
      if (![".jpg", ".jpeg", ".png"].includes(ext)) continue;

      const tmpPath = filePath + ".tmp";
      try {
        let pipeline = sharp(filePath);
        const metadata = await pipeline.metadata();

        if (metadata.width > 1600) {
          pipeline = pipeline.resize({ width: 1600, withoutEnlargement: true });
        }

        if (ext === ".jpg" || ext === ".jpeg") {
          pipeline = pipeline.jpeg({ quality: 85, progressive: true });
        } else if (ext === ".png") {
          pipeline = pipeline.png({ compressionLevel: 8, palette: true });
        }

        await pipeline.toFile(tmpPath);
        fs.renameSync(tmpPath, filePath);
      } catch (err) {
        console.error(`Failed to compress ${file}:`, err);
        if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
      }
    }
  });
  
  eleventyConfig.addTransform("fix-media-paths", function (content) {
    if (this.page.outputPath && this.page.outputPath.endsWith(".html")) {
      return content.replace(/src="media\//g, 'src="/blog/posts/media/');
    }
    return content;
  });
  
  eleventyConfig.addFilter("readableDate", function(dateVal) {
    if (!dateVal) return "";
    
    const dateObj = typeof dateVal === "string" ? new Date(dateVal) : dateVal;
    
    if (dateObj instanceof Date && !isNaN(dateObj)) {
      return new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        timeZone: 'UTC'
      }).format(dateObj).replace(/,/g, '');
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
