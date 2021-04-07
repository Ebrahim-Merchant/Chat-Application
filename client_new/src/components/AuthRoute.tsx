import { connect } from 'react-redux';
import { Redirect, Route } from 'react-router';
import { IAppState } from '../store/types';

const AuthRoute = (props: any) => {
	const { isAuthUser } = props;
	if (!isAuthUser) return <Redirect to='/login' />;
	return <Route {...props} />;
};

const mapStateToProps = ({ user }: IAppState) => ({
	isAuthUser: user?.id ? true : false,
});

export default connect(mapStateToProps)(AuthRoute);
