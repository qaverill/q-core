"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _Settings = _interopRequireDefault(require("./components/Settings"));

var _qLib = require("q-lib");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _templateObject8() {
  var data = _taggedTemplateLiteral(["\n  height: calc(100% / 0);\n  width: calc(100%);\n  margin: 2.5px;\n  background-color: gray;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background-color: ", ";\n"]);

  _templateObject8 = function _templateObject8() {
    return data;
  };

  return data;
}

function _templateObject7() {
  var data = _taggedTemplateLiteral(["\n  height: calc(100% / ", ");\n  width: 100%;\n  display: flex;\n"]);

  _templateObject7 = function _templateObject7() {
    return data;
  };

  return data;
}

function _templateObject6() {
  var data = _taggedTemplateLiteral(["\n  margin-left: auto;\n"]);

  _templateObject6 = function _templateObject6() {
    return data;
  };

  return data;
}

function _templateObject5() {
  var data = _taggedTemplateLiteral(["\n  width: 120px;\n"]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = _taggedTemplateLiteral(["\n  width: 110px;\n"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral(["\n  width: calc(100% - 10px);\n  overflow: auto;\n  background-color: black;\n  height: calc(100% - 50px);\n  margin: 2.5px;\n  border: 2.5px solid black;\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n  margin: 2.5px;\n  height: 60px;\n  background-color: black;\n  padding: 5px;\n  display: flex;\n  align-items: center;\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  border: 5px solid ", ";\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var bassQTheme = _qLib.q_colors.bassQTheme;
var Page = _qLib.q_styledComponents.Page,
    SettingsGear = _qLib.q_styledComponents.SettingsGear,
    StyledPopup = _qLib.q_styledComponents.StyledPopup,
    Selector = _qLib.q_styledComponents.Selector,
    Button = _qLib.q_styledComponents.Button;
var BassQPage = (0, _styledComponents.default)(Page)(_templateObject(), bassQTheme.primary);

var CreatorBar = _styledComponents.default.div(_templateObject2());

var FretBoard = _styledComponents.default.div(_templateObject3());

var RootSelector = (0, _styledComponents.default)(Selector)(_templateObject4());
var ModeSelector = (0, _styledComponents.default)(Selector)(_templateObject5());
var SettingsButton = (0, _styledComponents.default)(SettingsGear)(_templateObject6());

var String = _styledComponents.default.div(_templateObject7(), function (props) {
  return props.numStrings;
});

var Fret = _styledComponents.default.div(_templateObject8(), function (props) {
  return props.color;
});

var modes = [{
  value: [0, 4, 7, 11],
  label: "maj"
}, {
  value: [0, 3, 7, 10],
  label: "min"
}];
var roots = [{
  value: "0",
  label: "C"
}, {
  value: "1",
  label: "C#"
}, {
  value: "2",
  label: "D"
}, {
  value: "3",
  label: "D#"
}, {
  value: "4",
  label: "E"
}, {
  value: "5",
  label: "F"
}, {
  value: "6",
  label: "F#"
}, {
  value: "7",
  label: "G"
}, {
  value: "8",
  label: "G#"
}, {
  value: "9",
  label: "A"
}, {
  value: "10",
  label: "A#"
}, {
  value: "11",
  label: "B"
}];

var BassQ =
/*#__PURE__*/
function (_React$Component) {
  _inherits(BassQ, _React$Component);

  function BassQ(props) {
    var _this;

    _classCallCheck(this, BassQ);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(BassQ).call(this, props));
    _this.state = {
      numStrings: _qLib.q_settings.get() != null ? _qLib.q_settings.get().numStrings : 8,
      numFrets: _qLib.q_settings.get() != null ? _qLib.q_settings.get().numFrets : 8,
      lowestString: _qLib.q_settings.get() != null ? _qLib.q_settings.get().lowestString : "B",
      root: _qLib.q_settings.get() != null ? _qLib.q_settings.get().root : null,
      mode: _qLib.q_settings.get() != null ? _qLib.q_settings.get().mode : null
    };
    return _this;
  }

  _createClass(BassQ, [{
    key: "render",
    value: function render() {
      return _react.default.createElement(BassQPage, null, _react.default.createElement(CreatorBar, null, _react.default.createElement(RootSelector, {
        options: roots,
        placeholder: "Root...",
        onChange: this.setRoot,
        value: this.state.root
      }), _react.default.createElement(ModeSelector, {
        options: modes,
        placeholder: "Mode...",
        onChange: this.setMode,
        value: this.state.mode
      }), _react.default.createElement(Button, {
        color: "red",
        onClick: this.clearFretColors
      }, "Clear"), _react.default.createElement(StyledPopup, {
        trigger: _react.default.createElement(SettingsButton, {
          size: "40px"
        }),
        modal: true
      }, _react.default.createElement(_Settings.default, {
        parent: this
      }))), _react.default.createElement(FretBoard, null, this.generateStrings()));
    }
  }, {
    key: "generateStrings",
    value: function generateStrings() {
      var strings = [];

      for (var string = 0; string < this.state.numStrings; string++) {
        strings.push(_react.default.createElement(String, {
          numStrings: this.state.numStrings,
          key: string
        }, this.generateFrets(string)));
      }

      return strings;
    }
  }, {
    key: "generateFrets",
    value: function generateFrets(string) {
      var _this2 = this;

      var columns = [];

      var _loop = function _loop(fret) {
        var note = _this2.getNoteFromValue(string, fret, _this2.state.lowestString);

        columns.push(_react.default.createElement(Fret, {
          color: _this2.getNoteColor(note),
          onClick: function onClick() {
            return _this2.colorFret(note);
          }
        }, note));
      };

      for (var fret = 0; fret < this.state.numFrets; fret++) {
        _loop(fret);
      }

      return columns;
    }
  }, {
    key: "getNoteFromValue",
    value: function getNoteFromValue(string, fret, lowestString) {
      var notes = roots.map(function (root) {
        return root.label;
      });
      return notes[(notes.indexOf(lowestString) + fret + string * 7) % 12];
    }
  }, {
    key: "getNoteColor",
    value: function getNoteColor(note) {
      var _this3 = this;

      var notes = roots.map(function (root) {
        return root.label;
      });
      var color = null;

      if (this.state.mode !== null) {
        this.state.mode.value.forEach(function (interval, rank) {
          if (note === notes[(notes.indexOf(_this3.state.root.label) + interval) % 12]) {
            color = ["green", "yellow", "orange", "red", "purple", "blue"][rank];
          }
        });
      }

      return color;
    }
  }, {
    key: "colorFret",
    value: function colorFret(note) {
      this.setState({
        root: roots.find(function (root) {
          return root.label === note;
        })
      });
    }
  }, {
    key: "setRoot",
    value: function setRoot(root) {
      _qLib.q_settings.set("root", root);

      this.setState({
        root: root
      });
    }
  }, {
    key: "setMode",
    value: function setMode(mode) {
      _qLib.q_settings.set("mode", mode);

      this.setState({
        mode: mode
      });
    }
  }, {
    key: "clearFretColors",
    value: function clearFretColors() {
      this.setState({
        root: null,
        mode: null
      });
    }
  }]);

  return BassQ;
}(_react.default.Component);

var _default = BassQ;
exports.default = _default;