const gulp         = require('gulp')
const plumber      = require('gulp-plumber')
const notify       = require('gulp-notify')
const sass         = require('gulp-sass')
const minify       = require('gulp-minify')
const sourcemaps   = require('gulp-sourcemaps')
const autoprefixer = require('gulp-autoprefixer')
const rename       = require('gulp-rename')
const imagemin     = require('gulp-imagemin')
const connect      = require('gulp-connect')
const gutil        = require('gulp-util')
const ftp          = require('vinyl-ftp')
const babel        = require('gulp-babel')

let config = {
  'root': 'dist/',
  'src' : 'src/',
  'dist': 'dist/assets/'
}

/** FTP Configuration **/   
var user = process.env.FTP_USER;  
var password = process.env.FTP_PWD;  
var file_name = process.env.FTP_NAME;
var host = 'baptistevillain.fr';  
var port = 21;  
var localFilesGlob = ['./dist/**'];
var remoteFolder = 'baptistevillain.fr/' + file_name;

gulp.task('connect', function() {
  connect.server({
    root: 'dist',
    livereload: true
  })
})

gulp.task('sass', function () {
  return gulp.src(config.src + 'scss/*.scss')
    .pipe(plumber({errorHandler: notify.onError('SASS Error: <%= error.message %>')}))
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(autoprefixer({
    browsers: ['last 2 versions'],
    cascade: false
  }))
    .pipe(rename(function (path) {
    path.basename += ".min"
  }))
    .pipe(gulp.dest(config.dist + 'css'))
    .pipe(connect.reload())
})

gulp.task('javascript', function() {
  return gulp.src(config.src + 'js/*.js')
    .pipe(plumber({errorHandler: notify.onError("JS Error: <%= error.message %>")}))
    .pipe(babel({
            presets: ['es2015']
    }))
    .pipe(minify({
    ext:{
      src:'.js',
      min:'.min.js'
    },
    ignoreFiles: ['.min.js'],
    noSource: true
  }))
    .pipe(gulp.dest(config.dist + 'js'))
    .pipe(connect.reload())
})

gulp.task('images', function() {
  return gulp.src(config.src + 'img/*')
    .pipe(imagemin())
    .pipe(gulp.dest(config.dist + 'img'))
    .pipe(connect.reload())
    .pipe(notify('Images minified!'))
})

gulp.task('html', function () {
  return gulp.src(config.root + '*.html')
    .pipe(connect.reload())
})


gulp.task('watch', function() {
  gulp.watch(config.src + 'scss/**/*.scss', ['sass'])
  gulp.watch(config.src + 'js/*.js', ['javascript'])
  gulp.watch(config.root + '*.html', ['html'])
})

function getFtpConnection() {  
  return ftp.create({
    host: host,
    port: port,
    user: user,
    password: password,
    parallel: 5,
    log: gutil.log
  });
}

gulp.task('ftp-deploy', function() {
  var conn = getFtpConnection();
  return gulp.src(localFilesGlob, { base: './dist/', buffer: false })
    .pipe( conn.newerOrDifferentSize( remoteFolder ) )
    .pipe( conn.dest( remoteFolder ) )
    .pipe(notify('FTP uploading files'));
});

gulp.task('ftp-deploy-watch', function() {
  var conn = getFtpConnection();
  gulp.watch(localFilesGlob)
    .on('change', function(event) {
    return gulp.src( [event.path], { base: './dist/', buffer: false } )
      .pipe( conn.newerOrDifferentSize( remoteFolder ) )
      .pipe( conn.dest( remoteFolder ) )
      .pipe(notify('Changes detected! Uploading file "' + event.path));
  });
});


gulp.task('default', ['connect', 'watch'], function() {})