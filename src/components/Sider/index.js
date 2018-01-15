import React from 'react'
import { Link } from 'react-router'
import { Menu, Icon } from 'antd'

const MenuTitle = ({ icon, title, link }) => link ? (
  <Link to={link.href} target={link.target}>
    {icon ? <Icon type={icon} /> : null}<span>{title}</span>
  </Link>
) : (<span>
  {icon ? <Icon type={icon} /> : null}<span>{title}</span>
</span>)

function renderMenu (menus) {
  return menus.map((menu, index) => {
    if (menu.children && menu.children.length > 0) {
      return (<Menu.SubMenu key={menu.key} title={<MenuTitle {...menu} />}>
        {renderMenu(menu.children)}
      </Menu.SubMenu>)
    }

    return (<Menu.Item key={menu.key}>
      <MenuTitle {...menu} />
    </Menu.Item>)
  })
}

export default class Sider extends React.Component {
  render () {
    let menus = require('./data')

    return (<Menu {...this.props}>{renderMenu(menus)}</Menu>)
  }
}
