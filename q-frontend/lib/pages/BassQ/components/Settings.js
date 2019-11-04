"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

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

function _templateObject3() {
  var data = _taggedTemplateLiteral(["\n  width: 50px;\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  display: flex;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var TextInput = _qLib.q_styledComponts.TextInput,
    PopupContainer = _qLib.q_styledComponts.PopupContainer;

var Setting = _styledComponents.default.div(_templateObject());

var SettingTitle = _styledComponents.default.h2(_templateObject2());

var SettingInput = (0, _styledComponents.default)(TextInput)(_templateObject3());

var settings =
/*#__PURE__*/
function (_React$Component) {
  _inherits(settings, _React$Component);

  function settings() {
    _classCallCheck(this, settings);

    return _possibleConstructorReturn(this, _getPrototypeOf(settings).apply(this, arguments));
  }

  _createClass(settings, [{
    key: "render",
    value: function render() {
      var _this = this;

      return _react.default.createElement(PopupContainer, null, _react.default.createElement(Setting, null, _react.default.createElement(SettingTitle, null, "Number of Frets: "), _react.default.createElement(SettingInput, {
        id: "numFrets",
        onBlur: function onBlur() {
          return _this.setNumFrets();
        },
        defaultValue: this.props.parent.state.numFrets
      })), _react.default.createElement(Setting, null, _react.default.createElement(SettingTitle, null, "Number of Strings: "), _react.default.createElement(SettingInput, {
        id: "numStrings",
        onBlur: function onBlur() {
          return _this.setNumStrings();
        },
        defaultValue: this.props.parent.state.numStrings
      })), _react.default.createElement(Setting, null, _react.default.createElement(SettingTitle, null, "Lowest String: "), _react.default.createElement(SettingInput, {
        id: "lowestString",
        onBlur: function onBlur() {
          return _this.setLowestString();
        },
        defaultValue: this.props.parent.state.lowestString
      })));
    }
  }, {
    key: "setNumFrets",
    value: function setNumFrets() {
      _qLib.q_settings.set("numFrets", parseInt(document.getElementById("numFrets").value));

      this.props.parent.setState({
        numFrets: parseInt(document.getElementById("numFrets").value)
      });
    }
  }, {
    key: "setNumStrings",
    value: function setNumStrings() {
      _qLib.q_settings.set("numStrings", parseInt(document.getElementById("numStrings").value));

      this.props.parent.setState({
        numStrings: parseInt(document.getElementById("numStrings").value)
      });
    }
  }, {
    key: "setLowestString",
    value: function setLowestString() {
      _qLib.q_settings.set("lowestString", document.getElementById("lowestString").value);

      this.props.parent.setState({
        lowestString: document.getElementById("lowestString").value
      });
    }
  }]);

  return settings;
}(_react.default.Component);

var _default = settings;
exports.default = _default;