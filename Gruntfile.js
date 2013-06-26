module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    coffee: {

      glob_to_multiple: {

        expand: true,
        // flatten: true,
        cwd: 'app/coffee',
        src: ['**/*.coffee'],
        dest: 'app/js',
        ext: '.js'

      }

    },

    compass: {
      
      /*
        compile foundation4 scss files, it will generate `app/compass/foundation4/css/app.css`
      */
      zf4: {
        options: {
          config: 'app/compass/foundation4/config.rb',
          basePath: 'app/compass/foundation4'
        }
      }

    },

    less: {

      /*
        compile bootstrap less files to `app/css`
        `bootstrap.css` and `bootstrap-responsive.css`
      */
      b2: {
        options: {
          paths: 'app/components/bootstrap/less'
        },
        files: {
          "app/css/bootstrap.css": "app/components/bootstrap/less/bootstrap.less",
          "app/css/bootstrap-responsive.css": "app/components/bootstrap/less/responsive.less"
        }
      }

    },

    concat: {

      // Concat Foundation4's Javascripts to `public/js/foundation.all.js`
      zf4js: {
        src: ['app/compass/foundation4/js/foundation/foundation.js', 'app/compass/foundation4/js/foundation/*.js'],
        dest: 'public/js/foundation.all.js'
      },

      // Copy Foundation4 css file to `app/css/foundation.css`
      zf4css: {
        src: ['app/compass/foundation4/css/app.css'],
        dest: 'app/css/foundation.css'
      },

      // Concat Bootstrap's Javascripts to `public/js/bootstrap.all.js`
      b2js: {
        src: ['app/components/bootstrap/js/bootstrap-tooltip.js', 'app/components/bootstrap/js/*.js'],
        dest: 'public/js/bootstrap.all.js'
      }

    },

    copy: {

      /*
        copy `app/css` all files to `public/css`
      */
      css: {

        files: [

          {
            expand: true,
            cwd: 'app/css',
            src: ['**/*.css'],
            dest: 'public/css'
          }

        ]

      },

      js: {

        files: [

          {
            expand: true,
            cwd: 'app/js',
            src: ['**/*.js'],
            dest: 'public/js'
          }

        ]

      },

      b2images: {

        files: [

          {
            expand: true,
            cwd: 'app/components/bootstrap/img',
            src: ['**/*.png'],
            dest: 'public/images'
          }

        ]

      },

      /*
        Copy Foundation4's Vendor Javascripts
        `app/compass/foundation4/js/vendor` all files to `public/js/vendor`
      */
      zf4_js_vendor: {

        files: [

          {
            expand: true,
            cwd: 'app/compass/foundation4/js/vendor',
            src: ['*.js'],
            dest: 'public/js/vendor'
          }
        ]

      }

    },

    uglify: {

      options: {
        banner: '/*! \n<%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %>\n<%= pkg.description %>\n */\n\n'
      },

      // Minify Foundation 4 Javascripts
      zf4js: {
        src: '<%= concat.zf4js.dest %>',
        dest: 'public/js/foundation.all.min.js'
      },

      // Minify Bootstrap Javascripts
      b2js: {
        src: '<%= concat.b2js.dest %>',
        dest: 'public/js/bootstrap.all.min.js'
      }

    },

    watch: {

      coffee: {
        files: 'app/coffee/**/*.coffee',
        tasks: ['coffee']
      },

      // Re-Grunt default task when gruntfile is changed.
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: ['compile']
      },

      // Re-Compass when compass files are changed.
      scss: {
        files: 'app/compass/**/*.scss',
        tasks: ['compass', 'concat:zf4css']
      },

      css: {
        files: 'app/css/**/*.css',
        tasks: ['copy:css']
      },

      public_all: {
        files: 'public/**/*',
        options: {
          livereload: true,
          // no child process, so we only have once livereload
          nospawn: true,
          // interrupt: true
        }
      }

    }

  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['compile', 'watch']); 
  grunt.registerTask('compile', ['coffee','compass', 'less', 'concat','copy:js', 'copy:zf4_js_vendor', 'copy:b2images', 'uglify']); 
  // Bootstrap 
  grunt.registerTask('bootstrap', ['less:b2', 'concat:b2js']);
  // Re-compile CSS files
  grunt.registerTask('css', ['compass', 'less', 'concat:zf4css', 'copy:css']);

};