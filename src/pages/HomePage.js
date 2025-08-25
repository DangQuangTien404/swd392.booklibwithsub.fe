import React, { useContext, useState, useEffect } from 'react';
import { Layout, Modal, Button, message } from 'antd';
import { Link } from 'react-router-dom';

import Header from '../components/Header';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import Features from '../components/Features';
import SubscriptionPlanCard from '../components/SubscriptionPlanCard';
import FeaturedBooksSection from '../components/FeaturedBooksSection';
import useHomePageData from '../hooks/useHomePageData';
import useSubscriptionHandler from '../hooks/useSubscriptionHandler';
import { UserContext } from '../context/UserContext';
import { borrowBook, addBooksToLoan } from '../api/loans'; 

import '../styles/HomePage.css';

const { Content } = Layout;

function HomePage() {
  const { user, subscriptionStatus, basket, setBasket } = useContext(UserContext); 
  const { books, plans } = useHomePageData();
  const {
    subscriptionPrompt,
    modalInfo,
    handleSubscription,
    handleSubscriptionConfirm,
    handleSubscriptionCancel,
    setModalInfo,
  } = useSubscriptionHandler();

  const [borrowModal, setBorrowModal] = useState({ visible: false, book: null });
  const [loginPrompt, setLoginPrompt] = useState({ visible: false });

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowDown') {
        window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleBorrowClick = (book) => {
    const storedUser = localStorage.getItem('user');
    if (!user && !storedUser) {
      setLoginPrompt({ visible: true, content: "You have to login first." });
      return;
    }
    setBorrowModal({ visible: true, book });
  };

  const handleBorrowConfirm = async () => {
    const book = borrowModal.book;
    setBorrowModal({ visible: false, book: null });
const requestPayload = {
    subscriptionId: subscriptionStatus.subscriptionId,
    bookIds: [book.id],
  };

  console.log("BorrowBook API Request:", requestPayload);


    try {
      await borrowBook(subscriptionStatus.subscriptionId, book.id);
      setModalInfo({ visible: true, title: 'Borrow Successful', content: `You have borrowed "${book.title}"!` });
    } catch (error) {
      setModalInfo({ visible: true, title: 'Borrow Failed', content: 'There was a problem borrowing this book. Please try again.' });
    }
  };

  const addToBasket = (book) => {
    if (!basket.some((b) => b.id === book.id)) {
      setBasket([...basket, book]);
      message.success(`${book.title} added to basket.`);
    } else {
      message.info(`${book.title} is already in the basket.`);
    }
  };

  const borrowFromBasket = async () => {
    if (basket.length === 0) {
      message.warning('Your basket is empty.');
      return;
    }
    try {
      const bookIds = basket.map((book) => book.id);
      await addBooksToLoan(subscriptionStatus.subscriptionId, bookIds);
      message.success('All books in the basket have been borrowed successfully.');
      setBasket([]); 
    } catch (error) {
      message.error('Failed to borrow books from the basket. Please try again.');
    }
  };

  return (
    <div className="App">
      <Layout>
        <div className="sticky-header-wrapper">
          <Header className="sticky-header" />
        </div>
        <Content style={{ padding: '2rem' }}>
          <HeroSection />
          <Features />

          <section className="subscription-plans">
          <h2 className="section-title">Subscription Plans</h2>
          <div className="subscription-cards-row">
            {plans.map((plan) => (
              <SubscriptionPlanCard
                key={plan.subscriptionPlanID}
                plan={plan}
                onSubscribe={handleSubscription}
              />
            ))}
          </div>
          </section>

      
          <FeaturedBooksSection
            books={books}
            onBorrow={handleBorrowClick}
            onAddToBasket={addToBasket}
            onBorrowAll={borrowFromBasket}
            basketCount={basket.length}
          />

        
          <Modal
            open={borrowModal.visible}
            title="Do you want to borrow this book?"
            onOk={handleBorrowConfirm}
            onCancel={() => setBorrowModal({ visible: false, book: null })}
            okText="Yes"
            cancelText="No"
          >
            {borrowModal.book && (
              <div>
                <strong>{borrowModal.book.title}</strong>
              </div>
            )}
          </Modal>
          <Modal
            open={modalInfo.visible}
            title={modalInfo.title}
            onOk={() => setModalInfo({ visible: false, title: '', content: '' })}
            onCancel={() => setModalInfo({ visible: false, title: '', content: '' })}
            footer={[
              <Button key="ok" type="primary" onClick={() => setModalInfo({ visible: false, title: '', content: '' })}>
                OK
              </Button>,
            ]}
          >
            {modalInfo.content}
          </Modal>
          <Modal
            open={loginPrompt.visible}
            title="Login Required"
            onOk={() => {
              setLoginPrompt({ visible: false });
              const loginBtn = document.querySelector('.user-button');
              if (loginBtn) loginBtn.click();
            }}
            onCancel={() => setLoginPrompt({ visible: false })}
            okText="Login"
            cancelText="Cancel"
          >
            {loginPrompt.content || "You must be logged in to borrow books. Would you like to log in now?"}
          </Modal>
          <Modal
            open={subscriptionPrompt.visible}
            title="Confirm Subscription"
            onOk={handleSubscriptionConfirm}
            onCancel={handleSubscriptionCancel}
            okText="Yes"
            cancelText="No"
          >
            {subscriptionPrompt.plan && (
              <div>
                <strong>Plan:</strong> {subscriptionPrompt.plan.planName}
              </div>
            )}
          </Modal>
        </Content>
        <Footer />
      </Layout>
    </div>
  );
}

export default HomePage;