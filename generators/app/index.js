'use strict';
var Generator = require('yeoman-generator');
var chalk = require('chalk'); // yazı renklendirme için kullanılır
var yosay = require('yosay'); // yeoman çalıştırılırken ilk başta gözüken proje bilgilendirme kısmını hazırlamaka için kullanılır

module.exports = Generator.extend({
  prompting: function () {
    var done = this.async();

    this.log(yosay(
      'Aykut Asil proje oluşturma yapısına Hoş Geldiniz... ' +
      chalk.red('generator-sample-yeoman') +
      ' generator!'
    ));

    var prompts = [{
      type: 'confirm',
      name: 'someAnswer',
      message: 'www.aykutasil.com u ziyaret ettin mi ?',
      default: true
    }, {
      type: 'input',
      name: 'name',
      message: 'Proje adı',
      default: this.appname
    }, {
      type: 'input',
      name: 'degiskenB',
      message: 'B name',
      default: this.appname
    }];

    return this.prompt(prompts).then(function (props) {
      this.props = props;
      this.log(props.someAnswer);
      this.log(props.name);

      done();
    }.bind(this));
  },

  writing: {
    config: function () {
      this.fs.copyTpl( // Eğer hazırlanan dosya içerisinde değişken kullanılmış ise copyTpl ile kopyalama yapılır
        this.templatePath('a.txt'),
        this.destinationPath('a.txt'), {
          name: this.props.name
        }
      );

      this.fs.copyTpl(
        this.templatePath('b.txt'),
        this.destinationPath('b.txt'), {
          degiskenB: this.props.degiskenB
        }
      );

      this.fs.copy( // Hazırlanacak dosya aynen kopyalama yapılacak ise yani dosya içerisinde değişken ile doldurulacak bir bölüm yok ise
        // copy ile kopyalama yapılır
        this.templatePath('dummyfile.txt'),
        this.destinationPath('dummyfile.txt')
      );

      this.fs.copy(
        this.templatePath('testFolder/_test.txt'),
        this.destinationPath('testFolderDeneme/test.txt')
      );
    }
  },

  install: function () {
    // this.installDependencies(); // tüm dosyala kopyalandıktan sonra npm init çalıştırılması için kullanılır. Eğer çalıştırılmazsa node_modules klasörü oluşturulmamış olur.
  }
});
