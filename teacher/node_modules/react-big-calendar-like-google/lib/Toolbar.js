'use strict';

exports.__esModule = true;

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _constants = require('./utils/constants');

var _materialUi = require('material-ui');

var _menu = require('material-ui/svg-icons/navigation/menu');

var _menu2 = _interopRequireDefault(_menu);

var _keyboardArrowLeft = require('material-ui/svg-icons/hardware/keyboard-arrow-left');

var _keyboardArrowLeft2 = _interopRequireDefault(_keyboardArrowLeft);

var _keyboardArrowRight = require('material-ui/svg-icons/hardware/keyboard-arrow-right');

var _keyboardArrowRight2 = _interopRequireDefault(_keyboardArrowRight);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Toolbar = function (_React$Component) {
  _inherits(Toolbar, _React$Component);

  function Toolbar() {
    var _temp, _this, _ret;

    _classCallCheck(this, Toolbar);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.navigate = function (action) {
      _this.props.onNavigate(action);
    }, _this.view = function (event, index, view) {
      _this.props.onViewChange(view);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  Toolbar.prototype.render = function render() {
    var _props = this.props,
        messages = _props.messages,
        label = _props.label;

    // edited by onursimsek94 (button to div)

    return _react2.default.createElement(
      'div',
      { className: 'rbc-toolbar' },
      _react2.default.createElement(
        _materialUi.MuiThemeProvider,
        null,
        _react2.default.createElement(
          'div',
          { className: 'rbc-btn-group' },
          _react2.default.createElement(
            'div',
            { onClick: this.props.onLeftMenu, style: { display: this.props.onLeftMenu ? 'inherit' : 'none' } },
            _react2.default.createElement(
              _materialUi.FloatingActionButton,
              {
                mini: true,
                style: { boxShadow: 'none' },
                backgroundColor: 'none',
                iconStyle: { color: 'rgb(117, 117, 117)', fill: 'rgb(117, 117, 117)' } },
              _react2.default.createElement(_menu2.default, null)
            ),
            '\xA0'
          ),
          _react2.default.createElement(
            'div',
            { onClick: this.navigate.bind(null, _constants.navigate.TODAY) },
            _react2.default.createElement(_materialUi.RaisedButton, {
              label: messages.today,
              style: { boxShadow: 'none', borderRadius: '5px' },
              buttonStyle: { backgroundColor: 'rgb(245, 245, 245)', width: '90%', borderRadius: '5px' },
              labelStyle: { color: 'rgb(74, 74, 74)' } }),
            '\xA0'
          ),
          _react2.default.createElement(
            'div',
            { onClick: this.navigate.bind(null, _constants.navigate.PREVIOUS) },
            _react2.default.createElement(
              _materialUi.FloatingActionButton,
              {
                mini: true,
                style: { boxShadow: 'none' },
                backgroundColor: 'none',
                iconStyle: { color: 'rgb(117, 117, 117)', fill: 'rgb(117, 117, 117)' } },
              _react2.default.createElement(_keyboardArrowLeft2.default, null)
            ),
            '\xA0'
          ),
          _react2.default.createElement(
            'div',
            { onClick: this.navigate.bind(null, _constants.navigate.NEXT) },
            _react2.default.createElement(
              _materialUi.FloatingActionButton,
              {
                mini: true,
                style: { boxShadow: 'none' },
                backgroundColor: 'none',
                iconStyle: { color: 'rgb(117, 117, 117)', fill: 'rgb(117, 117, 117)' } },
              _react2.default.createElement(_keyboardArrowRight2.default, null)
            )
          )
        )
      ),
      _react2.default.createElement(
        'span',
        { className: 'rbc-toolbar-label' },
        label
      ),
      _react2.default.createElement(
        'span',
        { className: 'rbc-btn-group' },
        this.viewNamesGroup(messages)
      )
    );
  };

  // edited by onursimsek94
  Toolbar.prototype.viewNamesGroup = function viewNamesGroup(messages) {
    var _this2 = this;

    var viewNames = this.props.views;
    var view = this.props.view;

    if (viewNames.length > 1) {
      return _react2.default.createElement(
        _materialUi.MuiThemeProvider,
        null,
        _react2.default.createElement(
          _materialUi.DropDownMenu,
          {
            value: this.props.view,
            onChange: function onChange(event, index, value) {
              return _this2.props.onViewChange(value);
            }
          },
          viewNames.map(function (name) {
            return _react2.default.createElement(_materialUi.MenuItem, {
              key: name,
              value: name,
              primaryText: messages[name]
            });
          })
        )
      )
      // viewNames.map(name =>
      //   <button type='button' key={name}
      //     className={cn({'rbc-active': view === name})}
      //     onClick={this.view.bind(null, name)}
      //   >
      //     {messages[name]}
      //   </button>
      // )
      ;
    }
  };

  return Toolbar;
}(_react2.default.Component);

Toolbar.propTypes = {
  view: _propTypes2.default.string.isRequired,
  views: _propTypes2.default.arrayOf(_propTypes2.default.string).isRequired,
  label: _propTypes2.default.node.isRequired,
  messages: _propTypes2.default.object,
  onLeftMenu: _propTypes2.default.func,
  onNavigate: _propTypes2.default.func.isRequired,
  onViewChange: _propTypes2.default.func.isRequired
};
exports.default = Toolbar;
module.exports = exports['default'];