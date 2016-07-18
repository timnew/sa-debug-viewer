import gulp from 'gulp'
import git from 'gulp-git'
import bump from 'gulp-bump'
import tagVersion from 'gulp-tag-version'

;['major', 'minor', 'patch'].forEach((type) => {
  gulp.task(`bump:${type}`, () =>
    gulp.src('./package.json')
    .pipe(bump({ type }))
    .pipe(gulp.dest('./'))
    .pipe(git.commit('bumps version'))
    .pipe(tagVersion())
  )
})
gulp.task('bump', ['bump:patch'])
