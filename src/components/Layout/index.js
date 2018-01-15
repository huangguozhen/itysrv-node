import React from 'react'
import { Layout, Icon } from 'antd'
import Sider from '../Sider'
import './index.less'

export default class CoreLayout extends React.Component {
  state = { collapsed: false };

  handleToggle = () => {
    const { collapsed } = this.state
    this.setState({ collapsed: !collapsed })
  }

  render () {
    const { children, location: { pathname } } = this.props
    const { collapsed } = this.state

    return (<Layout style={{ height: '100vh' }}>
      <Layout.Sider trigger={null} collapsible collapsed={collapsed}>
        <div className='sider-logo'>
          <img alt='logo' src={require('../../assets/img/logo.png')} />
          <span>Demo</span>
        </div>
        <Sider theme='dark' mode='inline' defaultSelectedKeys={[ pathname ]} />
      </Layout.Sider>
      <Layout>
        <Layout.Header style={{ padding: '0 8px 0 0' }}>
          <div className='header-nav toggle-btn' onClick={this.handleToggle}>
            <Icon className='trigger' type={collapsed ? 'menu-unfold' : 'menu-fold'} />
          </div>
        </Layout.Header>
        <Layout.Content style={{ margin: 24 }}>
          {children}
        </Layout.Content>
        {/* <Layout.Footer>深圳市摩仑科技有限公司 copyright@2014 - 2018</Layout.Footer> */}
      </Layout>
    </Layout>)
  }
}
