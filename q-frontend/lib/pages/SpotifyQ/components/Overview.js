"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _axios = _interopRequireDefault(require("axios"));

var _reactTooltip = _interopRequireDefault(require("react-tooltip"));

var _qLib = require("q-lib");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _templateObject4() {
  var data = _taggedTemplateLiteral(["\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral(["\n  display: flex;\n  align-self: stretch;\n  flex-shrink: 1;\n  flex-grow: 1;\n  margin: 2.5px;\n  border: none;\n\n  \n  background-image: ", ";\n  background-position: center center;\n  background-repeat: no-repeat;\n  background-size: cover;\n\n  transition: all 300ms ease-in;\n  \n  :hover {\n    flex-grow: 10;\n    padding-top: ", "%;\n  }\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  flex-grow: 1;\n  transition: all 300ms ease-in;\n  :hover {\n    flex-grow: 3;\n  }\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  display: flex;\n  width: 100%;\n  height: 100%;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var LeftArrow = _qLib.q_styledComponents.LeftArrow,
    RightArrow = _qLib.q_styledComponents.RightArrow,
    Header = _qLib.q_styledComponents.Header;
var SpotifyErrorPage = _qLib.q_components.SpotifyErrorPage;

var TopChartsContainer = _styledComponents.default.div(_templateObject());

var TopChart = _styledComponents.default.div(_templateObject2());

var Item = _styledComponents.default.div(_templateObject3(), function (props) {
  return "url(".concat(props.image.url, ")");
}, function (props) {
  return props.image.width / props.image.height;
});

var ToolTip = _styledComponents.default.div(_templateObject4());

var Overview =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Overview, _React$Component);

  function Overview(props) {
    var _this2;

    _classCallCheck(this, Overview);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(Overview).call(this, props));
    _this2.state = {
      N: 6,
      totalDuration: null,
      topNTracks: null,
      topNArtists: null,
      topNAlbums: null
    };
    return _this2;
  }

  _createClass(Overview, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      this.analyzeResults();
    }
  }, {
    key: "render",
    value: function render() {
      return _react.default.createElement(TopChartsContainer, null, _react.default.createElement(_reactTooltip.default, {
        getContent: function getContent(dataTip) {
          return _react.default.createElement(ToolTip, null, _react.default.createElement("h2", null, dataTip != null ? dataTip.split(':::')[0] : null), _react.default.createElement("h3", null, dataTip != null ? dataTip.split(':::')[1] : null));
        }
      }), _react.default.createElement(TopChart, null, _react.default.createElement(Header, null, "Top Tracks:"), this.state.topNTracks), _react.default.createElement(TopChart, null, _react.default.createElement(Header, null, "Top Artists:"), this.state.topNArtists), _react.default.createElement(TopChart, null, _react.default.createElement(Header, null, "Top Albums:"), this.state.topNAlbums));
    }
  }, {
    key: "analyzeResults",
    value: function analyzeResults() {
      var totalDuration = 0;
      var trackPlays = {};
      var artistPlays = {};
      var albumPlays = {};
      this.props.data.forEach(function (listen) {
        totalDuration += listen.duration;
        trackPlays[listen.track] == null ? trackPlays[listen.track] = 1 : trackPlays[listen.track] += 1;
        listen.artists.forEach(function (artist) {
          artistPlays[artist] == null ? artistPlays[artist] = 1 : artistPlays[artist] += 1;
        });
        albumPlays[listen.album] == null ? albumPlays[listen.album] = 1 : albumPlays[listen.album] += 1;
      });
      this.getSpotifyData(this.playsToSortedList(trackPlays), 'tracks');
      this.getSpotifyData(this.playsToSortedList(artistPlays), 'artists');
      this.getSpotifyData(this.playsToSortedList(albumPlays), 'albums');
      this.setState({
        totalDurationMs: totalDuration
      });
    }
  }, {
    key: "playsToSortedList",
    value: function playsToSortedList(plays) {
      return Object.keys(plays).map(function (key) {
        return {
          id: key,
          count: plays[key]
        };
      }).sort(Overview.sortByCount);
    }
  }, {
    key: "getSpotifyData",
    value: function getSpotifyData(list, type) {
      var _this3 = this;

      var _this = this;

      var topN = list.splice(0, this.state.N);

      _axios.default.get("/spotify/".concat(type, "?ids=").concat(topN.map(function (item) {
        return item.id;
      }).join())).then(function (res) {
        _this.setState(_defineProperty({}, "topN".concat(_qLib.q_utils.capitolFirstLetter(type)), res.data[type].map(function (item) {
          return _react.default.createElement(Item, {
            key: item.id,
            "data-tip": "".concat(item.name, " ::: ").concat(topN.find(function (e) {
              return e.id === item.id;
            }).count),
            image: _this.getItemImage(item, type)
          });
        })));

        _reactTooltip.default.rebuild();
      }).catch(function (error) {
        console.log(error);

        if (error.response.status === 401) {
          _this3.props.root.setState({
            error: _react.default.createElement(SpotifyErrorPage, null)
          });
        }
      });
    }
  }, {
    key: "getItemImage",
    value: function getItemImage(item, type) {
      switch (type) {
        case 'tracks':
          return item.album.images[0];

        case 'artists':
          return item.images[0];

        case 'albums':
          return item.images[0];

        default:
          return null;
      }
    }
  }], [{
    key: "sortByCount",
    value: function sortByCount(a, b) {
      if (a.count < b.count) {
        return 1;
      }

      if (a.count > b.count) {
        return -1;
      } else return 0;
    }
  }]);

  return Overview;
}(_react.default.Component);

var _default = Overview;
exports.default = _default;