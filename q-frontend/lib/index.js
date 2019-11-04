"use strict";

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _axios = _interopRequireDefault(require("axios"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _qLib = require("q-lib");

var _reactNotifications = require("react-notifications");

require("react-notifications/lib/notifications.css");

var _DataQ = _interopRequireDefault(require("./pages/DataQ"));

var _SpotifyQ = _interopRequireDefault(require("./pages/SpotifyQ"));

var _BassQ = _interopRequireDefault(require("./pages/BassQ"));

var _AccountingQ = _interopRequireDefault(require("./pages/AccountingQ"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _templateObject3() {
  var data = _taggedTemplateLiteral(["\n  margin: 0 10px;\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n  background-color: black;\n  font-size: 20px;\n  font-weight: bold;\n  color: white;\n  height: 50px;\n  width: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-wrap: nowrap;\n  z-index: 100;\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  height: 100%;\n  width: 100%;\n  background-color: black;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var ArraySelector = _qLib.q_components.ArraySelector;

var AppContainer = _styledComponents.default.div(_templateObject());

var AppHeader = _styledComponents.default.div(_templateObject2());

var Title = _styledComponents.default.h2(_templateObject3());

var App =
/*#__PURE__*/
function (_React$Component) {
  _inherits(App, _React$Component);

  function App(props) {
    var _this2;

    _classCallCheck(this, App);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(App).call(this, props));
    _this2.pages = [_react.default.createElement(_DataQ.default, {
      title: _react.default.createElement(Title, null, "DataQ"),
      root: _assertThisInitialized(_this2)
    }), _react.default.createElement(_SpotifyQ.default, {
      title: _react.default.createElement(Title, null, "SpotifyQ"),
      root: _assertThisInitialized(_this2)
    }), _react.default.createElement(_BassQ.default, {
      title: _react.default.createElement(Title, null, "BassQ")
    }), _react.default.createElement(_AccountingQ.default, {
      title: _react.default.createElement(Title, null, "AccountingQ")
    })];
    _this2.state = {
      selectedIndex: _qLib.q_settings.get() != null ? _qLib.q_settings.get().lastPageIndex : 2,
      error: null
    };
    return _this2;
  }

  _createClass(App, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      var _this = this;

      _axios.default.get('/mongodb/settings').then(function (res) {
        sessionStorage.setItem('settings', JSON.stringify(res.data));

        _this.setState({
          selectedIndex: res.data.lastPageIndex
        });
      });
    }
  }, {
    key: "renderPage",
    value: function renderPage() {
      var _this$state = this.state,
          error = _this$state.error,
          selectedIndex = _this$state.selectedIndex;
      return error != null ? error : this.pages[selectedIndex];
    }
  }, {
    key: "render",
    value: function render() {
      if (_qLib.q_settings.get() == null) {
        return _react.default.createElement(AppContainer, null, _react.default.createElement(AppHeader, null, _react.default.createElement("h2", null, "Loading...")));
      }

      var selectedIndex = this.state.selectedIndex;
      return _react.default.createElement(AppContainer, null, _react.default.createElement(_reactNotifications.NotificationContainer, null), _react.default.createElement(AppHeader, null, _react.default.createElement(ArraySelector, {
        array: this.pages,
        parent: this,
        title: this.pages[selectedIndex].props.title,
        settingsKey: "lastPageIndex"
      })), this.renderPage());
    }
  }]);

  return App;
}(_react.default.Component);

_reactDom.default.render(_react.default.createElement(App, null), document.getElementById('root'));