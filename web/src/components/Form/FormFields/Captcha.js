import React, { Component } from 'react';
import classnames from 'classnames';
import { ReCaptcha } from 'react-recaptcha-v3';
import { connect } from 'react-redux';

import { CAPTCHA_SITEKEY, DEFAULT_LANGUAGE } from '../../../config/constants';

class CaptchaField extends Component {
	state = {
		active: true,
		ready: false
	};

	componentWillReceiveProps(nextProps) {
		if (
			nextProps.input.value === '' &&
			nextProps.input.value !== this.props.input.value
		) {
			this.captcha.execute();
		}
	}

	setRef = (el) => {
		this.captcha = el;
	};

	onVerifyCallback = (data) => {
		this.props.input.onChange(data);
	};

	onExpiredCallback = () => {
		this.props.input.onChange('');
		this.captcha.execute();
	};

	render() {
		const { language, constants: { captcha = {} } } = this.props;
		const { ready, active } = this.state;
		return (
			active && (
				<div
					className={classnames('field-wrapper', 'captcha-wrapper', {
						hidden: !ready
					})}
				>
					<ReCaptcha
						ref={this.setRef}
						sitekey={captcha.site_key || CAPTCHA_SITEKEY}
						verifyCallback={this.onVerifyCallback}
						expiredCallback={this.onExpiredCallback}
						lang={language || DEFAULT_LANGUAGE}
					/>
				</div>
			)
		);
	}
}

const mapStateToProps = (state) => ({
	constants: state.app.constants
});

export default connect(mapStateToProps)(CaptchaField);
