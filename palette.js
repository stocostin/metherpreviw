/**
 * Paint Color Palette Showcase
 * 
 * This script handles:
 * - Color data management
 * - Tab navigation
 * - Pagination
 * - Theme toggling
 * - Color mixing functionality
 */

// Color data for interior and exterior palettes
const colorData = {
    interior: [
        { name: "Creamy Vanilla", hex: "#F3E5AB" },
        { name: "Soft Linen", hex: "#F5E7D3" },
        { name: "Warm Beige", hex: "#D8B58F" },
        { name: "Toasty Gray", hex: "#B3A99B" },
        { name: "Misty Blue", hex: "#B4C7DC" },
        { name: "Pale Sage", hex: "#C1D8AC" },
        { name: "Dusty Rose", hex: "#D4A5A5" },
        { name: "Buttercream", hex: "#F0E3C4" },
        { name: "Seafoam Green", hex: "#93E9BE" },
        { name: "Lavender Mist", hex: "#D6C3E6" },
        { name: "Sand Dollar", hex: "#E5D9C8" },
        { name: "Pale Peach", hex: "#FADFAD" },
        { name: "Mint Julep", hex: "#DEF1D6" },
        { name: "Powder Blue", hex: "#B0E0E6" },
        { name: "Antique White", hex: "#FAEBD7" },
        { name: "Pale Butter", hex: "#FFF8DC" },
        { name: "Dove Gray", hex: "#6D6D6D" },
        { name: "Mushroom", hex: "#BDAB9E" },
        { name: "Pearl", hex: "#EAE0C8" },
        { name: "Moonstone", hex: "#C0C0C0" },
        { name: "Champagne", hex: "#F7E7CE" },
        { name: "Blush Pink", hex: "#F8C3CD" },
        { name: "Pale Lilac", hex: "#DCD0FF" },
        { name: "Marshmallow", hex: "#F8F8FF" },
        { name: "Oatmeal", hex: "#D4C4A3" },
        { name: "Driftwood", hex: "#A67C52" },
        { name: "Foggy Gray", hex: "#CBCBCB" },
        { name: "Pale Aqua", hex: "#B8E2F2" },
        { name: "Whisper Green", hex: "#E8F5E9" },
        { name: "Barely There", hex: "#F0F0F0" }
    ],
    exterior: [
        { name: "Colonial Red", hex: "#A24857" },
        { name: "Forest Green", hex: "#228B22" },
        { name: "Navy Blue", hex: "#000080" },
        { name: "Charcoal Gray", hex: "#36454F" },
        { name: "Terra Cotta", hex: "#E2725B" },
        { name: "Slate Blue", hex: "#6A5ACD" },
        { name: "Hunter Green", hex: "#355E3B" },
        { name: "Deep Brown", hex: "#654321" },
        { name: "Brick Red", hex: "#CB4154" },
        { name: "Sandy Beige", hex: "#F4A460" },
        { name: "Midnight Black", hex: "#191970" },
        { name: "Evergreen", hex: "#05472A" },
        { name: "Clay", hex: "#B66A50" },
        { name: "Storm Gray", hex: "#71797E" },
        { name: "Denim Blue", hex: "#1560BD" },
        { name: "Chestnut", hex: "#954535" },
        { name: "Olive Drab", hex: "#6B8E23" },
        { name: "Rust", hex: "#B7410E" },
        { name: "Deep Teal", hex: "#008080" },
        { name: "Sandstone", hex: "#B8860B" },
        { name: "Burgundy", hex: "#800020" },
        { name: "Slate Gray", hex: "#708090" },
        { name: "Sage Green", hex: "#9DC183" },
        { name: "Copper", hex: "#B87333" },
        { name: "Deep Purple", hex: "#4B0082" },
        { name: "Earth Brown", hex: "#5C4033" },
        { name: "Ocean Blue", hex: "#1A73E8" },
        { name: "Moss Green", hex: "#8A9A5B" },
        { name: "Taupe", hex: "#483C32" },
        { name: "Deep Maroon", hex: "#800000" }
    ]
};

// DOM elements
const themeToggle = document.getElementById('themeToggle');
const navItems = document.querySelectorAll('.nav-item');
const colorSections = document.querySelectorAll('.color-section');
const interiorGrid = document.getElementById('interior-grid');
const exteriorGrid = document.getElementById('exterior-grid');
const interiorPagination = document.getElementById('interior-pagination');
const exteriorPagination = document.getElementById('exterior-pagination');
const color1Input = document.getElementById('color1');
const color1Hex = document.getElementById('color1-hex');
const color2Input = document.getElementById('color2');
const color2Hex = document.getElementById('color2-hex');
const mixBtn = document.getElementById('mixBtn');
const resultColor = document.getElementById('resultColor');
const resultHex = document.getElementById('resultHex');

// Current state
let currentTab = 'interior';
let currentPages = {
    interior: 1,
    exterior: 1
};
const colorsPerPage = 10;

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    renderColors('interior', 1);
    renderColors('exterior', 1);
    updatePagination('interior', 1);
    updatePagination('exterior', 1);
    setupEventListeners();
    resultColor.style.backgroundColor = '#800080';
});

/**
 * Sets up all event listeners for the application
 */
function setupEventListeners() {
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);

    // Tab navigation
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const tab = item.dataset.tab;
            switchTab(tab);
        });
    });

    // Pagination for interior colors
    interiorPagination.addEventListener('click', (e) => {
        handlePaginationClick(e, 'interior');
    });

    // Pagination for exterior colors
    exteriorPagination.addEventListener('click', (e) => {
        handlePaginationClick(e, 'exterior');
    });

    // Color inputs
    color1Input.addEventListener('input', (e) => {
        color1Hex.value = e.target.value;
    });

    color2Input.addEventListener('input', (e) => {
        color2Hex.value = e.target.value;
    });

    color1Hex.addEventListener('input', (e) => {
        if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
            color1Input.value = e.target.value;
        }
    });

    color2Hex.addEventListener('input', (e) => {
        if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
            color2Input.value = e.target.value;
        }
    });

    // Mix button
    mixBtn.addEventListener('click', mixColors);
}

/**
 * Toggles between light and dark theme
 */
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const icon = themeToggle.querySelector('i');
    if (document.body.classList.contains('dark-mode')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        themeToggle.textContent = ' Light Mode';
        themeToggle.prepend(icon);
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
        themeToggle.textContent = ' Dark Mode';
        themeToggle.prepend(icon);
    }
}

/**
 * Switches between interior and exterior color tabs
 * @param {string} tab - The tab to switch to ('interior' or 'exterior')
 */
function switchTab(tab) {
    currentTab = tab;
    navItems.forEach(item => {
        item.classList.toggle('active', item.dataset.tab === tab);
    });
    colorSections.forEach(section => {
        section.classList.toggle('active', section.id === `${tab}-colors`);
    });
}

/**
 * Renders colors for a specific type and page
 * @param {string} type - 'interior' or 'exterior'
 * @param {number} page - The page number to render
 */
function renderColors(type, page) {
    const grid = type === 'interior' ? interiorGrid : exteriorGrid;
    grid.innerHTML = '';

    const startIndex = (page - 1) * colorsPerPage;
    const endIndex = Math.min(startIndex + colorsPerPage, colorData[type].length);

    for (let i = startIndex; i < endIndex; i++) {
        const color = colorData[type][i];
        const colorCard = document.createElement('div');
        colorCard.className = 'color-card';
        colorCard.innerHTML = `
            <div class="color-swatch" style="background-color: ${color.hex}"></div>
            <div class="color-info">
                <div class="color-name">${color.name}</div>
                <div class="color-hex">${color.hex}</div>
            </div>
        `;
        grid.appendChild(colorCard);
    }
}

/**
 * Handles pagination button clicks
 * @param {Event} e - The click event
 * @param {string} type - 'interior' or 'exterior'
 */
function handlePaginationClick(e, type) {
    if (e.target.classList.contains('prev-btn')) {
        if (currentPages[type] > 1) {
            currentPages[type]--;
            renderColors(type, currentPages[type]);
            updatePagination(type, currentPages[type]);
        }
    } else if (e.target.classList.contains('next-btn')) {
        if (currentPages[type] < 3) {
            currentPages[type]++;
            renderColors(type, currentPages[type]);
            updatePagination(type, currentPages[type]);
        }
    } else if (e.target.classList.contains('page-btn')) {
        const page = parseInt(e.target.dataset.page);
        currentPages[type] = page;
        renderColors(type, page);
        updatePagination(type, page);
    }
}

/**
 * Updates the active state of pagination buttons
 * @param {string} type - 'interior' or 'exterior'
 * @param {number} currentPage - The current active page
 */
function updatePagination(type, currentPage) {
    const pagination = type === 'interior' ? interiorPagination : exteriorPagination;
    const pageBtns = pagination.querySelectorAll('.page-btn');
    
    pageBtns.forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.dataset.page) === currentPage);
    });
}

/**
 * Mixes two colors and displays the result
 */
function mixColors() {
    const color1 = color1Input.value;
    const color2 = color2Input.value;
    
    // Convert hex to RGB
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    
    // Average the RGB values
    const mixedRgb = {
        r: Math.round((rgb1.r + rgb2.r) / 2),
        g: Math.round((rgb1.g + rgb2.g) / 2),
        b: Math.round((rgb1.b + rgb2.b) / 2)
    };
    
    // Convert back to hex
    const mixedHex = rgbToHex(mixedRgb.r, mixedRgb.g, mixedRgb.b);
    
    // Display the result
    resultColor.style.backgroundColor = mixedHex;
    resultHex.textContent = mixedHex;
}

/**
 * Converts hex color to RGB object
 * @param {string} hex - The hex color string
 * @returns {object} An object with r, g, b properties
 */
function hexToRgb(hex) {
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Parse r, g, b values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return { r, g, b };
}

/**
 * Converts RGB values to hex color string
 * @param {number} r - Red value (0-255)
 * @param {number} g - Green value (0-255)
 * @param {number} b - Blue value (0-255)
 * @returns {string} The hex color string
 */
function rgbToHex(r, g, b) {
    const toHex = (c) => {
        const hex = c.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}