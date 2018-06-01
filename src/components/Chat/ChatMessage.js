import React, { Component } from 'react';
import classnames from 'classnames';
import STRINGS from '../../config/localizedStrings';
import TruncateMarkup from 'react-truncate-markup';
import { ICONS } from '../../config/constants';
import { USER_TYPES } from '../../actions/appActions';
import ReactSVG from 'react-svg';
import { isMobile } from 'react-device-detect';

const MAX_LINES = 5;

const MESSAGE_OPTIONS = {
	DELETE_MESSAGE: 'Remove'
};

const ReadMore = ({ onClick }) => (
	<div className="d-inline">
		<span>...</span>
		<span className="toggle-content" onClick={onClick}>
			<span>{STRINGS.CHAT.READ_MORE}</span>
		</span>
	</div>
);

class ChatMessageWithText extends Component {
	state = {
		maxLines: MAX_LINES
	};

	showMore = () => {
		this.setState({ maxLines: 500 });
	};

	render() {
		const { username, to, messageContent, ownMessage } = this.props;
		const { maxLines } = this.state;
		return (
			<div className={classnames(!isMobile && 'd-flex', 'nonmobile')}>
				<div className="mr-1 own-message username">{`${username}:`}</div>
				{to && <div className="mr-1">{`${to}:`}</div>}
				{ownMessage ? (
					<div className="message">{messageContent}</div>
				) : (
					<TruncateMarkup
						className="d-inline message"
						lines={maxLines}
						ellipsis={<ReadMore onClick={() => this.showMore()} />}
					>
						<div className="d-inline message">{messageContent}</div>
					</TruncateMarkup>
				)}
			</div>
		);
	}
}

class ChatMessageWithImage extends Component {
	state = {
		hideImage: false
	};

	toggleImage = (condition) => {
		this.setState({ hideImage: condition });
	};

	render() {
		const { username, to, messageType, messageContent } = this.props;
		const { hideImage } = this.state;

		return (
			<div>
				<div className="d-flex flex-row">
					<div>
						<div className="d-inline username">{`${username}:`}</div>
						{to && <div className="d-inline mr-1">{`${to}:`}</div>}
					</div>
					<div
						className={classnames(hideImage ? 'hide' : 'show')}
						onClick={() => this.toggleImage(!hideImage)}
					>
						<span className="toggle-content">
							{hideImage ? STRINGS.CHAT.SHOW_IMAGE : STRINGS.CHAT.HIDE_IMAGE}
						</span>
					</div>
				</div>
				{!hideImage && (
					<img className={messageType} src={messageContent} alt="img" />
				)}
			</div>
		);
	}
}

export class ChatMessage extends Component {
	state = {
		showOptions: false
	};

	toggleOptions = () => {
		this.setState({ showOptions: !this.state.showOptions });
	};

	onClickOption = (key, id) => {
		switch (key) {
			case 'DELETE_MESSAGE':
				return this.props.removeMessage(id);
			default:
				break;
		}
	};

	render() {
		const {
			id,
			username,
			userType,
			to,
			messageType,
			messageContent,
			ownMessage
		} = this.props;
		const { showOptions } = this.state;
		const imageType = messageType === 'image';

		return (
			<div
				className={classnames(
					'd-flex',
					'flex-row',
					'chat-message',
					'justify-content-between',
					ownMessage && 'user'
				)}
			>
				<div className={classnames('message-content', messageType)}>
					{imageType ? (
						<ChatMessageWithImage
							username={username}
							to={to}
							messageContent={messageContent}
							messageType={messageType}
						/>
					) : (
						<ChatMessageWithText
							username={username}
							to={to}
							messageContent={messageContent}
							ownMessage={ownMessage}
						/>
					)}
				</div>
				{userType === USER_TYPES.USER_TYPE_ADMIN && (
					<div className="d-flex item-options" onClick={this.toggleOptions}>
						<ReactSVG
							path={ICONS.ITEM_OPTIONS}
							className="item-options-icon"
							wrapperClassName="item-options-icon-wrapper"
						/>
						{showOptions && (
							<div className="item-options-wrapper">
								{Object.entries(MESSAGE_OPTIONS).map(([key, value], index) => (
									<div
										key={index}
										className="d-flex item-option"
										onClick={() => this.onClickOption(key, id)}
									>
										{value}
									</div>
								))}
							</div>
						)}
					</div>
				)}
			</div>
		);
	}
}