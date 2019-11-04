"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _axios = _interopRequireDefault(require("axios"));

var _reactTooltip = _interopRequireDefault(require("react-tooltip"));

var _reactNotifications = require("react-notifications");

var _qLib = require("q-lib");

var _collectors = require("./collectors");

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

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n  min-width: 180px;\n  width: ", ";\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  border: 5px solid ", ";\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var dataQTheme = _qLib.q_colors.dataQTheme;
var Page = _qLib.q_styledComponents.Page,
    Text = _qLib.q_styledComponents.Text,
    Button = _qLib.q_styledComponents.Button;
var LoadingSpinner = _qLib.q_components.LoadingSpinner,
    SpotifyAPIErrorPage = _qLib.q_components.SpotifyAPIErrorPage,
    AccountingData = _qLib.q_components.AccountingData,
    AlbumCoverArray = _qLib.q_components.AlbumCoverArray,
    ArraySelector = _qLib.q_components.ArraySelector;
var ordinalStart;
var Q_PLAYLIST_ID = '6d2V7fQS4CV0XvZr1iOVXJ';
var TRANSACTION_SOURCES = ['mvcu', 'venmo', 'citi'];
var DataQPage = (0, _styledComponents.default)(Page)(_templateObject(), dataQTheme.primary);

var _SaveButton = (0, _styledComponents.default)(Button)(_templateObject2(), function (props) {
  return props.width;
});

var addSavesToQPlaylist = function addSavesToQPlaylist(data) {
  var requestBody = {
    playlistId: Q_PLAYLIST_ID,
    uris: data.map(function (d) {
      return "spotify:track:".concat(d.track);
    }),
    position: 0
  };

  _axios.default.post('/spotify/playlists', requestBody).then(function () {
    _reactNotifications.NotificationManager.success('Wrote saves to Q playlist');
  });
};

var getUnsavedTransactionData = function getUnsavedTransactionData(items, mongoResults) {
  var transactionFacts = items;
  TRANSACTION_SOURCES.forEach(function (source) {
    var sourceMaxTimestamp = Math.max.apply(Math, _toConsumableArray(mongoResults.data.filter(function (d) {
      return d.account.indexOf(source) > -1;
    }).map(function (d) {
      return d.timestamp;
    })));
    transactionFacts = transactionFacts.filter(function (f) {
      return f.account.indexOf(source) > -1 ? f.timestamp > sourceMaxTimestamp : true;
    });
  });
  var lastTimestamp = Math.max.apply(Math, _toConsumableArray(mongoResults.data.map(function (d) {
    return d.timestamp;
  })));
  var lastDataEntry = mongoResults.data.find(function (d) {
    return d.timestamp === lastTimestamp;
  });
  ordinalStart = lastDataEntry != null ? lastDataEntry.ordinal + 1 : 1;
  return transactionFacts.reverse().map(function (fact, n) {
    return _objectSpread({}, fact, {
      ordinal: ordinalStart + n,
      tags: []
    });
  }).reverse();
};

var DataQ =
/*#__PURE__*/
function (_React$Component) {
  _inherits(DataQ, _React$Component);

  function DataQ(props) {
    var _this2;

    _classCallCheck(this, DataQ);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(DataQ).call(this, props));
    _this2.state = {
      selectedIndex: _qLib.q_settings.get().dataQSelectedIndex,
      unsaved: null
    };
    return _this2;
  }

  _createClass(DataQ, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (sessionStorage.getItem('dataQUnsaved')) {
        this.setState({
          unsaved: JSON.parse(sessionStorage.getItem('dataQUnsaved'))
        });
      } else {
        this.getData();
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(_prevProps, prevState) {
      var selectedIndex = this.state.selectedIndex;

      if (prevState.selectedIndex !== selectedIndex) {
        this.getData();
        this.setState({
          unsaved: null
        });
      }
    }
  }, {
    key: "getData",
    value: function getData() {
      var _this = this;

      var root = this.props.root;

      var _this$collector = this.collector(),
          sourcePath = _this$collector.sourcePath,
          mongodbPath = _this$collector.mongodbPath,
          timeParam = _this$collector.timeParam,
          name = _this$collector.name;

      _axios.default.get(sourcePath).then(function (sourceResults) {
        var items = sourceResults.data.items;
        var mongoParams = {
          params: {
            start: _qLib.q_utils.dateToEpoch(items[items.length - 1][timeParam])
          }
        };

        _axios.default.get(mongodbPath, mongoParams).then(function (mongoResults) {
          if (name === 'transactions') {
            items = getUnsavedTransactionData(items, mongoResults);
          } else {
            var maxTimestamp = Math.max.apply(Math, _toConsumableArray(mongoResults.data.map(function (d) {
              return d.timestamp;
            })));
            items = items.filter(function (i) {
              return _qLib.q_utils.dateToEpoch(i[timeParam]) > maxTimestamp;
            });
          }

          _this.setState({
            unsaved: items
          });
        });
      }).catch(function (error) {
        if (error.response.status === 401) root.setState({
          error: _react.default.createElement(SpotifyAPIErrorPage, null)
        });
      });
    }
  }, {
    key: "collector",
    value: function collector() {
      var selectedIndex = this.state.selectedIndex;
      return _collectors.collectors[selectedIndex];
    }
  }, {
    key: "writeToMongo",
    value: function writeToMongo() {
      var _this = this;

      var unsaved = this.state.unsaved;
      var collector = this.collector();

      if (collector.name === 'transactions') {
        if (unsaved.filter(function (i) {
          return i.tags.indexOf('NEEDS ORDINAL') > -1;
        }).length > 0) {
          _reactNotifications.NotificationManager.error('A transaction is missing an ordinal!');

          return;
        }

        if (unsaved.filter(function (i) {
          return i.tags.length > 0;
        }).length !== unsaved.length) {
          _reactNotifications.NotificationManager.error('Missing tags for a transaction!');

          return;
        }
      }

      var data = collector.name === 'transactions' ? unsaved : this.transformSpotifyDataForMongo(unsaved);

      _axios.default.post(collector.mongodbPath, data).then(function () {
        _this.setState({
          unsaved: null
        });

        _this.getData();

        _reactNotifications.NotificationManager.success("Synced ".concat(collector.name));

        if (collector.name === 'saves') addSavesToQPlaylist(data);
        sessionStorage.removeItem('dataQUnsaved');
      });
    }
  }, {
    key: "transformSpotifyDataForMongo",
    value: function transformSpotifyDataForMongo(items) {
      var _this3 = this;

      return items.map(function (item) {
        return {
          timestamp: _qLib.q_utils.dateToEpoch(item[_this3.collector().timeParam]),
          track: item.track.id,
          artists: item.track.artists.map(function (artist) {
            return artist.id;
          }),
          album: item.track.album.id,
          duration: item.track.duration_ms,
          popularity: item.track.popularity
        };
      });
    }
  }, {
    key: "SaveButton",
    value: function SaveButton(props) {
      var _this4 = this;

      var unsaved = props.unsaved,
          name = props.name,
          color = props.color;

      if (name === 'transactions' && unsaved.filter(function (i) {
        return i.tags.length === 0;
      }).length !== 0) {
        return _react.default.createElement(Text, null, "TAG SHIT FIRST");
      }

      if (unsaved.length !== 0) {
        return _react.default.createElement(_SaveButton, {
          onClick: function onClick() {
            return _this4.writeToMongo();
          },
          width: "calc(".concat(unsaved.length * 2, "% - 56px)"),
          color: color
        }, "Document ".concat(unsaved.length, " ").concat(name));
      }

      return _react.default.createElement(Text, null, "No undocumented ".concat(name));
    }
  }, {
    key: "render",
    value: function render() {
      var unsaved = this.state.unsaved;

      var _this$collector2 = this.collector(),
          name = _this$collector2.name,
          color = _this$collector2.color,
          sourcePath = _this$collector2.sourcePath;

      if (unsaved === null) {
        return _react.default.createElement(DataQPage, null, _react.default.createElement(LoadingSpinner, {
          message: "Loading ".concat(name, "..."),
          color: color
        }));
      }

      return _react.default.createElement(DataQPage, null, _react.default.createElement(_reactTooltip.default, null), _react.default.createElement(ArraySelector, {
        array: _collectors.collectors,
        parent: this,
        title: this.SaveButton({
          unsaved: unsaved,
          name: name,
          color: color
        }),
        settingsKey: "dataQSelectedIndex"
      }), sourcePath.indexOf('spotify') > -1 ? _react.default.createElement(AlbumCoverArray, {
        items: unsaved,
        parent: this
      }) : _react.default.createElement(AccountingData, {
        items: unsaved,
        parent: this,
        ordinalStart: ordinalStart
      }));
    }
  }]);

  return DataQ;
}(_react.default.Component);

var _default = DataQ;
exports.default = _default;