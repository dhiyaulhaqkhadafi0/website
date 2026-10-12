import { MDXRemote } from 'next-mdx-remote/rsc';
// Editorial Markdown is bundled from trusted local files. Keep tables semantic
// without adding a browser-side Markdown parser or accepting user-authored MDX.
export function ResourceDocument({source}:{source:string}) {
 const blocks=source.split(/((?:^\|[^\n]*\|\r?\n){2,})/m);
 return <>{blocks.filter(Boolean).map((block,i)=>{
   const lines=block.trim().split(/\r?\n/);
   if(lines.length>1&&/^\|[\s:|-]+\|$/.test(lines[1])){
     const cells=(line:string)=>line.split('|').slice(1,-1).map(s=>s.trim());
     return <table key={i}><thead><tr>{cells(lines[0]).map((c,j)=><th key={j} scope="col">{c}</th>)}</tr></thead><tbody>{lines.slice(2).map((line,j)=><tr key={j}>{cells(line).map((c,k)=><td key={k}>{c}</td>)}</tr>)}</tbody></table>;
   }
   return <MDXRemote key={i} source={block}/>;
 })}</>;
}
