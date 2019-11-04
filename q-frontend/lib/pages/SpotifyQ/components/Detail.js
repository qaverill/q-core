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

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  width: 100%;\n  height: 100%;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Text = _qLib.q_styled_components.Text;

var DetailContainer = _styledComponents.default.div(_templateObject());

var getTotalDuration = function getTotalDuration(data) {
  return data.map(function (l) {
    return l.duration;
  }).reduce(function (total, num) {
    return total + num;
  });
};

var getUniqueNumberOfArtists = function getUniqueNumberOfArtists(data) {
  return _toConsumableArray(new Set(data.map(function (l) {
    return l.artists;
  }).flat())).length;
};

var getUniqueNumberOfTracks = function getUniqueNumberOfTracks(data) {
  return _toConsumableArray(new Set(data.map(function (l) {
    return l.track;
  }))).length;
};

var getUniqueNumberOfAlbums = function getUniqueNumberOfAlbums(data) {
  return _toConsumableArray(new Set(data.map(function (l) {
    return l.album;
  }))).length;
};

var Detail =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Detail, _React$Component);

  function Detail(props) {
    var _this;

    _classCallCheck(this, Detail);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Detail).call(this, props));
    _this.state = {
      totalDurationMs: 0,
      uniqueNumberOfArtists: 0,
      uniqueNUmberOfTracks: 0,
      uniqueNumberOfAlbums: 0
    };
    return _this;
  }

  _createClass(Detail, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      var data = this.props.data;
      this.setState({
        totalDurationMs: getTotalDuration(data),
        uniqueNumberOfArtists: getUniqueNumberOfArtists(data),
        uniqueNUmberOfTracks: getUniqueNumberOfTracks(data),
        uniqueNumberOfAlbums: getUniqueNumberOfAlbums(data)
      });
    }
  }, {
    key: "render",
    value: function render() {
      var totalTimeMs = this.props.totalTimeMs;
      var _this$state = this.state,
          totalDurationMs = _this$state.totalDurationMs,
          uniqueNUmberOfTracks = _this$state.uniqueNUmberOfTracks,
          uniqueNumberOfArtists = _this$state.uniqueNumberOfArtists,
          uniqueNumberOfAlbums = _this$state.uniqueNumberOfAlbums;
      return _react.default.createElement(DetailContainer, null, _react.default.createElement("h2", null, "Detail"), _react.default.createElement(Text, null, "Total Listening Time: ".concat(_qLib.q_utils.msToString(totalDurationMs))), _react.default.createElement(Text, null, "Percent of time Listening: ".concat(parseInt(totalDurationMs / totalTimeMs * 100, 10), "%")), _react.default.createElement(Text, null, "Total Unique Tracks: ".concat(uniqueNUmberOfTracks)), _react.default.createElement(Text, null, "Total Unique Artists: ".concat(uniqueNumberOfArtists)), _react.default.createElement(Text, null, "Total Unique Albums: ".concat(uniqueNumberOfAlbums)));
    }
  }]);

  return Detail;
}(_react.default.Component);

var _default = Detail;
exports.default = _default;