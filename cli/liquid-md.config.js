// CONFIGURATION
const path = require('path')
const fs   = require('fs')
const yaml = require('js-yaml')
const _root = '../'
const config = {
  engine: {
    extname:  '.liquid',
    globals:  yaml.load(fs.readFileSync(_root+'.io.play.yaml', 'utf8')),
    root:     path.resolve(__dirname, _root+'ui/'),        // root files for `.render()` and `.parse()`
    layouts:  path.resolve(__dirname, _root+'ui/layouts'), // layout files for `{% layout %}`
    partials: [                                            // partial files for `{% include %}` and `{% render %}`
      path.resolve(__dirname, _root+'ui/components'),
      path.resolve(__dirname, _root+'ui/layouts/components'),
      path.resolve(__dirname, _root+'ui/sections'),
    ]
  },
  paths: {
    src:    _root+'kit/*.md', 
    dest:   _root+'@' ,
  },
  frontMatter:    { property: 'frontMatter', remove: true },
  // liquidTemplate: (contents, frontMatter) => `{% layout '${frontMatter.layout ? frontMatter.layout : 'base'}' %}{% block page %}${contents}{% endblock %}`,
  liquidTemplate: (contents, frontMatter) => `{% layout '${frontMatter.layout ? frontMatter.layout : 'base'}' %}${contents}`,
  beautify:       { indent_size: 2, indent_with_tabs: true },
  rename:         file => {if (file.basename!='index') return { dirname: file.dirname+'/'+file.basename, basename: 'index', extname: '.html' }}
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
  const engine        = new Liquid(config.engine)                         // strart liquid engine
  const liquidjs      = map(async function (file, callback) {             // map stream
    const frontMatter = file[config.frontMatter.property]                 // catch data from stream file
    let strContents   = file.contents.toString()                          // buffer to string stream content
    strContents       = strContents.replaceAll('&quot;', '"')             // fix|replace " doubleQuotes
    strContents       = strContents.replaceAll("&#39;", "'")              // fix|replace ' singleQuotes
    const liquid      = config.liquidTemplate(strContents, frontMatter)   // wrap in to a liquid layout
    const html        = await engine.parseAndRender(liquid, frontMatter)  // render liquid to html
    file.contents     = new Buffer.from(html)                             // string back to buffer
    callback(null, file)                                                  // return as stream
  })
  // BUILD STATIC HTML TASK
  return src(config.paths.src)
    .pipe(frontMatter(config.frontMatter))
    .pipe(data(file => file[config.frontMatter.property]))
    .pipe(markdown())
    .pipe(liquidjs)
    .pipe(beautify(config.beautify))
    .pipe(rename(config.rename))
    .pipe(dest(config.paths.dest))
}