'use strict';

var Generator = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

class MyYeoman extends Generator {

  // Bu method otomatik olarak çalıştırılmaz
  helper() {
    console.log('methods on the parent generator won\'t be called automatically');
  }
}

module.exports = class extends MyYeoman {

  // constructor -> ilk bu method çalıştırılır. Daha sonra methodlar yazılış sırasına göre otomatik olarak çalıştırılır.
  // private methodlar otomatik olarak çalıştırılmaz
  // option ve argument tanımlamaları bu method içerisinde çalıştırılmalıdır.
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);

    // option ve arguman kullanımı için : http://yeoman.io/authoring/user-interactions.html

    this.option('leblebi', {
      type: String,
      desc: 'Leblebi'
    });
    this.scriptSuffix = (this.options.leblebi ? '.coffee' : '.js');
    // this.log(this.scriptSuffix);

    // yo xyz appname -> eğer appname değeri girilmezse hata döndürür.Çünkü required = true yaptık.
    // appname argümanının girilmesini zorunlu bırakıyoruz
    this.argument('appname', {
      type: String,
      required: true
    });
    // this.log(this.options.appname);


    // Bu method otomatik olarak çalıştırılmaz
    this.helperMethod = function () {
      console.log('won\'t be called automatically');
    };


    // yo generator arguman --option
  }

  paths() {
    this.log('destinationRoot: ' + this.destinationRoot());
    // returns '/Users/aykutasil/UltimateYeoman/test'

    this.log('destinationPath: ' + this.destinationPath('index.js'));
    // returns '/Users/aykutasil/UltimateYeoman/test/index.js'

    this.log('contextRoot: ' + this.contextRoot);
    // returns '/Users/aykutasil/UltimateYeoman/test'
  }

  prompting() {
    var done = this.async();

    this.log(yosay( // yeoman çalıştırılırken ilk başta gözüken proje bilgilendirme kısmını hazırlamaka için kullanılır
      'Aykut Asil proje oluşturma yapısına Hoş Geldiniz... ' +
      chalk.red('generator-ultimate-yeoman') + // yazı renklendirme için kullanılır
      ' generator!'
    ));

    var prompts = [{
      type: 'input',
      name: 'name',
      message: 'Your project name',
      default: this.appname, // Default to current folder name
      validate: function (input) {
        if (/^([a-zA-Z0-9_]*)$/.test(input)) {
          return true;
        }
        return 'Uygulama isminde özel karakter ve boşluk olamaz. Bunun yerine default değeri kullan: ' + this.appname;
      }
    }, {
      type: 'input',
      name: 'package_name',
      message: 'Package name: ',
      validate: function (input) {
        if (/^([a-z_]{1}[a-z0-9_]*(\.[a-z_]{1}[a-z0-9_]*)*)$/.test(input)) {
          return true;
        }
        return 'The package name you have provided is not a valid Java package name.';
      }
    }, {
      type: 'input',
      name: 'username',
      message: 'What\'s your Github username',
      default: 'aykuttasil',
      store: true // true değeri verilirse girilen değer default değer gibi işlem görür.
            // Kullanıcı bir sonraki çalıştırışında default olarak bu değeri görür
    }, {
      type: 'input',
      name: 'kullanici_adi',
      message: 'What\'s your Github username',
      default: 'aykuttasil'
    }];

    return this.prompt(prompts).then(function (props) {
      this.appPackage = props.package_name;
      props.appPackage = props.package_name;
      this.username = props.username;

      this.props = props;
      this.log(this.props);

      done();
    }.bind(this));
  }

  config() {
    // config.set('key',value) ile .yo-rc.json dosyasına kayıt ekleyebiliriz.
    // subgenerator çalıştırılırken veya ulaşmak istediğimiz herhangi bir yerden config.get('key') çağırmamız yeterli
    // bu sayede kullanıcının girdiği değerler veya default değeler kayıt edilerek dosyaların ona göre oluşturulması sağlanır.

    // Bu adresten diğer config methodlarına ulaşılabilir: http://yeoman.io/authoring/storage.html
    this.config.set('coffeescript', false);
    this.config.set('kullanici_adi', 'aykuttasil');
    this.config.set('username', this.username);

    this.log(this.config.getAll());
  }


  method1() {
    // config() methodu içerisinde tanımladığımız değişkeni burda çağırıyoruz ve ekrana yazdırıyoruz
    this.log(this.config.get('kullanici_adi'));
    this.log(this.config.get('username'));

    console.log('method 1 çalıştı.');
  }

  method2() {
    console.log('method 2 çalıştı.');
  }

  // '_'  ile başlayan methodlar otomatik olarak çalıştırılmaz
  _privateMethod() {
    console.log('private hey');
  }

  writing() {
    var packageDir = this.props.appPackage.replace(/\./g, '/');
    this.log('Package Dir: ' + packageDir);

    // Eğer hazırlanan dosya içerisinde değişken kullanılmış ise copyTpl ile kopyalama yapılır
    this.fs.copyTpl(
      this.templatePath('dummyfile.txt'),
      this.destinationPath('dummyfile.txt'), {
        username: this.username
      }
    );

    this.fs.copyTpl(
      this.templatePath('testFolder/'),
      this.destinationPath('denemeFolder/'), {
        test: 'test124'
      });

    // Hazırlanacak dosya aynen kopyalama yapılacak ise yani dosya içerisinde değişken ile doldurulacak bir bölüm yok ise
    // copy ile kopyalama yapılır
    // this.fs.copy()
  }

  install() {
    this.spawnCommand('echo', ['istediğimiz komutu çalıştırabiliriz']);

    // Tüm dosyalar kopyalandıktan sonra dependency lerin yüklenmesi sağlanır
    // Eğer çalıştırılmazsa node_modules klasörü oluşturulmamış olur.
    /*
    this.installDependencies({
      npm: false,
      bower: true,
      yarn: true
    });
    */
  }

};
