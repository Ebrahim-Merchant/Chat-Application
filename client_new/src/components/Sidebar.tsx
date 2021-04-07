import { Button } from 'antd';
import Sider from 'antd/lib/layout/Sider';
import React, { ReactElement } from 'react';
import DataList from './List';
import { EditOutlined } from '@ant-design/icons';


export default function Sidebar(props: any): ReactElement {
	const { menuItems } = props;
	return (
		<Sider
			theme='light'
			width={300}
			style={{
				overflow: 'auto',
				height: '100vh',
        position: 'fixed',
				left: 0,
			}}>
			<div className='logo' />
			<Button type="primary" icon={<EditOutlined />} size='large' />
      <DataList conversations={menuItems}></DataList>
		</Sider>
	);
}
