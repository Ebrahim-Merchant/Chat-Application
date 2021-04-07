import React, { ReactElement } from 'react';
import { Header } from 'antd/lib/layout/layout';
import { connect } from 'react-redux';
import { IAppState, IUser } from '../store/types';
import { getUsername } from '../services/utils';

interface Props {
	user: IUser;
}

function AppHeader({ user }: Props): ReactElement {
	const clientName = getUsername(user) ?? 'Please select a user';
	return <Header style={{ color: 'white' }}>{clientName}</Header>;
}

const mapStateToProps = ({ currentRecipient }: IAppState) => ({
	user: currentRecipient,
});
export default connect(mapStateToProps)(AppHeader);
