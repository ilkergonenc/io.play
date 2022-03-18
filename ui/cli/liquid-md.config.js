// CONFIGURATION
const path = require('path')
const fs   = require('fs')
const YAML = require('js-yaml')
const _root = '../../'
const config = {
  engine: {
    extname:  '.liquid',
    globals:  YAML.load(fs.readFileSync(_root+'re/data/.io.yaml', 'utf8')),
    root:     path.resolve(__dirname, _root+'ui/'),               // root files for `.render()` and `.parse()`
    layouts:  path.resolve(__dirname, _root+'ui/foundation/layout/extend'),  // layout files for `{% layout %}`
    partials: [                                                   // partial files for `{% include %}` and `{% render %}`
      path.resolve(__dirname, _root+'ui'),
      path.resolve(__dirname, _root+'ui/foundation/layout'),
      path.resolve(__dirname, _root+'kit'),
    ]
  },
  paths: {
    src:    [_root+'**/ui/**/*.md', _root+'kit/**/*.md'], 
    dest:   _root+'@' ,
  },
  beautify:       { indent_size: 2, indent_with_tabs: true },
  frontMatter:    { property: 'frontMatter', remove: true },
  // liquidTemplate: (contents, frontMatter) => `{% layout '${frontMatter.layout ? frontMatter.layout : 'base'}' %}{% block page %}${contents}{% endblock %}`,
  liquidTemplate: (contents, frontMatter) => `{% layout '${frontMatter.layout ? frontMatter.layout+'/'+frontMatter.layout : 'base/base'}' %}${contents}`,
  fileRelative:   (frontMatter) => {
      const toKebabCase = str => str && str.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g).map(x => x.toLowerCase()).join('-')
      let fileRelative = '';
      if(typeof frontMatter.nav !== "undefined") {
        fileRelative = frontMatter.nav + '\\'
      } else {
        typeof frontMatter.layout !== "undefined" ? fileRelative = fileRelative + frontMatter.layout + '\\' : ''
        if (frontMatter.group === frontMatter.title) {
          typeof frontMatter.title !== "undefined" ? fileRelative = fileRelative + toKebabCase(frontMatter.title) + '\\' : ''
        } else {
          typeof frontMatter.group !== "undefined" ? fileRelative = fileRelative + toKebabCase(frontMatter.group) + '\\' : ''
          typeof frontMatter.title !== "undefined" ? fileRelative = fileRelative + toKebabCase(frontMatter.title) + '\\' : ''
        }
      }
      fileRelative = fileRelative + 'index.html'
      return fileRelative;
  },
  rename:         file => {
    if (file.basename!='index' && !file.dirname.includes(file.basename.replace('_',''))) 
      return { dirname: file.dirname+'/'+file.basename, basename: 'index', extname: '.html' }
    else 
      return { dirname: file.dirname, basename: 'index', extname: '.html' }
  },
  fixMarkdown:    str => str.replaceAll('&quot;', '"')  // fix " doubleQuotes
                            .replaceAll("&#39;", "'")   // fix ' singleQuotes
                            .replaceAll("<p>{%", "{%")  // fix default markdown <p> around liquid tags
                            .replaceAll("%}</p>", "%}") // fix default markdown </p> around liquid tags
}
// BUILD STATIC HTML FROM LIQUID & FRONTMATTER (MARKDOWN & YAML)
exports.staticHTML    = async function staticHTML() {
  // IMPORTS
  const { src, dest } = require('gulp') 
  const frontMatter   = require('gulp-front-matter')
  const data          = require('gulp-data')
  const markdown      = require('gulp-markdown')
  const beautify      = require('gulp-html-beautify')
  const rename        = require('gulp-rename')
  // CUSTOM LIQUID JS PIPE WITH MAP-STREAM
  const map           = require('map-stream')
  const { Liquid }    = require('liquidjs')
  const Vinyl         = require('vinyl')
  const engine        = new Liquid(config.engine)                         // strart liquid engine
  const liquidjs      = map(async function (file, callback) {             // map stream
    const frontMatter = file[config.frontMatter.property]                 // catch data from stream file
    const strContents = config.fixMarkdown(file.contents.toString())      // buffer to string stream content
    const liquid      = config.liquidTemplate(strContents, frontMatter)   // wrap in to a liquid layout
    const html        = await engine.parseAndRender(liquid, frontMatter)  // render liquid to html
    const vinyl       = new Vinyl({
      cwd:            '/',
      path:           '/'+config.fileRelative(frontMatter),
      contents:       Buffer.from(html) 
    });
    callback(null, vinyl)                                                  // return as stream
  })
  // BUILD STATIC HTML TASK
  return src(config.paths.src)
    .pipe(frontMatter(config.frontMatter))
    .pipe(data(file => file[config.frontMatter.property]))
    .pipe(markdown())
    .pipe(liquidjs)
    .pipe(rename(config.rename))
    .pipe(beautify(config.beautify))
    .pipe(dest(config.paths.dest))
}

exports.staticDATA    = async function staticDATA() {
  const { src, dest } = require('gulp') 
  const map           = require('map-stream') 
  const concat        = require('gulp-concat') 
  await src([_root+'**/.io.bend.yml', _root+'**/*.bend.yml']).pipe(concat('_.bend.yaml')).pipe(dest(_root+'re/data/temp'))
  await src([_root+'**/.io.docs.yml', _root+'**/*.docs.yml']).pipe(concat('_.docs.yaml')).pipe(dest(_root+'re/data/temp'))
  // await src([_root+'**/*.data.yml']).pipe(concat('_.data.yaml')).pipe(dest(_root+'re/data/temp'))
  return src([_root+'re/data/temp/_.*.yaml'])
    .pipe(map(async function (file, callback) { 
      let key         = file.path.split('\\').pop().split('.')[1]
      let data        = {}
      data[key]       = YAML.load(file.contents)
      file.contents   = new Buffer.from(YAML.dump(data))   
      callback(null, file)
    }))
    .pipe(concat('.io.yaml'))
    .pipe(dest(_root+'re/data'))
}
