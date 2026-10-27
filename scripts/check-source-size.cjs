const fs=require('node:fs');
const path=require('node:path');
const ROOT=path.resolve(__dirname,'../src');
const MAX_LINES=500;
function sourceFiles(directory){
  return fs.readdirSync(directory,{withFileTypes:true}).flatMap(entry=>{
    const file=path.join(directory,entry.name);
    return entry.isDirectory()?sourceFiles(file):/\.(?:tsx?|css)$/.test(file)?[file]:[];
  });
}
const failures=sourceFiles(ROOT).flatMap(file=>{
  const count=fs.readFileSync(file,'utf8').trimEnd().split(/\r?\n/).length;
  return count>MAX_LINES?[`${path.relative(ROOT,file)}: ${count} lines`]:[];
});
if(failures.length){console.error(failures.join('\n'));process.exitCode=1;}
else console.log('All source files meet the 500-line limit.');
