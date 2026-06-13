const gulp = require('gulp')
const { series, parallel, watch } = gulp
const path = require('path')
const { Readable } = require('stream')

const autoprefixer = require('autoprefixer')
const babelify = require('babelify')
const browserify = require('browserify')
const browsersync = require('browser-sync').create()
const notifier = require('node-notifier')
const postcss = require('gulp-postcss')
const rimraf = require('rimraf')
const sass = require('gulp-sass')(require('sass'))
const uglifyJs = require('uglify-js')
const Vinyl = require('vinyl')

function clean(cb) {
  rimraf('./dist', cb)
}

function showError(arg) {
  notifier.notify({
    title: 'Error',
    message: '' + arg,
    sound: 'Basso'
  })
  console.log(arg)
  if (this && this.emit) {
    this.emit('end')
  }
}

const assetsDir = path.join('examples', 'assets')

function compileScss() {
  return gulp.src(path.join(assetsDir, '*.scss'), { base: assetsDir })
    .pipe(sass({
      style: 'expanded',
      precision: 10,
      includePaths: ['.', 'node_modules']
    }).on('error', showError))
    .pipe(postcss([
      autoprefixer({
        browsers: ['last 2 versions', 'Firefox ESR', 'Explorer >= 9', 'Android >= 4.0', '> 2%']
      })
    ]))
    .pipe(gulp.dest(assetsDir))
}

function buildScss() {
  return compileScss()
}

function buildScssWatch() {
  return compileScss().pipe(browsersync.stream({ match: '**/*.css' }))
}

function bundleParallax() {
  return new Promise((resolve, reject) => {
    browserify({
      entries: path.join('src', 'parallax.js'),
      debug: false,
      standalone: 'Parallax'
    })
      .transform('babelify', {presets: ['es2015']})
      .bundle((err, buf) => {
        if (err) {
          showError(err)
          reject(err)
          return
        }
        resolve(buf)
      })
  })
}

function writeVinyl(dest, filename, contents) {
  const file = new Vinyl({
    base: path.join(process.cwd(), dest),
    path: path.join(process.cwd(), dest, filename),
    contents: Buffer.isBuffer(contents) ? contents : Buffer.from(contents)
  })

  return new Promise((resolve, reject) => {
    Readable.from([file])
      .pipe(gulp.dest(dest))
      .on('finish', resolve)
      .on('error', reject)
  })
}

function buildJsFull() {
  return bundleParallax().then(buf => writeVinyl('dist', 'parallax.js', buf))
}

function buildJsMin() {
  return bundleParallax().then(buf => {
    const minified = uglifyJs.minify(buf.toString())
    if (minified.error) {
      throw minified.error
    }
    return writeVinyl('dist', 'parallax.min.js', minified.code)
  })
}

const buildJs = parallel(buildJsFull, buildJsMin)

function buildJsReload(done) {
  browsersync.reload()
  done()
}

function watchTask() {
  browsersync.init({
    notify: false,
    port: 9000,
    startPath: '/index.html',
    server: {
      baseDir: [path.join('examples', 'pages'), assetsDir, 'dist']
    }
  })
  watch(path.join('src', '*.js'), series(buildJs, buildJsReload))
  watch(path.join('examples', 'assets', '*.scss'), buildScssWatch)
  watch(path.join('examples', 'pages', '*.html'), browsersync.reload)
}

const build = series(clean, parallel(buildJs, buildScss))
const watchDev = series(build, watchTask)

exports.clean = clean
exports['build:scss'] = buildScss
exports['build:js'] = buildJs
exports.buildJsFull = buildJsFull
exports.buildJsMin = buildJsMin
exports.build = build
exports.watch = watchDev
exports.default = watchDev
