import '../styles/variables.css';
import '../styles/global.css';
import { products } from './data.js';

console.log('URBANKICK Loaded');

// --- RENDER LOGIC ---

const renderCard = (product) => `
    <a href="product.html?id=${product.id}" class="product-card reveal">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" style="width:100%; height:100%; object-fit:cover;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
        <!-- Fallback Placeholder -->
        <div style="width:100%; height:100%; background: linear-gradient(135deg, #111, #1a1a1a); display:none; align-items:center; justify-content:center; flex-direction: column; color:#444; position:absolute; top:0; left:0;">
             <div style="font-size:4rem;">⚡</div>
             <span style="font-size:1.5rem; font-weight:800; margin-top:1rem;">${product.category}</span>
        </div>
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>$${product.price} USD</p>
        <button class="add-btn">+</button>
      </div>
    </a>
`;

const initHome = () => {
    const grid = document.getElementById('product-grid');
    if (grid) {
        grid.innerHTML = products.slice(0, 3).map(renderCard).join('');
    }
};

const initCatalog = () => {
    const grid = document.getElementById('catalog-grid');
    if (!grid) return;

    const render = (filter) => {
        const filtered = filter === 'ALL'
            ? products
            : products.filter(p => p.category === filter);
        grid.innerHTML = filtered.map(renderCard).join('');
        setupHoverEffects();
        setupAnimations();
    };

    render('ALL');

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            render(e.target.dataset.filter);
        });
    });
};

const initProductPage = () => {
    const container = document.getElementById('product-container');
    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'));
    const product = products.find(p => p.id === id);

    if (!product) {
        container.innerHTML = `<h1 style="text-align:center; margin-top:5rem;">PRODUCT NOT FOUND</h1>`;
        return;
    }

    container.innerHTML = `
        <div class="product-layout reveal active">
            <div class="product-visual">
                 <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-details-pane">
                <div class="pd-category">${product.category} // SEASON 01</div>
                <h1 class="pd-title">${product.name}</h1>
                <div class="pd-price">$${product.price} USD</div>
                <p class="pd-desc">${product.description}</p>
                <div class="pd-desc" style="font-size:0.9rem; margin-bottom:2rem;">
                   Ships in 3-5 business days. Limited stock available.
                </div>
                <button class="buy-btn" onclick="window.location.href='success.html'">ADD TO CART</button>
            </div>
        </div>
    `;
};

// --- INTERACTIVITY ---

const setupHoverEffects = () => {
    // Only apply card hover effects if we are NOT on product page
    // (Product page uses different structure)
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        });
    });
};


const setupAnimations = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
};

// --- INIT ---

// --- CURSOR & MENU ---

const initCursor = () => {
    // Create cursor elements
    const dot = document.createElement('div');
    const outline = document.createElement('div');
    dot.className = 'cursor-dot';
    outline.className = 'cursor-outline';
    document.body.appendChild(dot);
    document.body.appendChild(outline);

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        // Dot follows instantly
        dot.style.left = `${posX}px`;
        dot.style.top = `${posY}px`;

        // Outline follows with lag (CSS transition handles smooth)
        outline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Add hover effect for interactive elements
    const interactive = document.querySelectorAll('a, button, .product-card');
    interactive.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });
};

const initMobileMenu = () => {
    const nav = document.querySelector('.navbar');
    // Create burger if doesn't exist (simplifying for this flow)
    if (!document.querySelector('.burger')) {
        const burger = document.createElement('div');
        burger.className = 'burger';
        burger.innerHTML = `
            <div style="width:25px; height:2px; background:#fff; margin:5px 0;"></div>
            <div style="width:25px; height:2px; background:#fff; margin:5px 0;"></div>
            <div style="width:25px; height:2px; background:#fff; margin:5px 0;"></div>
        `;
        // Styles are now handled in global.css

        nav.insertBefore(burger, nav.querySelector('.cart-icon'));

        burger.addEventListener('click', () => {
            document.querySelector('.nav-links').classList.toggle('active');
        });
    }
}


document.addEventListener('DOMContentLoaded', () => {
    // Detect Page
    if (document.getElementById('product-grid')) initHome();
    if (document.getElementById('catalog-grid')) initCatalog();
    if (document.getElementById('product-container')) initProductPage();

    setupHoverEffects();
    setupAnimations();

    // UX Enhancements
    if (window.matchMedia("(min-width: 769px)").matches) {
        initCursor();
    }
    initMobileMenu();
});
