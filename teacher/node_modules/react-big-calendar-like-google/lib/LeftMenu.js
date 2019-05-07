'use strict';

exports.__esModule = true;

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _materialUi = require('material-ui');

var _close = require('material-ui/svg-icons/navigation/close');

var _close2 = _interopRequireDefault(_close);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LeftMenu = function (_React$Component) {
  _inherits(LeftMenu, _React$Component);

  function LeftMenu(props) {
    _classCallCheck(this, LeftMenu);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _this.state = { data: props.data };
    return _this;
  }

  LeftMenu.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    if (nextProps.open) {
      this.setState({ data: nextProps.data });
    }
  };

  LeftMenu.prototype.itemVisibilityChanged = function itemVisibilityChanged(mainId, subId) {
    var data = this.state.data;

    data.find(function (mainItem) {
      if (mainItem.id === mainId) {
        mainItem.data.find(function (subItem) {
          if (subItem.id === subId) {
            subItem.visible = !subItem.visible;
            return true;
          }
        });
        return true;
      }
    });

    this.props.onItemVisibilityChange(data);
  };

  LeftMenu.prototype.render = function render() {
    var _this2 = this;

    return _react2.default.createElement(
      _materialUi.MuiThemeProvider,
      null,
      _react2.default.createElement(
        _materialUi.Drawer,
        {
          open: this.props.open,
          docked: false,
          onRequestChange: function onRequestChange(open) {
            _this2.setState({ open: open });
          } },
        _react2.default.createElement(
          _materialUi.FloatingActionButton,
          {
            mini: true,
            style: { position: 'relative', float: 'right', marginTop: '5px', marginRight: '5px', boxShadow: 'none' },
            backgroundColor: 'none',
            iconStyle: { color: 'rgb(117, 117, 117)', fill: 'rgb(117, 117, 117)' },
            onClick: this.props.onClose },
          _react2.default.createElement(_close2.default, null)
        ),
        _react2.default.createElement(
          _materialUi.List,
          { style: { marginTop: '25px' } },
          this.state.data.map(function (data, idx) {
            return _react2.default.createElement(
              'div',
              { key: 'div-' + data.id },
              _react2.default.createElement(
                'span',
                {
                  key: 'span-' + data.id,
                  style: { marginLeft: '15px', color: 'rgb(117, 117, 117)' } },
                data.title
              ),
              _react2.default.createElement('hr', {
                key: 'hr-' + data.id,
                style: { marginTop: '4px' } }),
              data.data.map(function (item) {
                return _react2.default.createElement(_materialUi.ListItem, {
                  key: item.id,
                  primaryText: item.name,
                  style: { marginTop: '-8px', padding: '8px 8px 8px 72px', fontWeight: '300', fontSize: '14px', color: 'rgb(33, 33, 33)' },
                  leftCheckbox: _react2.default.createElement(_materialUi.Checkbox, {
                    key: 'checkbox-' + item.id,
                    style: { top: '3px' },
                    checked: item.visible,
                    onCheck: function onCheck() {
                      _this2.itemVisibilityChanged(data.id, item.id);
                    },
                    iconStyle: { color: '' + item.color, fill: '' + item.color } })
                });
              })
            );
          })
        )
      )
    );
  };

  return LeftMenu;
}(_react2.default.Component);

LeftMenu.propTypes = {
  open: _propTypes2.default.bool.isRequired,
  data: _propTypes2.default.arrayOf(_propTypes2.default.object),
  onItemVisibilityChange: _propTypes2.default.func,
  onClose: _propTypes2.default.func.isRequired
};
LeftMenu.defaultProps = {
  open: true,
  data: []
};
exports.default = LeftMenu;
module.exports = exports['default'];