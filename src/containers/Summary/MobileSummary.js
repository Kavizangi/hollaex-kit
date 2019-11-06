import React, { Fragment } from 'react';
import classnames from 'classnames';
import moment from 'moment';

import SummaryBlock from './components/SummaryBlock';
import TraderAccounts from './components/TraderAccounts';
import SummaryRequirements from './components/SummaryRequirements';
import AccountAssets from './components/AccountAssets';
import TradingVolume from './components/TradingVolume';
import AccountDetails from './components/AccountDetails';

import { BASE_CURRENCY, DEFAULT_COIN_DATA, SHOW_SUMMARY_ACCOUNT_DETAILS } from '../../config/constants';
import { formatAverage, formatBaseAmount } from '../../utils/currency';
import STRINGS from '../../config/localizedStrings';

const MobileSummary = ({
	user,
	pairs,
	coins,
	config,
	activeTheme,
	selectedAccount,
	balance,
	chartData,
	logout,
	totalAssets,
	isValidBase,
	lastMonthVolume,
	traderAccTitle,
	onFeesAndLimits,
	onUpgradeAccount,
	onAccountTypeChange,
	onInviteFriends,
	verification_level,
	onStakeToken
}) => {
	const { fullname } = coins[BASE_CURRENCY] || DEFAULT_COIN_DATA;
	// const Title = STRINGS.formatString(STRINGS.SUMMARY.LEVEL_OF_ACCOUNT,verification_level);
	return (
		<div
			className={classnames(
				'flex-column',
				'd-flex',
				'justify-content-between',
				'f-1',
				'apply_rtl'
			)}
		>
			<div className="summary-section_1 trader-account-wrapper d-flex w-100">
				<SummaryBlock title={traderAccTitle} wrapperClassname="w-100" >
					<TraderAccounts
						user={user}
						coins={coins}
						pairs={pairs}
						logout={logout}
						activeTheme={activeTheme}
						onInviteFriends={onInviteFriends}
						onFeesAndLimits={onFeesAndLimits}
						onUpgradeAccount={onUpgradeAccount}
						verification_level={verification_level}
						onStakeToken={onStakeToken} />
				</SummaryBlock>
			</div>
			<div className="summary-section_1 requirement-wrapper d-flex w-100">
				<SummaryBlock
					title={STRINGS.SUMMARY.URGENT_REQUIREMENTS}
					wrapperClassname="w-100" >
					<SummaryRequirements
						coins={coins}
						user={user}
						lastMonthVolume={lastMonthVolume}
						contentClassName="requirements-content" />
				</SummaryBlock>
			</div>
			<div className="assets-wrapper w-100">
				<SummaryBlock
					title={STRINGS.SUMMARY.ACCOUNT_ASSETS}
					secondaryTitle={
						BASE_CURRENCY && isValidBase ?
							<span>
								<span className="title-font">
									{totalAssets}
								</span>
								{` ${fullname}`}
							</span>
							: null
					} >
					<AccountAssets
						user={user}
						chartData={chartData}
						totalAssets={totalAssets}
						balance={balance}
						coins={coins}
						activeTheme={activeTheme} />
				</SummaryBlock>
			</div>
			{SHOW_SUMMARY_ACCOUNT_DETAILS
				? <Fragment>
					<div className="trading-volume-wrapper w-100">
						<SummaryBlock
							title={STRINGS.SUMMARY.TRADING_VOLUME}
							secondaryTitle={<span>
								<span className="title-font">
									{` ${formatAverage(formatBaseAmount(lastMonthVolume))}`}
								</span>
								{` ${fullname} ${STRINGS.formatString(
									STRINGS.SUMMARY.NOMINAL_TRADING_WITH_MONTH,
									moment().subtract(1, "month").startOf("month").format('MMMM')
								).join('')}`}
							</span>
							} >
							<TradingVolume user={user} />
						</SummaryBlock>
					</div>
					<SummaryBlock
						title={STRINGS.SUMMARY.ACCOUNT_DETAILS}
						secondaryTitle={traderAccTitle}
						wrapperClassname="w-100" >
						<AccountDetails
							coins={coins}
							config={config}
							pairs={pairs}
							user={user}
							activeTheme={activeTheme}
							selectedAccount={selectedAccount}
							onAccountTypeChange={onAccountTypeChange}
							onFeesAndLimits={onFeesAndLimits}
							verification_level={verification_level} />
					</SummaryBlock>
				</Fragment>
				: null
			}
		</div>
	);
};

export default MobileSummary;