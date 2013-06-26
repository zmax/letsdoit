module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    compass: {

      zf4: {
        options: {
          config: 'app/compass/foundation4/config.rb',
          basePath: 'app/compass/foundation4'
        }
      }

    },

    concat: {

      // concat foundation4 javascripts to foundation.all.js
      zf4js: {
        src: ['app/compass/foundation4/js/foundation/foundation.js', 'app/compass/foundation4/js/foundation/*.js'],
        dest: 'public/js/foundation.all.js'
      },

      // copy foundation4 css
      zf4css: {
        src: ['app/compass/foundation4/css/app.css'],
        dest: 'public/css/foundation.css'
      }

    },

    copy: {

      // copy foundation4 vendor javascripts
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
        banner: '/*! \n<%= pkg.name %> \n<%= pkg.description %> <%= grunt.template.today("yyyy-mm-dd") %>\n */\n\n'
      },

      // minify foundation 4 javascript
      zf4js: {
        src: '<%= concat.zf4js.dest %>',
        dest: 'public/js/foundation.all.min.js'
      }
    },

    watch: {

      scss: {
        files: '**/*.scss',
        tasks: ['css'],
      },

      public_all: {
        files: 'public/**/*',
        options: {
          livereload: true,
        }
      }

    }

  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['compass', 'concat', 'copy', 'uglify', 'watch']);
  // grunt.registerTask('recompile', ['compass', 'concat', 'copy', 'uglify']);
  grunt.registerTask('css', ['compass', 'concat:zf4css']);

};