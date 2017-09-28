import React, { Component} from 'react';
import { connect } from 'react-redux';
import { TabController, CheckTitle } from '../../components';
import { UserVerification, UserSecurity } from '../';

class Account extends Component {
  state = {
    activeTab: -1,
    tabs: [],
  }

  componentDidMount() {
    if (this.props.id) {
      this.updateTabs(this.props);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.id !== this.props.id ||
      nextProps.verification_level !== this.props.verification_level ||
      nextProps.otp_enabled !== this.props.otp_enabled
    ) {
      this.updateTabs(nextProps);
    }
  }

  hasUserVerificationNotifications = (verification_level, bank_name) => {
    if (verification_level >= 2) {
      return false
    } else if (bank_name) {
      return false;
    }
    return true;
  }
  updateTabs = ({ verification_level, otp_enabled, bank_name }) => {
    console.log(verification_level, otp_enabled)
    const activeTab = this.state.activeTab > -1 ? this.state.activeTab : 0;
    const tabs = [
      {
        title: (
          <CheckTitle
            title="Verification"
            icon={`${process.env.PUBLIC_URL}/assets/acounts/account-icons-02.png`}
            notifications={this.hasUserVerificationNotifications(verification_level, bank_name) ? '!' : ''}
          />
        ),
        content: <UserVerification />
      },
      {
        title: (
          <CheckTitle
            title="Security"
            icon={`${process.env.PUBLIC_URL}/assets/acounts/account-icons-03.png`}
            notifications={!otp_enabled ? '!' : ''}
          />
        ),
        content: (
          <UserSecurity />
        )
      },
      {
        title: (
          <CheckTitle
            title="Notifications"
            icon={`${process.env.PUBLIC_URL}/assets/acounts/account-icons-04.png`}
          />
        ),
        content: (
          <div>Notifications</div>
        )
      },
    ];

    this.setState({ tabs, activeTab });
  }

  setActiveTab = (activeTab) => {
    this.setState({ activeTab });
  }

  renderContent = (tabs, activeTab) => tabs[activeTab].content;

  render() {
    const { id } = this.props;

    if (!id) {
      return <div>Loading</div>;
    }

    const { activeTab, tabs } = this.state;

    return (
      <div className="presentation_container">
        <TabController
          activeTab={activeTab}
          setActiveTab={this.setActiveTab}
          tabs={tabs}
          title="Account"
          titleIcon={`${process.env.PUBLIC_URL}/assets/acounts/account-icons-01.png`}
        />
        <div className="inner_container">{activeTab > -1 && this.renderContent(tabs, activeTab)}</div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  verification_level: state.user.verification_level,
  otp_enabled: state.user.otp_enabled || false,
  id: state.user.id,
  bank_name: state.user.bank_name,
});

export default connect(mapStateToProps)(Account);
