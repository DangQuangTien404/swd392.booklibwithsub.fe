# BookLibwithSub Frontend

This project is the frontend for the BookLibwithSub system, a library management app built with React and Ant Design. It connects to the BookLibwithSub backend API to manage book loans, users, and subscriptions.

## Features

- User authentication and registration
- View, borrow, and return books
- Manage subscriptions and loan history
- Admin panel for viewing and filtering all loans
- Responsive UI built with Ant Design

## Getting Started

### Prerequisites

- Node.js >= 16.x
- npm >= 8.x or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/booklibwithsub-fe.git
   cd booklibwithsub-fe
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   or
   ```bash
   yarn
   ```

3. **Configure API endpoint:**

   Edit `src/appsettings.js` to set your backend API URL:
   ```js
   const appsettings = {
     apiBaseUrl: "http://localhost:5000/api"
   };
   export default appsettings;
   ```

4. **Start the development server:**
   ```bash
   npm start
   ```
   or
   ```bash
   yarn start
   ```

   Open [http://localhost:3000](http://localhost:3000) to view in the browser.
   Open [verswd392-booklibwithsub-fe.vercel.app] (verswd392-booklibwithsub-fe.vercel.app) to view deployment

## Project Structure

```
src/
├── api/            # API helper functions for backend communication
├── components/     # React UI components
├── pages/          # Main page components (routing targets)
├── appsettings.js  # API endpoint configuration
├── App.js          # Main app entry point
└── index.js        # React DOM bootstrap
```

## Environment Variables

You can also use environment variables to override the API endpoint:
- Create a `.env` file and set:
  ```
  REACT_APP_API_BASE_URL=http://localhost:5000/api
  ```

## Scripts

- `npm start` — Start development server
- `npm run build` — Build for production
- `npm test` — Run tests

## Admin Features

- Navigate to the admin tab after logging in as an admin user to view all loans.
- Use the status filter to browse by loan status.
- View loan items in a clean modal popup.

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss your ideas.

## License

[MIT](LICENSE)

---

**Backend repo:** [BookLibwithSub Backend](https://github.com/Floc202/swd392.booklibwithsub.be)
**Backend server:** https://swd392booklibwithsubbe-production-1bea.up.railway.app/swagger/index.html