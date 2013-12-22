// Generated by CoffeeScript 1.6.3
(function() {
  var checkValues, fileEncoding, fileTemp, fileTest, fs, i18nStringsFiles, should;

  fs = require('fs');

  should = require('should');

  i18nStringsFiles = require('../index');

  fileTemp = __dirname + '/temp.strings';

  fileTest = __dirname + '/test.strings';

  fileEncoding = 'UTF-16';

  checkValues = function(data) {
    data['test-normal'].should.equal("Test normal");
    data['test-chars'].should.equal("Olvidé mi contraseña");
    data['test-new-lines'].should.equal("Test\nNew\nLines");
    data['test-quotes'].should.equal("\"Test quote\"");
    data['test-spacing'].should.equal("Test spacing");
    return data['test \n edge" = '].should.equal("Test edge");
  };

  describe('Sync: Reading file into object', function() {
    return it('should populate object properties with values', function() {
      var data;
      data = i18nStringsFiles.readFileSync(fileTest, fileEncoding);
      return checkValues(data);
    });
  });

  describe('Sync: Read, compile, parse', function() {
    return it('should populate object properties with values before and after', function() {
      var data, str;
      data = i18nStringsFiles.readFileSync(fileTest, fileEncoding);
      checkValues(data);
      str = i18nStringsFiles.compile(data);
      data = i18nStringsFiles.parse(str);
      return checkValues(data);
    });
  });

  describe('Sync: Read, write, read', function() {
    return it('should populate object properties with values before and after', function() {
      var data;
      data = i18nStringsFiles.readFileSync(fileTest, fileEncoding);
      checkValues(data);
      i18nStringsFiles.writeFileSync(fileTemp, data, fileEncoding);
      data = i18nStringsFiles.readFileSync(fileTemp, fileEncoding);
      checkValues(data);
      return fs.unlinkSync(fileTemp);
    });
  });

  describe('Async: Reading file into object', function() {
    return it('should populate object properties with values', function(done) {
      return i18nStringsFiles.readFile(fileTest, fileEncoding, function(err, data) {
        checkValues(data);
        return done();
      });
    });
  });

  describe('Async: Read, write, read', function() {
    return it('should populate object properties with values before and after', function(done) {
      return i18nStringsFiles.readFile(fileTest, fileEncoding, function(err, data) {
        checkValues(data);
        return i18nStringsFiles.writeFile(fileTemp, data, fileEncoding, function(err) {
          return i18nStringsFiles.readFile(fileTemp, fileEncoding, function(err, data) {
            checkValues(data);
            fs.unlinkSync(fileTemp);
            return done();
          });
        });
      });
    });
  });

  describe('Async: Read, write, read (no encoding param)', function() {
    return it('should populate object properties with values before and after', function(done) {
      return i18nStringsFiles.readFile(fileTest, function(err, data) {
        checkValues(data);
        return i18nStringsFiles.writeFile(fileTemp, data, function(err) {
          return i18nStringsFiles.readFile(fileTemp, function(err, data) {
            checkValues(data);
            fs.unlinkSync(fileTemp);
            return done();
          });
        });
      });
    });
  });

}).call(this);
