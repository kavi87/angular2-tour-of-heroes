const gulp = require('gulp');
const del = require('del');
const typescript = require('gulp-typescript');
const tscConfig = require('./tsconfig.json');
const sourcemaps = require('gulp-sourcemaps');

const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const historyApiFallback = require('connect-history-api-fallback');

// Clean the content of the distribution directory
gulp.task('clean', function () {
    return del('dist/**/*');
});

// Copy dependencies
gulp.task('copy:libs', ['clean'], function() {
    return gulp.src([
            'node_modules/angular2/bundles/angular2-polyfills.js',
            'node_modules/systemjs/dist/system.src.js',
            'node_modules/rxjs/bundles/Rx.js',
            'node_modules/angular2/bundles/angular2.dev.js',
            'node_modules/angular2/bundles/router.dev.js'
        ])
        .pipe(gulp.dest('dist/lib'))
});

// Copy static assets - i.e. non TypeScript compiled source
gulp.task('copy:assets', ['clean'], function() {
    return gulp.src([
        'app/**/*',
        '!app/**/*.ts',
        'index.html'],
        { base : './' })
        .pipe(gulp.dest('dist'))
});

// TypeScript compilation
gulp.task('compile', ['clean'], function () {
    return gulp
        .src(tscConfig.files)
        .pipe(sourcemaps.init())
        .pipe(typescript(tscConfig.compilerOptions))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/app'));
});

// Run browsersync for development
gulp.task('serve', ['build'], function() {
    browserSync.init({
        server: {
            baseDir: 'dist',
            middleware: [ historyApiFallback() ]
        }
    });

    gulp.watch(['app/**/*', 'index.html'], ['buildAndReload']);
});

gulp.task('build', ['compile', 'copy:libs', 'copy:assets']);
gulp.task('buildAndReload', ['build'], reload);
gulp.task('default', ['build']);