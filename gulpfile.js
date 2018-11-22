/**
 * build
 */

const path = require('path');
const gulp = require('gulp');
const replace = require('gulp-replace');

const prod = process.env.NODE_ENV === 'production';
const buildPath = path.join(__dirname, 'dist');
const cloudEnv = prod ? 'YOUR-CLOUD-PROD-ENV' : 'YOUR-CLOUD-TEST-ENV';

gulp.task('build:src', ['build:deps'], () => {
    gulp.src('src/**')
        .pipe(replace('CLOUD_ENV', cloudEnv))
        .pipe(gulp.dest(buildPath));
});

gulp.task('build:deps', () => {
    // wux components
    let components = prod ? [
        'animation-group',
        'backdrop',
        'button',
        'cell',
        'cell-group',
        'checkbox',
        'checkbox-group',
        'col',
        'floating-button',
        'helpers',
        'icon',
        'notice-bar',
        'radio',
        'radio-group',
        'result',
        'row',
        'segmented-control',
        'select',
        'styles',
        'tab',
        'white-space',
        'wing-blank',
        'toptips'
    ] : ['**'];
    let src = components.map((component) => {
        return path.join('node_modules/wux-weapp/dist', component, '**');
    });
    src.push('node_modules/wux-weapp/dist/index.js');

    return gulp.src(src, {base: 'node_modules/wux-weapp/dist'})
        .pipe(gulp.dest(path.join(buildPath, 'wux')));

});

gulp.task('watch', () => {
    gulp.watch('src/**', ['build:deps', 'build:src']);
});

gulp.task('default', ['build:deps', 'build:src']);

gulp.task('build', ['build:deps', 'build:src']);
