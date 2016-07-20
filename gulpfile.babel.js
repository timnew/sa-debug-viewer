import gulp from 'gulp'
import git from 'gulp-git'
import bump from 'gulp-bump'
import tagVersion from 'gulp-tag-version'
import babel from 'gulp-babel'

;['major', 'minor', 'patch'].forEach((type) => {
  gulp.task(`bump:${type}`, ['build'], () =>
    gulp.src('./package.json')
    .pipe(bump({ type }))
    .pipe(gulp.dest('./'))
    .pipe(git.commit('bumps version'))
    .pipe(tagVersion())
  )
})
gulp.task('bump', ['bump:patch'])

gulp.task('build', ['build:babel'])
gulp.task('build:babel', () =>
  gulp.src('src/*.js')
		.pipe(babel())
		.pipe(gulp.dest('lib'))
)
