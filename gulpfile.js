// src 源目录 dest 目标目录 series 并行任务/串型任务 watch 监听
const { src, dest, series, watch } = require('gulp')
const del = require('del')
const browserSync = require('browser-sync').create()
const reload = browserSync.reload
// gulp-uglify => plugins.uglify
const plugins = require('gulp-load-plugins')()

// 压缩js uglifyjs
function js (cb) {
  src('js/*.js')
    .pipe(plugins.uglify())
    .pipe(dest('./dist/js'))
    .pipe(reload({stream: true}))
  cb()
}

// 对scss/less逆行编译， 压缩， 输出css 目录
function css (cb) {
  // 压缩了css
  src('./css/index.scss')
    .pipe(plugins.sass({ outputStyles: 'compressed' }))
    .pipe(plugins.autoprefixer({
      cascade: false,
      remove: false
    }))
    .pipe(dest('./dist/css'))
    .pipe(reload({stream: true}))
  cb()
}

// 监听这些文件的变化
function watcher () {
  watch('js/*.js', js)
  watch('css/*.scss', css)
}

// 删除dist目录中的内容
function clear (cb) {
  del('./dist')
  cb()
}

// 热更新
function server (cb) {
  browserSync.init({
    server: {
        baseDir: "./"
    }
  })
  cb()
}

exports.scripts = js
exports.styles = css
exports.clear = clear
exports.default = series([
  clear,
  js,
  css,
  server,
  watcher
])


// 说明：
// 1:  gulp-sass
// 2:  gulp-autoprefixer
// 3:  gulp-load-plugins
// 4:  gulp-uglify
// 5:  del 

// npm run build