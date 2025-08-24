import React from 'react';
import { Typography, Button } from 'antd';
import PropTypes from 'prop-types';
import '../styles/SubscriptionPlanCard.css';

const { Paragraph } = Typography;

function SubscriptionPlanCard({ plan, onSubscribe }) {
  return (
    <div className="subscription-card">
      <h3>{plan.planName}</h3>
      <Paragraph className="subscription-price">${plan.price}/plan</Paragraph>
      <Paragraph className="subscription-description">
        Duration: {plan.durationDays} days<br />
        Max/Day: {plan.maxPerDay}<br />
        Max/Month: {plan.maxPerMonth}
      </Paragraph>
      <Button
        type="primary"
        onClick={() => onSubscribe(plan)}
        className="subscribe-btn"
      >
        Subscribe
      </Button>
    </div>
  );
}

SubscriptionPlanCard.propTypes = {
  plan: PropTypes.object.isRequired,
  onSubscribe: PropTypes.func.isRequired,
};

export default SubscriptionPlanCard;