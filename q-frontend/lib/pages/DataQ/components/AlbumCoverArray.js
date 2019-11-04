"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n  margin: 2.5px;\n  cursor: pointer;\n  width: calc(20% - 5px);\n  :hover {\n    opacity:0.5;\n  }\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  width: 100%;\n  max-height: 100%;\n  display: flex;\n  flex-grow: 1;\n  flex-wrap: wrap;\n  align-content: stretch;\n  margin-top: 2.5px;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var AlbumCoverArrayContainer = _styledComponents.default.div(_templateObject());

var AlbumCover = _styledComponents.default.div(_templateObject2());

var AlbumCoverArray =
/*#__PURE__*/
function (_Component) {
  _inherits(AlbumCoverArray, _Component);

  function AlbumCoverArray() {
    _classCallCheck(this, AlbumCoverArray);

    return _possibleConstructorReturn(this, _getPrototypeOf(AlbumCoverArray).apply(this, arguments));
  }

  _createClass(AlbumCoverArray, [{
    key: "removeAlbum",
    value: function removeAlbum(item) {
      var parent = this.props.parent;
      parent.setState({
        unsaved: parent.state.unsaved.filter(function (listen) {
          return listen !== item;
        })
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this = this;

      var items = this.props.items;
      return _react.default.createElement(AlbumCoverArrayContainer, null, items.map(function (item) {
        return _react.default.createElement(AlbumCover, {
          key: item.played_at,
          onClick: function onClick() {
            return _this.removeAlbum(item);
          },
          "data-tip": item.track.name
        }, _react.default.createElement("img", {
          src: item.track.album.images[0].url,
          height: "100%",
          width: "100%",
          alt: item.track.album.images[0].url
        }));
      }));
    }
  }]);

  return AlbumCoverArray;
}(_react.Component);

var _default = AlbumCoverArray;
exports.default = _default;