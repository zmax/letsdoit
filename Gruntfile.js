/*
 
 
     .o8                                                         .o8  
    "888                                                        "888  
     888oooo.   .ooooo.  oooo    ooo  .ooooo.  ooo. .oo.    .oooo888  
     d88' `88b d88' `88b  `88.  .8'  d88' `88b `888P"Y88b  d88' `888  
     888   888 888ooo888   `88..8'   888   888  888   888  888   888  
     888   888 888    .o    `888'    888   888  888   888  888   888  
     `Y8bod8P' `Y8bod8P'     .8'     `Y8bod8P' o888o o888o `Y8bod88P" Inc.
                         .o..P'                                       
                         `Y8P'                                        


  Let's Do It!

  @version        1.0
  @author         Starck Lin
  @copyright      /dev/null


  founcation:

    zf4css:  [ compass:zf4  -> concat:zf4css ]
    zf4js:   [ concat:zf4js -> copy:zf4_js_vendor ]

  bootstrap:



  watch:
    
    coffee:
    `app/coffee/*.coffee` => `app/js`

    zf4_css:
    `app/compass/*.scss` => [zf4css]
  
    app_js:
    `app/js/*.js` => [copy:js]
    
    app_css:
    `app/css/*.css => [copy:css]

    public_all:
    `public/*` => [livereload]

*/ 


module.exports = function(grunt) {

  var pkg = grunt.file.readJSON('package.json');

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    // Compile CoffeeScript to `app/js/lib`, ignore app.coffee if glob to multiple.
    coffee: {

      glob_to_multiple: {

        expand: true,
        // flatten: true,
        cwd: 'app/coffee',
        src: ['**/*.coffee', '!app.coffee'],
        dest: 'app/js',
        ext: '.js'

      },

      compile_to_single: {

        files: {
          "app/js/<%= pkg.settings.coffee.filename %>": ['app/coffee/**/*.coffee']
        }

      }

    },

    compass: {
      
      /*
        Compile Foundation4 compass project, it will generate `app/compass/foundation4/css/app.css`
      */
      zf4: {
        options: {
          config: 'app/compass/foundation4/config.rb',
          basePath: 'app/compass/foundation4'
        }
      }

    },

    sass: {

      app: {

        options: {

        },

        files: {
          'app/css/app.css': 'app/sass/**/*.scss'
        }

      }

    },

    less: {

      /*
        Compile Bootstrap LESS files to `app/css`
        it will generate `bootstrap.css` and `bootstrap-responsive.css`
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

      // Concat Bootstrap's Javascripts to `public/js/bootstrap.all.js`
      b2js: {
        src: ['app/components/bootstrap/js/bootstrap-tooltip.js', 'app/components/bootstrap/js/*.js'],
        dest: 'public/js/bootstrap.all.js'
      },

      // Copy Foundation4 css file to `public/css/foundation.css`
      zf4css: {
        src: ['app/compass/foundation4/css/app.css'],
        dest: 'app/css/foundation.css'
      },

      // Concat Bootstrap's two CSS file to one.
      b2css: {
        src: ['app/css/bootstrap.css', 'app/css/bootstrap-responsive.css'],
        dest: 'public/css/bootstrap.all.css'
      }

    },

    copy: {

      /*
        Copy `app/css` all files to `public/css`
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

      /*
        Copy `app/js` all javascript files to `public/js`, and keep its structure.
      */
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

      /*
        Copy Bootstrap's images.
      */
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

      packageJson: {
        files: 'package.json',
        tasks: ['compile']
      },

      // Re-Grunt default task when gruntfile is changed.
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: ['compile']
      },

      // Re-compile coffee scripts when they are changed.
      coffee: {
        files: 'app/coffee/**/*.coffee',
        tasks: ['compileCoffee']
      },

      // Re-Compass and Publish to public css folder when SCSS files is changed in foundation project.
      zf4_compass: {
        files: 'app/compass/**/*.scss',
        tasks: ['zf4css']
      },

      b2_less: {
        files: 'app/components/bootstrap/less/*.less',
        tasks: ['less:b2'],
        options: {
          // interrupt: true,
          // nospawn: true
        }
      },

      zf4_uglify_js: {
        files: '<%= uglify.zf4js.src %>',
        tasks: ['uglify:zf4js']
      },

      b2_uglify_js: {
        files: '<%= uglify.b2js.src %>',
        tasks: ['uglify:b2js']
      },

      app_sass: {
        files: 'app/sass/**/*.scss',
        tasks: ['sass:app'],
        options: {
          // interrupt: true,
          // nospawn: true
        }
      },

      app_css: {
        files: 'app/css/**/*.css',
        tasks: ['copy:css'],
        options: {
          // interrupt: true,
          // nospawn: true
        }
      },

      app_js: {
        files: 'app/js/**/*.js',
        tasks: ['copy:js'],
        options: {
          // interrupt: true,
          // nospawn: true
        }
      },

      // Live Reload
      public_all: {
        files: 'public/**/*',
        options: {
          livereload: true,
          // no child process, so we only have once livereload
          // nospawn: true,
          // interrupt: true
        }
      }

    }

  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // grunt.event.on('watch', function(action, filepath, target) {

  //   grunt.log.writeln( 'EVENT: ' + target + ': ' + filepath + ' has ' + action);

  // });

  // doNoThing ...
  grunt.registerTask('null',[]);

  // Default task(s).
  grunt.registerTask('default', ['compile', 'copy', 'watch']);

  grunt.registerTask('compileCoffee', [( pkg.settings.coffee.enable === true ) ? ( ( pkg.settings.coffee.concat === true) ? 'coffee:compile_to_single' : 'coffee:glob_to_multiple' ) : 'null']);

  grunt.registerTask('compile', [ 'compileCoffee', 'sass:app', 'foundation', 'bootstrap', 'copy:css', 'copy:js', 'uglify']); 

  /*

    Bootstrap: LESS -> CSS -> JS -> Images

  */ 

  grunt.registerTask('bootstrap', ['b2css', 'b2js', 'copy:b2images']);
  // CSS
  grunt.registerTask('b2css', ['less:b2', 'concat:b2css']);
  // JS
  grunt.registerTask('b2js', ['concat:b2js']);

  /*

    Foundation Compass -> CSS -> JS + Vendor JS
  
  */

  grunt.registerTask('foundation', ['zf4css', 'zf4js']);
  // CSS
  grunt.registerTask('zf4css', ['compass:zf4', 'concat:zf4css']);
  // JS
  grunt.registerTask('zf4js', ['concat:zf4js', 'copy:zf4_js_vendor']);


  // Re-compile CSS files - Foundation -> Bootstrap
  grunt.registerTask('css', ['sass:app', 'zf4css', 'b2css']);

};