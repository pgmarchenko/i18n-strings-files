// Generated by CoffeeScript 1.10.0
(function() {
  var Iconv, fs, i18nStringsFiles;

  fs = require('fs');

  Iconv = require('iconv').Iconv;

  i18nStringsFiles = function() {};

  i18nStringsFiles.prototype.readFile = function(file, options, callback) {
    var encoding, wantsComments;
    encoding = null;
    wantsComments = false;
    if (typeof callback === "undefined" && typeof options === "function") {
      callback = options;
      encoding = null;
    } else if (typeof options === "string") {
      encoding = options;
    } else if (typeof options === "object") {
      encoding = options['encoding'];
      wantsComments = options['wantsComments'];
    }
    return fs.readFile(file, (function(_this) {
      return function(err, buffer) {
        var data, str;
        if (err) {
          return typeof callback === "function" ? callback(err, null) : void 0;
        }
        str = _this.convertBufferToString(buffer, encoding);
        data = _this.parse(str, wantsComments);
        return typeof callback === "function" ? callback(null, data) : void 0;
      };
    })(this));
  };

  i18nStringsFiles.prototype.readFileSync = function(file, options) {
    var buffer, encoding, str, wantsComments;
    encoding = null;
    wantsComments = false;
    if (typeof options === 'string') {
      encoding = options;
    } else if (typeof options === 'object') {
      encoding = options['encoding'];
      wantsComments = options['wantsComments'];
    }
    buffer = fs.readFileSync(file);
    str = this.convertBufferToString(buffer, encoding);
    return this.parse(str, wantsComments);
  };

  i18nStringsFiles.prototype.writeFile = function(file, data, options, callback) {
    var buffer, encoding, str, wantsComments, wantsEmptyLines;
    encoding = null;
    wantsComments = false;
    if (typeof callback === "undefined" && typeof options === "function") {
      callback = options;
      encoding = null;
    } else if (typeof options === "string") {
      encoding = options;
    } else if (typeof options === "object") {
      encoding = options['encoding'];
      wantsComments = options['wantsComments'];
      wantsEmptyLines = options['wantsEmptyLines'];
    }
    str = this.compile(data, wantsComments, wantsEmptyLines);
    buffer = this.convertStringToBuffer(str, encoding);
    return fs.writeFile(file, buffer, (function(_this) {
      return function(err) {
        return typeof callback === "function" ? callback(err) : void 0;
      };
    })(this));
  };

  i18nStringsFiles.prototype.writeFileSync = function(file, data, options) {
    var buffer, encoding, str, wantsComments, wantsEmptyLines;
    encoding = null;
    wantsComments = false;
    wantsEmptyLines = false;
    if (typeof options === 'string') {
      encoding = options;
    } else if (typeof options === 'object') {
      encoding = options['encoding'];
      wantsComments = options['wantsComments'];
      wantsEmptyLines = options['wantsEmptyLines'];
    }
    str = this.compile(data, wantsComments, wantsEmptyLines);
    buffer = this.convertStringToBuffer(str, encoding);
    return fs.writeFileSync(file, buffer);
  };

  i18nStringsFiles.prototype.convertBufferToString = function(buffer, encoding) {
    var iconv;
    if (!encoding) {
      encoding = 'UTF-16';
    }
    iconv = new Iconv(encoding, 'UTF-8');
    return iconv.convert(buffer).toString('utf8');
  };

  i18nStringsFiles.prototype.convertStringToBuffer = function(str, encoding) {
    var iconv;
    if (!encoding) {
      encoding = 'UTF-16';
    }
    iconv = new Iconv('UTF-8', encoding);
    return iconv.convert(str);
  };

  i18nStringsFiles.prototype.parse = function(input, wantsComments) {
    var currentComment, lines, nextLineIsComment, reAssign, reCommentEnd, reLineEnd, result;
    if (!wantsComments) {
      wantsComments = false;
    }
    reAssign = /[^\\]" = "/;
    reLineEnd = /";$/;
    reCommentEnd = /\*\/$/;
    result = {};
    lines = input.split("\n");
    currentComment = '';
    nextLineIsComment = false;
    lines.forEach(function(line) {
      var msgid, msgstr, val;
      line = line.trim();
      line = line.replace(/([^\\])("\s*=\s*")/g, "$1\" = \"");
      line = line.replace(/"\s+;/g, '";');
      if (nextLineIsComment) {
        if (line.search(reCommentEnd) === -1) {
          currentComment += '\n' + line.trim();
        } else {
          nextLineIsComment = false;
          currentComment += '\n' + line.substr(0, line.search(reCommentEnd)).trim();
        }
      } else if (line.substr(0, 2) === '/*') {
        if (line.search(reCommentEnd) === -1) {
          nextLineIsComment = true;
          currentComment = line.substr(2).trim();
        } else {
          nextLineIsComment = false;
          currentComment = line.substr(2, line.search(reCommentEnd) - 2).trim();
        }
      }
      if (line.substr(0, 1) !== '"' || line.search(reAssign) === -1 || line.search(reLineEnd) === -1) {
        return;
      }
      msgid = line;
      msgid = msgid.substr(1);
      msgid = msgid.substr(0, msgid.search(reAssign) + 1);
      msgstr = line;
      msgstr = msgstr.substr(msgstr.search(reAssign) + 6);
      msgstr = msgstr.substr(0, msgstr.search(reLineEnd));
      msgid = msgid.replace(/\\"/g, "\"");
      msgstr = msgstr.replace(/\\"/g, "\"");
      msgid = msgid.replace(/\\n/g, "\n");
      msgstr = msgstr.replace(/\\n/g, "\n");
      if (!wantsComments) {
        return result[msgid] = msgstr;
      } else {
        val = {
          'text': msgstr
        };
        if (currentComment) {
          val['comment'] = currentComment;
          currentComment = '';
        }
        return result[msgid] = val;
      }
    });
    return result;
  };

  i18nStringsFiles.prototype.compile = function(data, wantsComments, wantsEmptyLines) {
    var comment, msgid, msgstr, output, val;
    if (!wantsComments) {
      wantsComments = false;
    }
    if (typeof data !== "object") {
      return "";
    }
    output = "";
    for (msgid in data) {
      val = data[msgid];
      msgstr = '';
      comment = null;
      if (typeof val === 'string') {
        msgstr = val;
      } else {
        if (val.hasOwnProperty('text')) {
          msgstr = val['text'];
        }
        if (wantsComments && val.hasOwnProperty('comment')) {
          comment = val['comment'];
        }
      }
      msgid = msgid.replace(/"/g, "\\\"");
      msgstr = msgstr.replace(/"/g, "\\\"");
      msgid = msgid.replace(/\n/g, "\\n");
      msgstr = msgstr.replace(/\r?\n/g, "\\n");
      if (comment) {
        output = output + "/* " + comment + " */\n";
      }
      output = output + "\"" + msgid + "\" = \"" + msgstr + "\";\n";
      if (wantsEmptyLines) {
      	output = output + "\n";
      }
    }
    return output;
  };

  module.exports = new i18nStringsFiles;

}).call(this);
