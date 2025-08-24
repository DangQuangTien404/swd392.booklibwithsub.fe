import { useState, useContext } from 'react';
import { fetchSubscriptionStatus, purchaseSubscription } from '../api/subscriptions';
import { UserContext } from '../context/UserContext';

const useSubscriptionHandler = () => {
  const { user } = useContext(UserContext);
  const [subscriptionPrompt, setSubscriptionPrompt] = useState({ visible: false, plan: null });
  const [modalInfo, setModalInfo] = useState({ visible: false, title: '', content: '' });

  const handleSubscription = (plan) => {
    if (!user) {
      setModalInfo({
        visible: true,
        title: 'Login Required',
        content: 'You must be logged in to subscribe to a plan.',
      });
      return;
    }

    setSubscriptionPrompt({ visible: true, plan });
  };

  const handleSubscriptionConfirm = async () => {
    const plan = subscriptionPrompt.plan;
    setSubscriptionPrompt({ visible: false, plan: null });

    try {
      const subscriptionStatus = await fetchSubscriptionStatus();

      if (subscriptionStatus?.endDate && new Date(subscriptionStatus.endDate) > new Date()) {
        setModalInfo({
          visible: true,
          title: 'Active Subscription Found',
          content: 'You already have an active subscription. Please wait until it expires before purchasing a new one.',
        });
        return;
      }

      const response = await purchaseSubscription(plan.subscriptionPlanID);

      if (response?.order?.order_url) {
        window.location.href = response.order.order_url;
      } else {
        setModalInfo({
          visible: true,
          title: 'Subscription Successful',
          content: `You have successfully subscribed to the ${plan.planName} plan!`,
        });
      }
    } catch (error) {
      setModalInfo({
        visible: true,
        title: 'Subscription Failed',
        content: 'An error occurred while processing your subscription. Please try again later.',
      });
    }
  };

  const handleSubscriptionCancel = () => {
    setSubscriptionPrompt({ visible: false, plan: null });
  };

  return {
    subscriptionPrompt,
    modalInfo,
    handleSubscription,
    handleSubscriptionConfirm,
    handleSubscriptionCancel,
    setModalInfo,
  };
};

export default useSubscriptionHandler;
