import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import _ from 'lodash';
import Styled from './styles';
import ToolbarSubmenuItem from '../toolbar-submenu-item/component';

const intlMessages = defineMessages({
  toolHand: {
    id: 'app.whiteboard.toolbar.tools.hand',
    description: 'Tool submenu hand item',
  },
  toolPencil: {
    id: 'app.whiteboard.toolbar.tools.pencil',
    description: 'Tool submenu pencil annotation',
  },
  toolRectangle: {
    id: 'app.whiteboard.toolbar.tools.rectangle',
    description: 'Tool submenu rectangle annotation',
  },
  toolTriangle: {
    id: 'app.whiteboard.toolbar.tools.triangle',
    description: 'Tool submenu triangle annotation',
  },
  toolEllipse: {
    id: 'app.whiteboard.toolbar.tools.ellipse',
    description: 'Tool submenu ellipse annotation',
  },
  toolLine: {
    id: 'app.whiteboard.toolbar.tools.line',
    description: 'Tool submenu line annotation',
  },
  toolText: {
    id: 'app.whiteboard.toolbar.tools.text',
    description: 'Tool submenu text annotation',
  },
  colorBlack: {
    id: 'app.whiteboard.toolbar.color.black',
    description: 'Color submenu black color',
  },
  colorWhite: {
    id: 'app.whiteboard.toolbar.color.white',
    description: 'Color submenu white color',
  },
  colorRed: {
    id: 'app.whiteboard.toolbar.color.red',
    description: 'Color submenu red color',
  },
  colorOrange: {
    id: 'app.whiteboard.toolbar.color.orange',
    description: 'Color submenu orange color',
  },
  colorEletricLime: {
    id: 'app.whiteboard.toolbar.color.eletricLime',
    description: 'Color submenu eletric lime color',
  },
  colorLime: {
    id: 'app.whiteboard.toolbar.color.lime',
    description: 'Color submenu lime color',
  },
  colorCyan: {
    id: 'app.whiteboard.toolbar.color.cyan',
    description: 'Color submenu cyan color',
  },
  colorDodgerBlue: {
    id: 'app.whiteboard.toolbar.color.dodgerBlue',
    description: 'Color submenu dodger blue color',
  },
  colorBlue: {
    id: 'app.whiteboard.toolbar.color.blue',
    description: 'Color submenu blue color',
  },
  colorViolet: {
    id: 'app.whiteboard.toolbar.color.violet',
    description: 'Color submenu violet color',
  },
  colorMagenta: {
    id: 'app.whiteboard.toolbar.color.magenta',
    description: 'Color submenu magenta color',
  },
  colorSilver: {
    id: 'app.whiteboard.toolbar.color.silver',
    description: 'Color submenu silver color',
  },
});

class ToolbarSubmenu extends Component {
  static getCustomIcon(type, obj) {
    if (type === 'color') {
      return (
        <Styled.CustomSvgIcon>
          <rect x="20%" y="20%" width="60%" height="60%" fill={obj.value} id="colorPicker"/>
        </Styled.CustomSvgIcon>
      );
    } if (type === 'thickness') {
      return (
        <Styled.CustomSvgIcon>
          <circle cx="50%" cy="50%" r={obj.value} />
        </Styled.CustomSvgIcon>
      );
    } if (type === 'font-size') {
      return (
        <Styled.TextThickness style={{ fontSize: obj.value <= 32 ? obj.value : 32 }}>
          Aa
        </Styled.TextThickness>
      );
    }

    return null;
  }

  constructor() {
    super();

    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.onItemClick = this.onItemClick.bind(this);
    this.findCurrentElement = this.findCurrentElement.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleMouseDown);
    document.addEventListener('touchstart', this.handleMouseDown);
    const { handleMouseEnter, objectSelected, type } = this.props;

    if (handleMouseEnter) {
      handleMouseEnter();

      if (type === 'annotations') {
        this.submenuItems.childNodes.forEach((element) => {
          const node = this.findCurrentElement(element.childNodes[0]);
          const classname = node.getAttribute('class');
          if (classname) {
            const name = classname.split('-');
            if (name[name.length - 1] === objectSelected.icon) {
              element.firstChild.focus();
            }
          }
        });
      }

      if (type === 'thickness') {
        this.submenuItems.childNodes.forEach((element) => {
          const node = this.findCurrentElement(element.childNodes[0]);
          const radius = node.getAttribute('r');
          if (radius === objectSelected.value.toString()) {
            element.firstChild.focus();
          }
        });
      }

      if (type === 'color') {
        this.submenuItems.childNodes.forEach((element) => {
          const node = this.findCurrentElement(element.childNodes[0]);
          const fill = node.getAttribute('fill');
          if (fill === objectSelected.value) {
            element.firstChild.focus();
          }
        });
      }
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleMouseDown);
    document.removeEventListener('touchstart', this.handleMouseDown);
  }

  onItemClick(objectToReturn) {
    const { onItemClick } = this.props;

    if (onItemClick) {
      onItemClick(objectToReturn);
    }
  }

  findCurrentElement(node) {
    if (node.nodeName === 'BUTTON') return this.findCurrentElement(node.childNodes[0]);
    if (node.nodeName === 'svg') return node.firstChild;
    return node;
  }

  handleMouseDown(e) {
    const { handleClose } = this.props;
    if (e.path === undefined) return false;
    for (let i = 0; i < e.path.length; i += 1) {
      const p = e.path[i];
      if (p && p.className && typeof p.className === 'string') {
        if (p.className.search('tool') !== -1) {
          return false;
        }
      }
    }
    return handleClose();
  }

  handleMouseEnter() {
    const { handleMouseEnter } = this.props;
    if (handleMouseEnter) {
      handleMouseEnter();
    }
  }

  handleMouseLeave() {
    const { handleMouseLeave } = this.props;
    if (handleMouseLeave) {
      handleMouseLeave();
    }
  }

  formatSubmenuLabel(type, obj) {
    const { intl } = this.props;

    if (type === 'annotations') {
      const intlLabel = `tool${_.upperFirst(obj.value)}`;
      return intl.formatMessage(intlMessages[intlLabel]);
    }

    if (type === 'color') {
      const intlLabel = `color${_.upperFirst(obj.label)}`;
      return intl.formatMessage(intlMessages[intlLabel]);
    }

    if (type === 'thickness' || type === 'font-size') {
      return obj.value.toString();
    }

    return '';
  }

  render() {
    const {
      type,
      objectsToRender,
      objectSelected,
      customIcon,
    } = this.props;

    return (
      <Styled.Wrapper
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        type={type}
        ref={(node) => { this.submenuItems = node; }}
        data-test="toolbarToolsList"
      >
        {objectsToRender ? objectsToRender.map(obj => (
          <ToolbarSubmenuItem
            label={this.formatSubmenuLabel(type, obj)}
            icon={!customIcon ? obj.icon : null}
            customIcon={customIcon ? ToolbarSubmenu.getCustomIcon(type, obj) : null}
            onItemClick={this.onItemClick}
            objectToReturn={obj}
            toolbarActive={objectSelected.value === obj.value}
            key={obj.value}
            data-test={`${obj.value}Tool`}
          />
        )) : null}
      </Styled.Wrapper>
    );
  }
}

ToolbarSubmenu.propTypes = {
  onItemClick: PropTypes.func.isRequired,
  handleMouseEnter: PropTypes.func.isRequired,
  handleMouseLeave: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  objectsToRender: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.shape({
      value: PropTypes.string.isRequired,
    }),
    PropTypes.shape({
      value: PropTypes.number.isRequired,
    }),
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
    }),
  ]).isRequired).isRequired,
  objectSelected: PropTypes.oneOfType([
    PropTypes.shape({
      value: PropTypes.string.isRequired,
    }),
    PropTypes.shape({
      value: PropTypes.number.isRequired,
    }),
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
    }),
  ]).isRequired,
  customIcon: PropTypes.bool.isRequired,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(ToolbarSubmenu);
