/* eslint-disable @typescript-eslint/no-require-imports */
// Compile trusted repository MDX during the build, before deployment to Workers.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const matter = require('gray-matter');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
async function main() {
  const { compileMDX } = await import('next-mdx-remote/rsc');
  const directory = path.resolve(__dirname, '../src/content/blog');
  const output = path.resolve(__dirname, '../src/content/generated-blog-posts.json');
  const posts = {};
  const heading = tag => ({children,...props}) => React.createElement(tag,{...props,className:'scroll-mt-36'},children);
  for (const file of fs.readdirSync(directory).filter(f=>f.endsWith('.mdx')).sort()) {
    const slug = file.slice(0,-4);
    const {data,content} = matter(fs.readFileSync(path.join(directory,file),'utf8'));
    const compiled = await compileMDX({source:content,components:{h2:heading('h2'),h3:heading('h3')}});
    posts[slug] = {data,content,contentHtml:renderToStaticMarkup(compiled.content)};
  }
  const serialized = JSON.stringify(posts,null,2)+'\n';
  if(process.argv.includes('--check')) assert.equal(fs.readFileSync(output,'utf8'),serialized,'Bundled MDX is stale. Run node scripts/generate-blog-content.cjs');
  else fs.writeFileSync(output,serialized);
  console.log(`Prepared ${Object.keys(posts).length} complete MDX articles for filesystem-free Worker rendering.`);
}
main().catch(error=>{console.error(error);process.exitCode=1;});
