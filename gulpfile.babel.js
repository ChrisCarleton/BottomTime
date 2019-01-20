/* eslint no-process-env: 0 */

import eslint from 'gulp-eslint';
import gulp from 'gulp';
import log from 'fancy-log';
import mocha from 'gulp-mocha';
import webpack from 'webpack';
import webpackStream from 'webpack-stream';
import WebpackDevServer from 'webpack-dev-server';

const webpackDevConfig = require('./webpack.dev');
const webpackProdConfig = require('./webpack.prod');

function lint() {
	return gulp.src([ 'web/**/*.js', 'web/**/*.jsx', 'tests/**/*.js', 'gulpfile.babel.js' ])
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
}

function test() {
	return gulp
		.src([ 'tests/**/*.tests.js' ])
		.pipe(mocha({
			require: '@babel/register',
			timeout: 30000
		}));
}

function packageDev() {
	return gulp.src('web/app.js')
		.pipe(webpackStream(
			webpackDevConfig,
			webpack
		))
		.pipe(gulp.dest('dist/dev'));
}

function packageProd() {
	return gulp.src('web/app.js')
		.pipe(webpackStream(
			webpackProdConfig,
			webpack
		))
		.pipe(gulp.dest('dist/prod'));
}

function serve(done) {
	new WebpackDevServer(
		webpack(webpackDevConfig),
		{
			compress: true,
			historyApiFallback: true,
			hot: true,
			index: 'index.html',
			port: 8080,
			proxy: {
				'/api': process.env.BT_API_URL || 'http://localhost:29201/'
			},
			publicPath: '/',
			watchContentBase: true
		})
		.listen(8080, 'localhost', err => {
			if (err) {
				return done(err);
			}

			log('Dev server started on port 8080.');
			return done();
		});
}

gulp.task('package-dev', packageDev);

gulp.task('package-prod', packageProd);

gulp.task('package', gulp.parallel(packageDev, packageProd));

gulp.task('lint', lint);

gulp.task('test', test);

gulp.task('build-and-test', gulp.series(packageDev, test));

gulp.task('serve', serve);

gulp.task('default', serve);
