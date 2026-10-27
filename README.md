# Jericho Fragata | Portfolio

Hi, I'm **Jericho Fragata**, a 4th-year Computer Engineering student at Cagayan State University. This is my personal portfolio website, where I share who I am, the skills I'm building, and the projects I've worked on across embedded systems, robotics, electronics, and web development.

## About the site

The site shows one section at a time and is navigated with a floating icon dock at the bottom of the screen. It has a dark theme with a neutral gray-white accent, and it works on both desktop and mobile.

### Sections

- **Home**: introduction, Download CV button, social links, and photo
- **About**: my story and quick facts
- **Skills**: hardware repair, PCB etching and design, C/C++, Python, web basics, and soldering
- **Projects**: Line Follower Robot, PIC Board Microcontroller PCB, and Logic Gates Simulation
- **Gallery**: photos with a full-size viewer (previous/next buttons, and keyboard support with Esc and the arrow keys)
- **Certificates & Credentials**: training, internship, and workshop credentials
- **Contact**: contact details and a message form that opens an email

### Features

- Animated loading screen with a progress bar
- Download CV button
- Full-size gallery lightbox
- Contact form that opens a pre-filled email
- Responsive layout for desktop and mobile

## Built with

- [Vue 3](https://vuejs.org/) (`<script setup>`, JavaScript)
- [Tailwind CSS](https://tailwindcss.com/) v3
- [Vite](https://vitejs.dev/)
- [Font Awesome](https://fontawesome.com/) icons
- Google Fonts: Inter, Plus Jakarta Sans, and JetBrains Mono

## Run it locally

You need [Node.js](https://nodejs.org/) installed.

```bash
git clone https://github.com/nikkoo11/MyPortfolio.git
cd MyPortfolio
npm install
npm run dev
```

Then open the address shown in your terminal (usually `http://localhost:5173`).

To make a production build:

```bash
npm run build
```

## Project structure

```
MyPortfolio/
├── public/
│   └── resume.pdf        # CV used by the Download CV button
├── src/
│   ├── Assets/           # Images used on the site
│   ├── App.vue           # All sections of the site
│   ├── main.js
│   └── style.css         # Tailwind and custom styles
├── index.html
└── package.json
```

## Contact

- Email: jerichofragata811@gmail.com
- GitHub: [nikkoo11](https://github.com/nikkoo11)
- LinkedIn: [jerichofragata](https://www.linkedin.com/in/jerichofragata/)

Thanks for stopping by!
