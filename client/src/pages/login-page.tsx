import React, { Component, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import CloseIcon from '@material-ui/icons/Close';
import { registerUser, authenitcateUser } from 'shared/api';
import { withRouter } from 'react-router'
import { AuthGaurd } from 'shared/authentication';

const styles = () => ({
	root: {
		display: 'flex',
		height: 'inherit',
		alignItems: 'center',
		justifyContent: 'center',
		background: 'lightblue',
	},
	card: {
		width: 500,
		margin: 16,
	},
	bullet: {
		display: 'inline-block',
		margin: '0 2px',
		transform: 'scale(0.8)',
	},
	title: {
		fontSize: 14,
	},
	pos: {
		marginBottom: 12,
	},
	registerButton: {
		padding: '1rem 0',
	},
	loginButton: {
		padding: '1rem 0',
	},
});

class LoginPage extends Component<any, any> {

	state = {
		showRegister: false,
		registrationError: false,
		loginError: false
	};

	constructor(props) {
		super(props);
		this.toggleRegistration = this.toggleRegistration.bind(this);
		this.registerUser = this.registerUser.bind(this);
		this.loginUser = this.loginUser.bind(this);

	}

	toggleRegistration() {
		this.setState((state) => ({ showRegister: !state.showRegister }));
	}

	registerUser(firstName, lastName, email, password) {
		registerUser(firstName, lastName, email, password)
		.then((userId) => {
			AuthGaurd.authenticate(userId);
			this.props.history.push('/');
		})
		.catch((err) => {
			this.setState({registrationError: true})
		})
	}

	loginUser(email, password) {
		authenitcateUser(email, password)
		.then((userId) => {
			AuthGaurd.authenticate(userId) ;
			this.props.history.push('/');
		})
		.catch((err) => {
			this.setState({loginError: true})
		})
	}
	render() {
		const { classes } = this.props;
		const { showRegister, loginError, registrationError } = this.state;
		if (!showRegister) {
			return (
				<div className={classes.root}>
					<LoginCard
						error={loginError}
						loginUser={this.loginUser}
						toggleRegistration={this.toggleRegistration}
						classes={classes}></LoginCard>
				</div>
			);
		} else {
			return (
				<div className={classes.root}>
					<RegisterCard 
					error={registrationError}
					registerUser={this.registerUser}
					toggleRegistration={this.toggleRegistration}
					classes={classes}></RegisterCard>
				</div>
			);
		}
	}
}

export default withRouter(withStyles(styles)(LoginPage));

function LoginCard(props) {
	const { classes, toggleRegistration, loginUser, error } = props;
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	return (
		<Card className={classes.card}>
			<CardContent>
				<Typography gutterBottom variant='h5' component='h2' align='center'>
					Login
				</Typography>
				{ error ? <Typography align='center' color="error">
						Username and password are incorrect
				</Typography> : <span></span>}
				<TextField
					label='Email'
					type='email'
					name='email'
					fullWidth
					margin='normal'
					onChange={(event) => setEmail(event.target.value)}
					variant='outlined'
				/>
				<TextField
					label='Password'
					type='password'
					name='password'
					fullWidth
					margin='normal'
					onChange={(event) => setPassword(event.target.value)}
					variant='outlined'
				/>
				<Button
					className={classes.registerButton}
					onClick={() => toggleRegistration()}>
					Don't have an account? Register now
				</Button>
				<Button
					className={classes.loginButton}
					fullWidth
					variant='contained'
					onClick={() => loginUser(email, password)}
					color='primary'>
					Login
				</Button>
			</CardContent>
		</Card>
	);
}

function RegisterCard(props) {

	const { classes, toggleRegistration, registerUser } = props;
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [passwordError, setPasswordError] = useState(false);

	return (
		<Card className={classes.card}>
			<CardContent>
				<div style={{display: 'flex'}}>
				<CloseIcon onClick={() => toggleRegistration()}>
			</CloseIcon>
				<Typography gutterBottom variant='h5' component='h2' align='center'>
					Register
				</Typography>
				</div>
				<TextField
					label='First Name'
					type='text'
					name='fname'
					fullWidth
					margin='normal'
					onChange={(event) => setFirstName(event.target.value)}
					variant='outlined'
				/>
				<TextField
					label='Last Name'
					type='text'
					name='lname'
					fullWidth
					margin='normal'
					onChange={(event) => setLastName(event.target.value)}
					variant='outlined'
				/>
				<TextField
					label='Email'
					type='email'
					name='email'
					fullWidth
					margin='normal'
					onChange={(event) => setEmail(event.target.value)}
					variant='outlined'
				/>
				<TextField
					label='Password'
					type='password'
					name='password'
					fullWidth
					margin='normal'
					onChange={(event) => setPassword(event.target.value)}
					variant='outlined'
				/>
				<TextField
					error={passwordError}
					label='Repeat Password'
					type='password'
					name='password'
					fullWidth
					margin='normal'
					helperText={ passwordError ? "Password's don't match" : ''}
					onChange={(event) => event.target.value === password ? setPasswordError(false) : setPasswordError(true)}
					variant='outlined'
				/>
				<Button
					className={classes.loginButton}
					fullWidth
					onClick={() => passwordError ? '' : registerUser(firstName, lastName, email, password)}
					variant='contained'
					color='primary'>
					Register
				</Button>
			</CardContent>
		</Card>
	);
}