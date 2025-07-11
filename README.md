# Caribbean Lux Realty

A modern, high-end real estate website built with React, featuring a comprehensive content management system and luxurious design optimized for dark mode.

## 🌟 Features

### Public Features
- **Luxurious Design**: High-end, glass-morphism UI with dark mode optimization
- **Responsive Layout**: Fully responsive design that works on all devices
- **Property Listings**: Dynamic property showcase with detailed views
- **Service Pages**: Comprehensive service offerings with individual detail pages
- **Blog System**: Content-rich blog with detailed article views
- **Contact Integration**: WhatsApp integration for instant communication
- **Newsletter Signup**: Email collection for marketing campaigns

### Admin Features
- **Content Management System**: Edit all public page content through admin interface
- **Property Management**: Add, edit, and manage property listings
- **Blog Management**: Create and edit blog posts
- **Client Submissions**: Review and manage client property submissions
- **Analytics Dashboard**: Track website performance and user engagement
- **Admin Authentication**: Secure admin login system

## 🚀 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **UI Components**: Radix UI, Framer Motion
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS with custom animations
- **State Management**: React Context API
- **Build Tool**: Vite
- **Deployment**: Netlify

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd caribbean-lux-realty
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
caribbean-lux-realty/
├── public/
│   └── Photos/           # Property and service images
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── ui/          # Radix UI components
│   │   ├── Header.jsx   # Navigation header
│   │   ├── Footer.jsx   # Site footer
│   │   └── Layout.jsx   # Main layout wrapper
│   ├── context/         # React Context providers
│   ├── lib/             # Utility functions
│   ├── pages/           # Page components
│   │   ├── Home.jsx     # Landing page
│   │   ├── Services.jsx # Services listing
│   │   ├── Properties.jsx # Property listings
│   │   ├── Blog.jsx     # Blog posts
│   │   └── admin/       # Admin pages
│   └── main.jsx         # App entry point
├── index.html           # HTML template
├── tailwind.config.js   # Tailwind configuration
├── vite.config.js       # Vite configuration
└── package.json         # Dependencies and scripts
```

## 🎨 Design System

### Color Palette
- **Primary**: Dark theme with glass-morphism effects
- **Accent**: Gold/yellow highlights for luxury feel
- **Background**: Dark gradients with transparency
- **Text**: White and light gray for readability

### Typography
- **Headings**: Bold, elegant fonts
- **Body**: Clean, readable sans-serif
- **Buttons**: Glass-morphism style with white text and borders

### Components
- **Cards**: Glass-morphism with backdrop blur
- **Buttons**: Consistent styling with hover effects
- **Navigation**: Smooth transitions and animations
- **Forms**: Clean, accessible input styling

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_APP_TITLE=Caribbean Lux Realty
VITE_APP_DESCRIPTION=Luxury Real Estate in the Caribbean
```

### Tailwind Configuration
The project uses a custom Tailwind configuration with:
- Custom color palette
- Animation utilities
- Responsive breakpoints
- Dark mode optimization

## 🚀 Deployment

### Netlify Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Deploy!

### Build Configuration

The project is optimized for production with:
- Code splitting and lazy loading
- Image optimization
- CSS minification
- JavaScript bundling
- SEO optimization

## 📱 Responsive Design

The website is fully responsive with breakpoints for:
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

## 🎯 Performance Features

- **Lazy Loading**: Images and components load on demand
- **Code Splitting**: Automatic route-based code splitting
- **Optimized Images**: WebP format with fallbacks
- **Minified Assets**: Production-ready file sizes
- **Caching**: Browser caching optimization

## 🔒 Security

- **Content Security Policy**: Configured for production
- **XSS Protection**: Sanitized user inputs
- **HTTPS**: Enforced for all connections
- **Admin Authentication**: Secure admin access

## 📊 Analytics

The admin dashboard includes:
- Page view tracking
- User engagement metrics
- Property view analytics
- Contact form submissions
- Newsletter signup tracking

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Code Style

- **ESLint**: Configured for React best practices
- **Prettier**: Automatic code formatting
- **TypeScript**: Type safety (optional)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation

## 🔄 Updates

### Version History
- **v1.0.0**: Initial release with CMS and admin features
- **v1.1.0**: Added blog system and property management
- **v1.2.0**: Enhanced UI and performance optimizations

### Upcoming Features
- [ ] Database integration (SQLite)
- [ ] User authentication system
- [ ] Advanced property search
- [ ] Virtual property tours
- [ ] Multi-language support

---

**Caribbean Lux Realty** - Luxury Real Estate in the Caribbean

Built with ❤️ using React, Vite, and Tailwind CSS 