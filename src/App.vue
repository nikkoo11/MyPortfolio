<template>
    <div class="relative flex h-svh flex-col overflow-hidden">
        <Transition name="loader-fade">
            <div v-if="isLoading" class="loader" role="status" aria-live="polite">
                <div class="loader-ring">JF</div>
                <p class="loader-name">Jericho Fragata</p>
                <div class="loader-bar"><span :style="{ width: progress + '%' }"></span></div>
                <p class="loader-percent">{{ progress }}%</p>
            </div>
        </Transition>

        <header class="fixed inset-x-0 bottom-3 z-40 flex justify-center px-3 sm:bottom-4 sm:px-4">
            <nav aria-label="Main navigation" class="icon-dock flex max-w-full items-center justify-center gap-1 rounded-full border border-slate-800 bg-slate-900/90 p-1.5 shadow-[0_10px_30px_rgba(2,6,23,0.8)] backdrop-blur-xl sm:gap-2">
                <a
                    v-for="item in navItems"
                    :key="item.name"
                    :href="item.href"
                    @click.prevent="navigateToSection(item.href)"
                    :aria-label="item.name"
                    :aria-current="activeSection === item.href.slice(1) ? 'page' : undefined"
                    class="nav-link relative flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-slate-300 transition-colors duration-200 hover:bg-slate-800 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-300 sm:h-12 sm:w-12"
                >
                    <span v-if="item.separatorBefore" class="nav-separator" aria-hidden="true"></span>
                    <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <template v-if="item.icon === 'home'">
                            <path d="M4 10.5 12 4.5l8 6"></path>
                            <path d="M6.4 8.7v10.1a1.2 1.2 0 0 0 1.2 1.2h8.8a1.2 1.2 0 0 0 1.2-1.2V8.7"></path>
                            <path d="M9.8 20v-4.6h4.4V20"></path>
                        </template>
                        <template v-else-if="item.icon === 'user'">
                            <circle cx="12" cy="8" r="3"></circle>
                            <path d="M5.5 20c.4-3.4 2.7-5.2 6.5-5.2s6.1 1.8 6.5 5.2"></path>
                        </template>
                        <template v-else-if="item.icon === 'folder'">
                            <path d="M3.5 7.5A1.5 1.5 0 0 1 5 6h5l2 2h7a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 19 19H5a1.5 1.5 0 0 1-1.5-1.5z"></path>
                        </template>
                        <template v-else-if="item.icon === 'skills'">
                            <circle cx="9" cy="8" r="3"></circle>
                            <path d="M2.5 20c.4-3.4 2.7-5.2 6.5-5.2s6.1 1.8 6.5 5.2"></path>
                            <g transform="translate(13 13) scale(0.55)">
                                <circle cx="12" cy="12" r="3"></circle>
                                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                            </g>
                        </template>
                        <template v-else-if="item.icon === 'image'">
                            <rect x="3.5" y="4.5" width="17" height="15" rx="2"></rect>
                            <circle cx="9" cy="9" r="1.5"></circle>
                            <path d="m4 16 5-4 3.5 3 2.5-2 5 4"></path>
                        </template>
                        <template v-else-if="item.icon === 'certificate'">
                            <path d="M6.5 3.5h6.2L17 7.8v11.7a1 1 0 0 1-1 1H6.5a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1z"></path>
                            <path d="M12.7 3.5v4.3H17"></path>
                            <circle cx="12" cy="13" r="2.5"></circle>
                            <path d="m10.9 14.9-.7 5.1L12 18.5l1.8 1.5-.7-5.1"></path>
                        </template>
                        <template v-else-if="item.icon === 'mail'">
                            <rect x="3" y="5.5" width="18" height="13" rx="2.2"></rect>
                            <path d="M3.8 7.4 11.1 12.4a1.6 1.6 0 0 0 1.8 0L20.2 7.4"></path>
                        </template>
                        <template v-else>
                            <circle cx="12" cy="12" r="4"></circle>
                        </template>
                    </svg>
                    <span class="nav-tooltip" aria-hidden="true">{{ item.name }}</span>
                </a>
            </nav>
        </header>

        <main class="z-10 h-svh w-full flex-grow overflow-hidden">
            <section id="home" v-show="activeSection === 'home'" aria-labelledby="home-title" class="screen-view">
                <div class="section-inner home-layout">
                    <div class="home-copy">
                        <h1 id="home-title">Hi, I’m <span>Jericho Fragata.</span></h1>

                        <div class="hero-actions">
                            <a class="button-primary" href="/resume.pdf" download="Jericho-Fragata-Resume.pdf"><i class="fa-solid fa-download" aria-hidden="true"></i> Download CV</a>
                            <button class="button-secondary" type="button" @click="navigateToSection('#contact')"><i class="fa-solid fa-paper-plane" aria-hidden="true"></i> Contact me</button>
                        </div>

                        <div class="home-footer">
                            <div class="home-socials">
                                <a v-for="social in socialLinks" :key="social.name" :href="social.href" target="_blank" rel="noopener noreferrer" :aria-label="social.name"><i :class="social.icon" aria-hidden="true"></i></a>
                            </div>
                            <p class="home-location"><i class="fa-solid fa-location-dot" aria-hidden="true"></i> Isabela, Philippines</p>
                        </div>
                    </div>

                    <div class="home-portrait-wrap">
                        <img :src="avatarImage" alt="Portrait of Jericho Fragata" class="home-portrait">
                    </div>
                </div>
            </section>

            <section id="about" v-show="activeSection === 'about'" aria-labelledby="about-title" class="screen-view">
                <div class="section-inner">
                    <div class="section-heading">
                        <p class="eyebrow">A little about me</p>
                        <h2 id="about-title">Curious about how things work.</h2>
                        <p>I’m a Computer Engineering student who likes bringing hardware and software together to solve real problems.</p>
                    </div>
                    <div class="about-layout">
                        <article class="content-card about-story">
                            <span class="card-kicker"><i class="fa-solid fa-user-astronaut" aria-hidden="true"></i> My story</span>
                            <p>I’m <strong>Jericho Fragata</strong>, a 4th-year Computer Engineering student at Cagayan State University. My interests span embedded systems, robotics, electronics, and web development.</p>
                            <p>Whether I’m experimenting with a microcontroller or shaping a clean interface, I enjoy learning by building. I’m motivated to keep improving, take on new challenges, and create technology that is useful and approachable.</p>
                            <div class="focus-tags"><span>Embedded systems</span><span>Robotics</span><span>Web development</span><span>Electronics</span></div>
                        </article>
                        <aside class="content-card about-facts" aria-label="Personal details">
                            <span class="card-kicker"><i class="fa-solid fa-compass" aria-hidden="true"></i> At a glance</span>
                            <div class="fact-row"><span class="fact-icon"><i class="fa-solid fa-graduation-cap" aria-hidden="true"></i></span><div><small>Education</small><strong>Computer Engineering</strong><span>Cagayan State University</span></div></div>
                            <div class="fact-row"><span class="fact-icon"><i class="fa-solid fa-location-dot" aria-hidden="true"></i></span><div><small>Based in</small><strong>Isabela, Philippines</strong><span>Caliguian, Burgos</span></div></div>
                            <div class="fact-row"><span class="fact-icon"><i class="fa-solid fa-lightbulb" aria-hidden="true"></i></span><div><small>Currently interested in</small><strong>Building things that work</strong><span>From circuits to interfaces</span></div></div>
                        </aside>
                    </div>
                </div>
            </section>

            <section id="skills" v-show="activeSection === 'skills'" aria-labelledby="skills-title" class="screen-view">
                <div class="section-inner">
                    <div class="section-heading">
                        <p class="eyebrow">Tools of the trade</p>
                        <h2 id="skills-title">Skills I’m growing every day.</h2>
                        <p>A mix of programming, design, and engineering tools I use to explore and build.</p>
                    </div>
                    <div class="skills-grid">
                        <article v-for="skill in skillGroups[0].skills" :key="skill.name" class="skill-tile">
                            <span class="skill-tile-icon"><i :class="skill.icon" aria-hidden="true"></i></span>
                            <h3>{{ skill.name }}</h3>
                            <p>{{ skill.desc }}</p>
                        </article>
                    </div>
                    <p class="skills-note"><i class="fa-solid fa-circle-info" aria-hidden="true"></i> Skill levels are a personal snapshot and reflect ongoing learning.</p>
                </div>
            </section>

            <section id="projects" v-show="activeSection === 'projects'" aria-labelledby="projects-title" class="screen-view">
                <div class="section-inner">
                    <div class="section-heading">
                        <p class="eyebrow">Selected work</p>
                        <h2 id="projects-title">Projects built with curiosity.</h2>
                        <p>Hands-on explorations across embedded systems, digital electronics, and hardware design.</p>
                    </div>
                    <div class="projects-grid">
                        <article v-for="project in projects" :key="project.title" class="content-card project-card">
                            <div class="project-image-wrap">
                                <img :src="project.image" :alt="project.imageAlt" class="project-image">
                                <span class="project-year">{{ project.year }}</span>
                            </div>
                            <div class="project-content">
                                <p class="project-category">{{ project.category }}</p>
                                <h3>{{ project.title }}</h3>
                                <p class="project-description">{{ project.description }}</p>
                                <div class="project-tags"><span v-for="tag in project.tags" :key="tag">{{ tag }}</span></div>
                            </div>
                        </article>
                    </div>
                </div>
            </section>

            <section id="gallery" v-show="activeSection === 'gallery'" aria-labelledby="gallery-title" class="screen-view">
                <div class="section-inner">
                    <div class="section-heading">
                        <p class="eyebrow">Snapshots</p>
                        <h2 id="gallery-title">A few moments from my work.</h2>
                        <p>Projects, experiments, and milestones along the way.</p>
                    </div>
                    <div class="gallery-grid">
                        <figure v-for="(photo, index) in gallery" :key="photo.image" class="gallery-card" tabindex="0" role="button" :aria-label="`View ${photo.title} full size`" @click="openPhoto(index)" @keydown.enter="openPhoto(index)" @keydown.space.prevent="openPhoto(index)">
                            <img :src="photo.image" :alt="photo.alt" loading="lazy">
                            <figcaption><span>{{ photo.title }}</span><small>{{ photo.category }}</small></figcaption>
                        </figure>
                    </div>
                </div>
            </section>

            <section id="achievements" v-show="activeSection === 'achievements'" aria-labelledby="achievements-title" class="screen-view">
                <div class="section-inner credentials-panel">
                    <div class="section-heading credentials-heading">
                        <p class="eyebrow">Qualifications</p>
                        <h2 id="achievements-title">Certificates &amp; <span>Credentials</span></h2>
                    </div>
                    <div class="credentials-grid">
                        <article v-for="credential in credentials" :key="credential.title" class="credential-card">
                            <span v-if="credential.status" class="credential-status">{{ credential.status }}</span>
                            <span class="credential-icon"><i class="fa-solid fa-award" aria-hidden="true"></i></span>
                            <div class="credential-copy">
                                <p class="credential-category">{{ credential.category }}</p>
                                <h3>{{ credential.title }}</h3>
                                <p class="credential-description">{{ credential.description }}</p>
                            </div>
                        </article>
                    </div>
                </div>
            </section>

            <section id="contact" v-show="activeSection === 'contact'" aria-labelledby="contact-title" class="screen-view">
                <div class="section-inner">
                    <div class="section-heading">
                        <p class="eyebrow">Let’s connect</p>
                        <h2 id="contact-title">Have a project or an idea?</h2>
                        <p>I’m always glad to connect, learn about new opportunities, and talk about technology.</p>
                    </div>
                    <div class="contact-layout">
                        <div class="content-card contact-details">
                            <span class="card-kicker"><i class="fa-solid fa-paper-plane" aria-hidden="true"></i> Contact details</span>
                            <a class="contact-link" :href="`mailto:${email}`"><span class="contact-icon"><i class="fa-solid fa-envelope" aria-hidden="true"></i></span><span><small>Email me</small><strong>{{ email }}</strong></span><i class="fa-solid fa-arrow-up-right-from-square contact-arrow" aria-hidden="true"></i></a>
                            <a class="contact-link" :href="`tel:${phone.replace(/\s/g, '')}`"><span class="contact-icon"><i class="fa-solid fa-phone" aria-hidden="true"></i></span><span><small>Call or message</small><strong>{{ phone }}</strong></span><i class="fa-solid fa-arrow-up-right-from-square contact-arrow" aria-hidden="true"></i></a>
                            <div class="contact-link"><span class="contact-icon"><i class="fa-solid fa-location-dot" aria-hidden="true"></i></span><span><small>Location</small><strong>Isabela, Philippines</strong></span></div>
                            <div class="social-links" aria-label="Social profiles">
                                <a v-for="social in socialLinks" :key="social.name" :href="social.href" target="_blank" rel="noopener noreferrer" :aria-label="social.name" :title="social.name"><i :class="social.icon" aria-hidden="true"></i></a>
                            </div>
                        </div>
                        <form class="content-card contact-form" @submit.prevent="sendMessage">
                            <span class="card-kicker"><i class="fa-solid fa-message" aria-hidden="true"></i> Send a message</span>
                            <label for="contact-name">Your name</label>
                            <input id="contact-name" v-model.trim="form.name" name="name" autocomplete="name" placeholder="Name" required>
                            <label for="contact-email">Your email</label>
                            <input id="contact-email" v-model.trim="form.email" name="email" type="email" autocomplete="email" placeholder="you@example.com" required>
                            <label for="contact-message">Message</label>
                            <textarea id="contact-message" v-model.trim="form.message" name="message" rows="4" placeholder="Tell me a little about what you have in mind..." required></textarea>
                            <button class="button-primary contact-submit" type="submit"><i class="fa-solid fa-paper-plane" aria-hidden="true"></i> Send message</button>
                        </form>
                    </div>
                </div>
            </section>
        </main>

        <div v-if="activePhoto" class="lightbox" role="dialog" aria-modal="true" :aria-label="activePhoto.title" @click.self="closePhoto">
            <button class="lightbox-close" type="button" aria-label="Close photo" @click="closePhoto"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
            <button class="lightbox-nav lightbox-prev" type="button" aria-label="Previous photo" @click="showPhoto(-1)"><i class="fa-solid fa-chevron-left" aria-hidden="true"></i></button>
            <figure class="lightbox-figure">
                <img :src="activePhoto.image" :alt="activePhoto.alt">
                <figcaption><span>{{ activePhoto.title }}</span><small>{{ photoIndex + 1 }} / {{ gallery.length }}</small></figcaption>
            </figure>
            <button class="lightbox-nav lightbox-next" type="button" aria-label="Next photo" @click="showPhoto(1)"><i class="fa-solid fa-chevron-right" aria-hidden="true"></i></button>
        </div>
    </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import avatarImage from './Assets/ojtpic.jpg'
import certificateImage from './Assets/CertificateOJT.jpg'
import lineFollowerImage from './Assets/Linefollower.jpg'
import logicGatesImage from './Assets/LogicGates.jpg'
import picBoardImage from './Assets/PicBoard.jpg'
import smartBoardImage from './Assets/SmartBoard.png'
import labWebImage from './Assets/labweb.webp'
import iteImage from './Assets/ite.jpg'
import photoshootImage from './Assets/photoshoot.jpg'
import microImage from './Assets/micro.jpg'
import abanaGroupImage from './Assets/grouppicABANA.jpg'
import abanaGroup2Image from './Assets/grouppicABANA1.jpg'
import boysGroupImage from './Assets/groupicwithdaboys.jpg'
import boysGroup2Image from './Assets/groupicwithdaboys1.jpg'

const navItems = [
    { name: 'Home', href: '#home', icon: 'home' },
    { name: 'About', href: '#about', icon: 'user' },
    { name: 'Skills', href: '#skills', icon: 'skills' },
    { name: 'Projects', href: '#projects', icon: 'folder' },
    { name: 'Gallery', href: '#gallery', icon: 'image' },
    { name: 'Certificates', href: '#achievements', icon: 'certificate' },
    { name: 'Contact', href: '#contact', icon: 'mail', separatorBefore: true }
]

const activeSection = ref('home')
const isLoading = ref(true)
const progress = ref(0)
let progressTimer = null
const email = 'jerichofragata811@gmail.com'
const phone = '+63 967 258 2102'
const form = reactive({ name: '', email: '', message: '' })

const skillGroups = [
    {
        name: 'Skills',
        icon: 'fa-solid fa-screwdriver-wrench',
        flipped: false,
        skills: [
            { name: 'Hardware Repair', icon: 'fa-solid fa-screwdriver-wrench', desc: 'Diagnose and fix hardware issues' },
            { name: 'PCB Etching & Design', icon: 'fa-solid fa-microchip', desc: 'Design and etch PCBs' },
            { name: 'C / C++ Basics', icon: 'fa-solid fa-code', desc: 'Embedded programming fundamentals' },
            { name: 'Python Basics', icon: 'fa-brands fa-python', desc: 'Scripting and automation' },
            { name: 'HTML / CSS / JavaScript Basics', icon: 'fa-brands fa-js', desc: 'Web fundamentals' },
            { name: 'Soldering', icon: 'fa-solid fa-fire', desc: 'Precision soldering skills' }
        ]
    }
]

const projects = [
    {
        title: 'Line Follower Robot',
        category: 'Embedded systems',
        year: '2026',
        description: 'An autonomous robot project focused on following a path with sensor-based detection and responsive control.',
        tags: ['Arduino', 'C++', 'Robotics'],
        image: lineFollowerImage,
        imageAlt: 'Line follower robot project'
    },
    {
        title: 'PIC Board Microcontroller PCB',
        category: 'Electronics',
        year: '2025',
        description: 'A custom microcontroller board design exploring PCB layout, component integration, and embedded hardware.',
        tags: ['KiCad', 'PCB design', 'Microcontrollers'],
        image: picBoardImage,
        imageAlt: 'PIC microcontroller board design'
    },
    {
        title: 'Logic Gates Simulation',
        category: 'Digital electronics',
        year: '2025',
        description: 'A visual exploration of basic logic gates and digital circuits, bringing foundational concepts to life.',
        tags: ['JavaScript', 'HTML', 'Digital logic'],
        image: logicGatesImage,
        imageAlt: 'Logic gates simulation project'
    },
    {
        title: 'SmartBoard Retrofit',
        category: 'IoT & computer vision',
        year: '2026',
        description: 'A low-cost retrofit that turns an existing classroom whiteboard into a smart board by capturing handwritten notes, converting them to PDF, and emailing them to students.',
        tags: ['ESP32-CAM', 'Computer vision', 'IoT'],
        image: smartBoardImage,
        imageAlt: 'SmartBoard Retrofit project'
    },
    {
        title: 'Laboratory Borrowing System',
        category: 'Web development',
        year: '2026',
        description: 'A web-based system for managing the borrowing and returning of laboratory equipment.',
        tags: ['Web development', 'Borrowing system'],
        image: labWebImage,
        imageAlt: 'Laboratory borrowing system website'
    }
]

const gallery = [
    { title: 'Line Follower Robot', category: 'Robotics', image: lineFollowerImage, alt: 'Line follower robot project' },
    { title: 'PIC Board Design', category: 'Electronics', image: picBoardImage, alt: 'PIC microcontroller board' },
    { title: 'Logic Gates', category: 'Digital logic', image: logicGatesImage, alt: 'Logic gates simulation' },
    { title: 'Microcontroller', category: 'Electronics', image: microImage, alt: 'Microcontroller project' },
    { title: 'OJT Certificate', category: 'Milestone', image: certificateImage, alt: 'On-the-job training certificate' },
    { title: 'ITE SUMMIT', category: 'School', image: iteImage, alt: 'ITE photo' },
    { title: 'Photoshoot', category: 'About me', image: photoshootImage, alt: 'Photoshoot of Jericho Fragata' },
    { title: 'Abana Team', category: 'OJT', image: abanaGroupImage, alt: 'Group photo at Abana' },
    { title: 'Abana Team 2', category: 'OJT', image: abanaGroup2Image, alt: 'Second group photo at Abana' },
    { title: 'With the Friends', category: 'Friends', image: boysGroupImage, alt: 'Group photo with friends' },
    { title: 'With the Friends 2', category: 'Friends', image: boysGroup2Image, alt: 'Second group photo with friends' },
    { title: 'A portrait', category: 'About me', image: avatarImage, alt: 'Portrait of Jericho Fragata' }
]

const photoIndex = ref(null)
const activePhoto = computed(() => (photoIndex.value === null ? null : gallery[photoIndex.value]))

const openPhoto = (index) => {
    photoIndex.value = index
}

const closePhoto = () => {
    photoIndex.value = null
}

const showPhoto = (step) => {
    if (photoIndex.value === null) return
    photoIndex.value = (photoIndex.value + step + gallery.length) % gallery.length
}

const handleKeydown = (event) => {
    if (photoIndex.value === null) return
    if (event.key === 'Escape') closePhoto()
    if (event.key === 'ArrowLeft') showPhoto(-1)
    if (event.key === 'ArrowRight') showPhoto(1)
}

const credentials = [
    {
        category: 'TESDA / National Cert',
        title: 'Computer Systems Servicing (CSS NC II)',
        status: 'In progress',
        description: 'Working toward certification in computer hardware assembly, OS installation, network configuration, and diagnostic maintenance.'
    },
    {
        category: 'Industry Internship',
        title: 'Hardware Servicing & IT Internship',
        description: 'Issued by Abana Computer Services & Merchandise for diagnostic hardware repairs, OS deployment, and network cabling operations.'
    },
    {
        category: 'CpE Workshop',
        title: 'PCB Fabrication & Circuit Design',
        description: 'Practical certification in schematic layout, copper board etching, precision soldering, and power regulator circuit testing.'
    }
]

const socialLinks = [
    { name: 'GitHub', href: 'https://github.com/nikkoo11', icon: 'fa-brands fa-github' },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/in/jerichofragata/', icon: 'fa-brands fa-linkedin-in' },
    { name: 'Facebook', href: 'https://www.facebook.com/share/1DqL5MsQYu/', icon: 'fa-brands fa-facebook-f' }
]

const syncSectionFromLocation = () => {
    const currentHref = window.location.hash || '#home'
    activeSection.value = navItems.some(item => item.href === currentHref)
        ? currentHref.slice(1)
        : 'home'
}

const navigateToSection = (href) => {
    if (!navItems.some(item => item.href === href)) return

    activeSection.value = href.slice(1)
    if (window.location.hash !== href) window.history.pushState(null, '', href)
}

const sendMessage = () => {
    const subject = `Portfolio contact from ${form.name}`
    const body = `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

onMounted(() => {
    syncSectionFromLocation()
    window.addEventListener('popstate', syncSectionFromLocation)
    window.addEventListener('keydown', handleKeydown)

    let pageReady = document.readyState === 'complete'
    if (!pageReady) {
        window.addEventListener('load', () => { pageReady = true }, { once: true })
    }

    progressTimer = setInterval(() => {
        const limit = pageReady ? 100 : 90
        if (progress.value < limit) progress.value += 1
        if (progress.value >= 100) {
            clearInterval(progressTimer)
            setTimeout(() => { isLoading.value = false }, 350)
        }
    }, 18)
})

onBeforeUnmount(() => {
    clearInterval(progressTimer)
    window.removeEventListener('popstate', syncSectionFromLocation)
    window.removeEventListener('keydown', handleKeydown)
})
</script>