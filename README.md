# 🏛️ **CANDI** - Premium Digital Notes Application

<div align="center">

[![Live Demo](https://img.shields.io/badge/Live%20Demo-https://candi--suryahanjaya.vercel.app-brightgreen?style=for-the-badge&logo=vercel)](https://candi-suryahanjaya.vercel.app/)
![React](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-4.2.0-purple?style=for-the-badge&logo=vite)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

**CANDI - A modern, premium digital notes application with glassmorphism design, gradient themes, and advanced features.**

</div>

## 🌐 **Live Demo**

**🚀 [Try CANDI Now](https://candi-suryahanjaya.vercel.app/)**

Experience the full application with all features:
- ✨ **Premium UI/UX** with glassmorphism design
- 🌙 **Light/Dark Mode** with system detection
- 📱 **Responsive Design** for all devices
- 🎨 **Purple Gradient Theme** throughout
- ⚡ **Fast Performance** with optimized loading

---

## ✨ **Features Overview**

### 🎨 **Premium Design System**
- **Purple Gradient Theme** with dynamic color transitions
- **Glassmorphism Effects** with 40px blur and transparency
- **Neon Violet Accents** for active states and highlights
- **Smooth Animations** and micro-interactions throughout

### 🌙 **Smart Theme System**
- **Auto-Detection** of system preference (light/dark mode)
- **Manual Toggle** with persistent user preference
- **Smooth Transitions** between themes
- **Optimized Colors** for both light and dark modes

### 📱 **Modern UI Components**
- **Floating Navigation** with glassmorphism design
- **Animated FAB** with gradient color shifts
- **Premium Note Cards** with hover effects and gradients
- **Rich Text Editor** with purple cursor and styling

---

## 🚀 **Quick Start**

### **🌐 Live Demo**
**Try the application instantly: [https://candi-suryahanjaya.vercel.app/](https://candi-suryahanjaya.vercel.app/)**

### **Prerequisites**
- Node.js 16+ 
- npm or yarn

### **Installation**

```bash
# Clone the repository
git clone https://github.com/your-username/notes-app.git
cd notes-app

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 🎯 **Core Features**

### **📝 Note Management**
- ✅ **Create Notes** with rich text editing
- ✅ **Edit Notes** inline with real-time updates
- ✅ **Delete Notes** with confirmation dialog
- ✅ **Archive System** with separate archived notes page
- ✅ **Search Functionality** with URL persistence

### **🎨 Premium UI/UX**
- ✅ **Glassmorphism Design** with blur effects
- ✅ **Gradient Backgrounds** with purple theme
- ✅ **Micro-animations** and hover effects
- ✅ **Responsive Design** for all devices
- ✅ **Theme Toggle** with system preference detection

---

## 🏗️ **Project Structure**

```
src/
├── components/          # Reusable UI components
│   ├── BottomNav.jsx           # Navigation component
│   ├── FloatingActionButton.jsx # FAB for adding notes
│   ├── NoteItem.jsx           # Individual note card
│   ├── SearchBar.jsx          # Search input with icons
│   └── ThemeToggle.jsx        # Theme switcher
├── context/             # React Context providers
│   ├── NotesContext.jsx       # Notes state management
│   └── ThemeContext.jsx       # Theme state management
├── pages/               # Application pages
│   ├── NotesList.jsx          # Main notes listing
│   ├── NoteDetail.jsx         # Individual note view
│   ├── AddNote.jsx           # Create new note
│   ├── ArchivedNotes.jsx     # Archived notes page
│   └── NotFound.jsx          # 404 error page
├── styles/              # Global styles
│   └── style.css             # Main stylesheet
├── utils/               # Utility functions
│   ├── formatDate.js         # Date formatting
│   ├── local-data.js         # Data management
│   └── index.js             # Utility exports
├── App.jsx              # Main application component
└── index.jsx            # Application entry point
```

---

## 🎨 **Design System**

### **Color Palette**

```css
/* Dark Mode (Default) */
--primary: #6A00FF          /* Purple */
--primary-variant: #9D4EDD  /* Light Purple */
--background: #0D0D0D       /* Dark Background */
--surface: #1a1a1a         /* Card Background */
--on-background: #F5F5F5   /* Text Color */

/* Light Mode */
--background: #F8F9FA       /* Light Background */
--surface: #FFFFFF         /* White Cards */
--on-background: #1a1a1a   /* Dark Text */
```

### **Typography**
- **Font Family**: Inter, -apple-system, BlinkMacSystemFont
- **Weights**: 400 (Regular), 600 (Semi-bold), 700 (Bold)
- **Sizes**: 12px - 48px with responsive scaling

---

## 🔧 **Technical Implementation**

### **State Management**
```jsx
// Notes Context
const { notes, addNote, editNote, deleteNote, archiveNote } = useNotes();

// Theme Context  
const { theme, toggleTheme } = useTheme();
```

### **Routing**
```jsx
// URL Structure
/                    # Notes list
/notes              # Notes list
/notes/:id          # Note detail
/notes/new          # Add new note
/archives           # Archived notes
```

---

## 📱 **Responsive Design**

### **Breakpoints**
- **Mobile**: < 650px (1 column)
- **Tablet**: 650px - 850px (2 columns)  
- **Desktop**: 850px - 1200px (3 columns)
- **Large**: > 1200px (4 columns)

---

## 🎭 **Animations & Effects**

### **Page Transitions**
```css
@keyframes slideInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### **Hover Effects**
```css
.notes-item:hover {
  transform: scale(1.02) translateY(-4px);
  box-shadow: 0 20px 40px rgba(106, 0, 255, 0.2);
}
```

---

## 🌙 **Theme System**

### **Auto-Detection**
```jsx
// System preference detection
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
```

### **Manual Override**
```jsx
// User preference persistence
localStorage.setItem('theme', theme);
```

---

## 🚀 **Performance Optimizations**

- **Route-based** code splitting
- **Memoized** search results
- **Efficient** re-renders with React.memo()
- **SVG icons** for crisp rendering
- **CSS custom properties** for theming

---

## 📊 **Browser Support**

| Browser | Version | Support |
|---------|---------|---------|
| Chrome  | 90+     | ✅ Full |
| Firefox | 88+     | ✅ Full |
| Safari  | 14+     | ✅ Full |
| Edge    | 90+     | ✅ Full |

---

## 🤝 **Contributing**

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 **Developer**

<div align="center">

### **Surya Hanjaya**

*AI Researcher • Full-Stack Developer • Informatics Engineering '23*

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/surya-hanjaya/)
[![GitHub](https://img.shields.io/badge/GitHub-333333?style=for-the-badge&logo=github&logoColor=white)](https://github.com/suryahanjaya)
[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/h4njy/)

</div>

---

## 📱 **Mobile & Tablet Optimized**

- **Responsive Design** for all screen sizes
- **Touch-friendly** interactions
- **Optimized Navigation** for mobile devices
- **Adaptive Layouts** for tablets and phones
- **Performance Optimized** for mobile networks

---

## 🎯 **Key Features**

- ✅ **CANDI Branding** with custom logo
- ✅ **Developer Information** with social links
- ✅ **Mobile Responsive** design
- ✅ **Light/Dark Mode** with system detection
- ✅ **Purple Gradient** theme throughout
- ✅ **Glassmorphism** effects
- ✅ **Smooth Animations** and transitions

</div>