// 引用 gulp plugin
var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    compass = require('gulp-compass'),
    imagemin = require('gulp-imagemin'),
    plumber = require('gulp-plumber'),
    connect = require('gulp-connect'),
    notify = require('gulp-notify');

var scriptsPaths = {
    src: 'source/js/*.js', // 也可用'./source/js/**'指定所有檔案
    dest: 'public/javascripts'
};

var stylesPaths = {
	src: 'source/sass/**/*.sass',
	dest: 'public/stylesheets'
};

var imagesPaths = {
	src: 'source/img/**',
	dest: 'public/images'
}

// 記錄例外錯誤函式
function errorLog(error) {
	console.log(error);
	this.emit('end');
}

gulp.task('scripts', function() {
	gulp.src(scriptsPaths.src) // 指定要處理的原始 JavaScript 檔案目錄
	    // .on('error', errorLog) // 使用錯誤事件處理例外
	    .pipe(plumber())          // 使用 gulp-plumber 處理例外
	    .pipe(concat('main.js'))  // 將多個js合併為一個
	    .pipe(uglify())           // 將 JavaScript 做最小化
	    .pipe(gulp.dest(scriptsPaths.dest)) // 指定合併與最小化後的 JavaScript 檔案目錄
	    .pipe(notify("Concat & Minify JavaScript Finish")) // 處理結束通知訊息
	    .pipe(connect.reload());      // 當檔案異動後自動重新載入頁面
});

gulp.task('styles', function() {
	gulp.src(stylesPaths.src)
	    // .on('error', errorLog) // 使用錯誤事件處理例外
	    .pipe(plumber())
	    .pipe(compass({
	    	css: 'public/stylesheets',  // compass輸出位置
	    	sass: 'source/sass',    // sass 來源路徑
	    	image: 'source/img',    // 圖片來源路徑
	    	style: 'compressed',    // CSS 處理方式，預設 nested (expanded, nested, compact, compressed)
	    	comments: false,        // 是否要註解，預設(true)
	    	require: ['susy'],      // 額外套件 susy
	    }))
	    .pipe(connect.reload());        // 當檔案異動後自動重新載入頁面
	    // .pipe(gulp.dest(stylesPaths.dest)); // 輸出位置(非必要)
});

gulp.task('images', function() {
	gulp.src(imagesPaths.src)
	    .pipe(imagemin())
	    .pipe(gulp.dest(imagesPaths.dest));
});

gulp.task('connect', function() {
	connect.server({
		livereload: true
	})
});

// 加入監看工作
gulp.task('watch', function() {
	gulp.watch(scriptsPaths.src, ['scripts']);
	gulp.watch(stylesPaths.src, ['styles']);
	gulp.watch(imagesPaths.src, ['images']);
});

gulp.task('default', ['scripts', 'styles', 'images', 'watch', 'connect']);