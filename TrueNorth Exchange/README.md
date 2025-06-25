# TrueNorth Exchange

A modern cryptocurrency exchange platform built with React, TypeScript, Tailwind CSS, and Supabase.

![TrueNorth Exchange](https://stirring-bublanina-345b36.netlify.app/0001.png)

## 🚀 Features

- **500+ Cryptocurrencies**: Support for over 500 different cryptocurrency pairs
- **No Registration Required**: Start trading immediately without lengthy verification
- **Real-time Rates**: Live cryptocurrency prices with TradingView integration
- **Secure Transactions**: Advanced AML compliance and security protocols
- **Responsive Design**: Optimized for desktop and mobile devices
- **Dark Theme**: Modern dark UI with beautiful gradients and animations

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Deployment**: Netlify
- **Market Data**: TradingView Widgets

## 🏗️ Project Structure

```
src/
├── components/
│   └── OrderDetailsPage.tsx    # Order confirmation and details
├── lib/
│   └── supabase.ts            # Supabase client configuration
├── App.tsx                    # Main application component
├── main.tsx                   # Application entry point
└── index.css                  # Global styles
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (for database)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/truenorth-exchange.git
cd truenorth-exchange
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Add your Supabase credentials to `.env`:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🗄️ Database Schema

The application uses Supabase with the following main table:

### exchange_orders
- `id` (uuid, primary key)
- `send_currency_symbol` (text)
- `send_currency_name` (text)
- `send_amount` (text)
- `receive_currency_symbol` (text)
- `receive_currency_name` (text)
- `receive_amount` (text)
- `order_type` (text)
- `recipient_address` (text)
- `email` (text)
- `promo_code` (text, optional)
- `status` (text: pending, processing, completed, failed)
- `transaction_hash` (text, optional)
- `created_at` (timestamp)
- `updated_at` (timestamp)

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌐 Deployment

The application is deployed on Netlify: [https://stirring-bublanina-345b36.netlify.app](https://stirring-bublanina-345b36.netlify.app)

### Deploy to Netlify

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard

## 🔐 Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI Framework
- [Supabase](https://supabase.com/) - Backend as a Service
- [Tailwind CSS](https://tailwindcss.com/) - CSS Framework
- [TradingView](https://www.tradingview.com/) - Market Data Widgets
- [Lucide](https://lucide.dev/) - Icon Library