var gulp = require('gulp');

var sass = require('gulp-sass');//編譯SASS
const babel = require('gulp-babel');//編譯JS

const htmlmin = require('gulp-htmlmin');//壓縮HTML
var jade = require('gulp-jade');//tempelate
let cleanCSS = require('gulp-clean-css');//壓縮CSS
var uglify = require('gulp-uglify');//壓縮JS

var plumber = require('gulp-plumber');//出錯後不會停止

var postcss = require('gulp-postcss');//增加自動判斷增加前綴詞的工具
var autoprefixer = require('autoprefixer'); //csspost延伸套件 自動判斷增加前綴詞

const concat = require('gulp-concat');//合併JS
const sourcemaps = require('gulp-sourcemaps');//合併後路徑
var mainBowerFiles = require('main-bower-files');//bower 合併成一隻JS檔

var browserSync = require('browser-sync').create();//架設虛擬網站

var minimist = require('minimist');//控制開發與成品的工具
var gulpif = require('gulp-if');//minimist的判斷式
var clean = require('gulp-clean');// 清除多於檔案以保輸出檔案乾淨正式

var gulpSequence = require('gulp-sequence');//最後輸出成品使用的依序執行任務工具

const imagemin = require('gulp-imagemin');//壓縮圖片



var envOptions = {
    string: 'env',
    default: { env: 'develop' }
}
var options = minimist(process.argv.slice(2),envOptions)

//手動清除資料夾，以保輸出為正式版本
gulp.task('clean', function () {
    return gulp.src(['./.tmp' , './public'], { read: false , allowEmpty: true })
        .pipe(clean());
});
gulp.task('image-min', () => 
    gulp.src('./source/images/*')
        .pipe(imagemin()) 
        //.pipe(gulpif(options.env === 'production', imagemin()))//加入判斷式，開發完成輸出才壓縮，提高開發速度。
        .pipe(gulp.dest('./public/images'))
);
//生成HTML到public
gulp.task('copyHTML',function(){
    return gulp.src('./source/**/*.html')
        .pipe(plumber())
        //.pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulpif(options.env === 'production', htmlmin({ collapseWhitespace: true })))
        .pipe(gulp.dest('./public/'))
        .pipe(browserSync.stream());
})
//編譯JS檔案
gulp.task('babel', () =>
    gulp.src('./source/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat('all.js'))
        //.pipe(uglify())   //壓縮JS
        .pipe(gulpif(options.env === 'production', uglify()))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./public/js'))
);
//架設虛擬server
gulp.task('browser-sync', function (done) {
    browserSync.init({
        server: {
            baseDir: "./public"
        }
    });
    done();
});
//autoprefixer
gulp.task('autoprefixer', () => {
    return gulp.src('./source/stylesheets/*.css')
        .pipe(sourcemaps.init())
        .pipe(postcss([autoprefixer()]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./public/stylesheets/'))
})
//監控，例子為監控SASS 有更動同步更新編譯
gulp.task('watch', function (done) {
    gulp.watch('./source/**/*.html', gulp.series('copyHTML'));
    //gulp.watch('./source/**/*.jade', ['jade']);
    gulp.watch('./source/js/**/*.js', gulp.series('babel'));

    done();
});
//依序執行任務
gulp.task('default',
    gulp.parallel(
        /*'copyHTML' ,*/ 'babel', 'autoprefixer', 'image-min' ,
         'browser-sync' , 'watch')
)
//發佈正式版依序執行任務
//gulp.task('bulid', gulpSequence('clean', 'copyHTML' , 'sass','babel','vendorJs'));


//4.0版，parallel同時執行，series依序執行
gulp.task('build',
    gulp.series(
        'clean',
    gulp.parallel(/*'copyHTML' , */'babel')
    )
)