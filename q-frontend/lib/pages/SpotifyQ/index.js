"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Overview = _interopRequireDefault(require("./components/Overview"));

var _Detail = _interopRequireDefault(require("./components/Detail"));

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

var spotifyQTheme = _qLib.q_colors.spotifyQTheme;
var ExplorePage = _qLib.q_components.ExplorePage;

var SpotifyQ =
/*#__PURE__*/
function (_React$Component) {
  _inherits(SpotifyQ, _React$Component);

  function SpotifyQ(props) {
    var _this;

    _classCallCheck(this, SpotifyQ);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SpotifyQ).call(this, props));
    _this.displays = ['Overview', 'Detail'];
    _this.state = {
      start: Math.round(new Date().getTime() / 1000) - 3 * _qLib.q_utils.ONE_EPOCH_DAY,
      end: Math.round(new Date().getTime() / 1000),
      data: null,
      selectedIndex: 0
    };
    return _this;
  }

  _createClass(SpotifyQ, [{
    key: "displayResults",
    value: function displayResults() {
      var root = this.props.root;
      var _this$state = this.state,
          selectedIndex = _this$state.selectedIndex,
          data = _this$state.data,
          end = _this$state.end,
          start = _this$state.start;

      switch (this.displays[selectedIndex]) {
        case 'Overview':
          return _react.default.createElement(_Overview.default, {
            data: data,
            root: root
          });

        case 'Detail':
          return _react.default.createElement(_Detail.default, {
            data: data,
            totalTimeMs: (end - start) * 1000
          });

        default:
          return null;
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$state2 = this.state,
          start = _this$state2.start,
          end = _this$state2.end,
          data = _this$state2.data;
      return _react.default.createElement(ExplorePage, {
        source: "listens",
        parent: this,
        colorTheme: spotifyQTheme,
        results: this.displayResults(),
        displays: this.displays,
        start: start,
        end: end,
        data: data
      });
    }
  }]);

  return SpotifyQ;
}(_react.default.Component);

var _default = SpotifyQ;
exports.default = _default;