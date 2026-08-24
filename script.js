// ============================================
// ADMIN PASSWORD
// ============================================
const ADMIN_PASSWORD = 'sarfrazkhan778800.pk';

// ============================================
// PRODUCTS DATA
// ============================================
function loadProducts() {
    try {
        let products = localStorage.getItem('sarfrazProducts');
        if (!products || products === 'undefined' || products === 'null' || products === '') {
            products = [];
            localStorage.setItem('sarfrazProducts', JSON.stringify(products));
            return [];
        }
        return JSON.parse(products);
    } catch(e) {
        return [];
    }
}

function saveProducts(products) {
    try {
        localStorage.setItem('sarfrazProducts', JSON.stringify(products));
        return true;
    } catch(e) {
        alert('⚠️ Error saving products. Storage may be full.');
        return false;
    }
}

// ============================================
// IMAGE HANDLING
// ============================================
let uploadedImages = [];

function handleImageUpload(event) {
    const files = event.target.files;
    const preview = document.getElementById('imagePreview');
    const status = document.getElementById('uploadStatus');
    
    if (!preview || !status) return;
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                uploadedImages.push(e.target.result);
                renderImages(preview, status);
            };
            reader.readAsDataURL(file);
        }
    }
}

function renderImages(preview, status) {
    if (!preview) preview = document.getElementById('imagePreview');
    if (!status) status = document.getElementById('uploadStatus');
    if (!preview) return;
    
    preview.innerHTML = '';
    
    if (uploadedImages.length === 0) {
        if (status) status.textContent = '📸 No images uploaded';
        return;
    }
    
    uploadedImages.forEach((imgSrc, index) => {
        const container = document.createElement('div');
        container.style.cssText = 'position:relative; display:inline-block; margin:4px;';
        
        const img = document.createElement('img');
        img.src = imgSrc;
        img.style.cssText = 'width:70px; height:70px; object-fit:cover; border-radius:8px; border:2px solid #2d2b44;';
        
        const removeBtn = document.createElement('button');
        removeBtn.textContent = '✕';
        removeBtn.style.cssText = `
            position:absolute; top:-6px; right:-6px; 
            background:#ff0000; color:white; border:none; 
            border-radius:50%; width:20px; height:20px; 
            font-size:10px; cursor:pointer; 
            display:flex; align-items:center; justify-content:center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.5);
        `;
        removeBtn.onclick = function(e) {
            e.stopPropagation();
            uploadedImages.splice(index, 1);
            renderImages(preview, status);
        };
        
        container.appendChild(img);
        container.appendChild(removeBtn);
        preview.appendChild(container);
    });
    
    if (status) status.textContent = '✅ ' + uploadedImages.length + ' images uploaded';
}

// ============================================
// CATEGORY NAMES
// ============================================
const categoryNames = {
    'all': '🔥 All Products',
    'consumer-electronics': '📱 Consumer Electronics',
    'phones-telecommunications': '📞 Phones & Telecommunications',
    'computer-office': '💻 Computer & Office',
    'home-appliances': '🏠 Home Appliances',
    'home-improvement': '🔧 Home Improvement',
    'home-garden': '🌿 Home & Garden',
    'furniture': '🪑 Furniture',
    'lights-lighting': '💡 Lights & Lighting',
    'security-protection': '🔒 Security & Protection',
    'automotive': '🚗 Automotive',
    'tools': '🔧 Tools',
    'sports-entertainment': '⚽ Sports & Entertainment',
    'toys-hobbies': '🧸 Toys & Hobbies',
    'office-school': '📚 Office & School Supplies',
    'beauty-health': '💄 Beauty & Health',
    'jewelry-accessories': '💍 Jewelry & Accessories',
    'watches': '⌚ Watches',
    'shoes': '👟 Shoes',
    'luggage-bags': '🧳 Luggage & Bags',
    'underwear': '🩲 Underwear',
    'mother-kids': '👶 Mother & Kids',
    'weddings-events': '💒 Weddings & Events',
    'food': '🍕 Food',
    'fashion': '👗 Fashion',
    'electronic-components': '🔌 Electronic Components'
};

// ============================================
// HOME PAGE
// ============================================
function showProducts(category = 'all') {
    const products = loadProducts();
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    let filtered = products;
    if (category !== 'all') {
        filtered = products.filter(p => p.category === category);
    }

    const title = document.getElementById('categoryTitle');
    if (title) {
        title.textContent = categoryNames[category] || '🔥 All Products';
    }

    if (filtered.length === 0) {
        grid.innerHTML = '<p style="color:#a7a9be; grid-column:1/-1; text-align:center; padding:30px 0;">No products available.</p>';
        return;
    }

    grid.innerHTML = filtered.map(p => {
        const displayPrice = p.displayPrice || p.price || `PKR ${p.originalPrice || 0}`;
        const discountBadge = p.discount > 0 ? `<span class="discount-badge">-${p.discount}%</span>` : '';
        return `
            <div class="product-card" onclick="viewProduct(${p.id})">
                <img src="${p.images && p.images[0] ? p.images[0] : 'https://via.placeholder.com/300x200/2d2b44/FFFFFF?text=No+Image'}" alt="${p.name}">
                <div class="category">${categoryNames[p.category] || p.category}</div>
                <h3>${p.name}</h3>
                <div class="price">${displayPrice}</div>
                ${discountBadge}
            </div>
        `;
    }).join('');
}

function showCategory(category) {
    showProducts(category);
    document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.cat-btn').forEach(btn => {
        const onclick = btn.getAttribute('onclick');
        if (onclick && onclick.includes(category)) {
            btn.classList.add('active');
        }
        if (category === 'all' && btn.textContent.includes('All')) {
            btn.classList.add('active');
        }
    });
}

// ============================================
// SEARCH
// ============================================
function toggleSearch() {
    const bar = document.getElementById('searchBar');
    if (!bar) return;
    bar.style.display = bar.style.display === 'none' ? 'block' : 'none';
    if (bar.style.display === 'block') {
        document.getElementById('searchInput').focus();
    }
}

function searchProducts(query) {
    const products = loadProducts();
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    if (!query.trim()) {
        showProducts('all');
        return;
    }

    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        (categoryNames[p.category] && categoryNames[p.category].toLowerCase().includes(query.toLowerCase()))
    );

    if (filtered.length === 0) {
        grid.innerHTML = '<p style="color:#a7a9be; grid-column:1/-1; text-align:center; padding:30px 0;">No products found.</p>';
        return;
    }

    grid.innerHTML = filtered.map(p => {
        const displayPrice = p.displayPrice || p.price || `PKR ${p.originalPrice || 0}`;
        const discountBadge = p.discount > 0 ? `<span class="discount-badge">-${p.discount}%</span>` : '';
        return `
            <div class="product-card" onclick="viewProduct(${p.id})">
                <img src="${p.images && p.images[0] ? p.images[0] : 'https://via.placeholder.com/300x200/2d2b44/FFFFFF?text=No+Image'}" alt="${p.name}">
                <div class="category">${categoryNames[p.category] || p.category}</div>
                <h3>${p.name}</h3>
                <div class="price">${displayPrice}</div>
                ${discountBadge}
            </div>
        `;
    }).join('');
}

// ============================================
// PRODUCT DETAIL
// ============================================
let currentSlide = 0;
let slideInterval = null;

function viewProduct(id) {
    localStorage.setItem('viewProductId', id);
    window.location.href = 'product.html';
}

function loadProductDetail() {
    const id = parseInt(localStorage.getItem('viewProductId') || 1);
    const products = loadProducts();
    const product = products.find(p => p.id === id);

    if (!product) {
        document.getElementById('productDetail').innerHTML = '<p style="text-align:center;padding:40px 0;">Product not found.</p>';
        return;
    }

    if (slideInterval) {
        clearInterval(slideInterval);
        slideInterval = null;
    }

    const images = product.images && product.images.length > 0 ? product.images : ['https://via.placeholder.com/600x400/2d2b44/FFFFFF?text=No+Image'];

    let imagesHTML = '';

    if (images.length === 1) {
        imagesHTML = `
            <div class="product-main-image">
                <img src="${images[0]}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/600x400/2d2b44/FFFFFF?text=No+Image'">
            </div>
        `;
    } else {
        imagesHTML = `
            <div class="product-slideshow">
                <div class="slideshow-container">
                    <div class="slideshow-track" id="slideshowTrack">
                        ${images.map(img => `
                            <div class="slideshow-slide">
                                <img src="${img}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/600x400/2d2b44/FFFFFF?text=No+Image'">
                            </div>
                        `).join('')}
                    </div>
                    <button class="slideshow-btn prev" onclick="changeSlide(-1)">❮</button>
                    <button class="slideshow-btn next" onclick="changeSlide(1)">❯</button>
                </div>
                <div class="slideshow-dots" id="slideshowDots">
                    ${images.map((_, i) => `
                        <span class="dot ${i === 0 ? 'active' : ''}" onclick="goToSlide(${i})"></span>
                    `).join('')}
                </div>
                <div class="slideshow-counter" id="slideshowCounter">1 / ${images.length}</div>
            </div>
        `;
        currentSlide = 0;
        if (images.length > 1) {
            slideInterval = setInterval(() => {
                changeSlide(1);
            }, 4000);
        }
    }

    const originalPrice = product.originalPrice || 0;
    const nowPrice = product.nowPrice || 0;
    const discount = product.discount || 0;
    const savings = product.savings || 0;

    let priceHTML = '';

    if (nowPrice > 0 && nowPrice < originalPrice) {
        priceHTML = `
            <div class="product-price-section">
                <div class="product-price">PKR ${nowPrice.toLocaleString()}</div>
                <div class="product-original-price">PKR ${originalPrice.toLocaleString()}</div>
                <div class="product-discount">-${discount}%</div>
            </div>
            <div class="product-savings">Save PKR ${savings.toLocaleString()}</div>
        `;
    } else if (originalPrice > 0) {
        priceHTML = `
            <div class="product-price-section">
                <div class="product-price">PKR ${originalPrice.toLocaleString()}</div>
            </div>
        `;
    } else {
        priceHTML = `
            <div class="product-price-section">
                <div class="product-price">${product.price || 'Price not set'}</div>
            </div>
        `;
    }

    const rating = product.rating || 4.5;
    const sold = product.sold || '1K+';
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    let starsHTML = '';
    for (let i = 0; i < fullStars; i++) starsHTML += '⭐';
    if (halfStar) starsHTML += '⭐';
    for (let i = 0; i < 5 - fullStars - halfStar; i++) starsHTML += '☆';

    document.getElementById('productDetail').innerHTML = `
        ${imagesHTML}
        <div class="product-info">
            <div class="product-category">${categoryNames[product.category] || product.category}</div>
            <h1 class="product-title">${product.name}</h1>
            <div class="product-rating">
                <span class="stars">${starsHTML}</span>
                <span class="rating-text">${rating} | ${sold} sold</span>
            </div>
            ${priceHTML}
            <div class="product-description">
                <p>${product.description}</p>
            </div>
            <div class="product-actions">
                <a href="${product.link}" target="_blank" class="btn btn-primary btn-visit">🛒 Visit Store</a>
            </div>
        </div>
    `;

    if (images.length > 1) {
        updateSlideshow(0);
    }
}

// ============================================
// SLIDESHOW FUNCTIONS
// ============================================
function changeSlide(direction) {
    const images = getProductImages();
    if (!images || images.length <= 1) return;
    currentSlide = (currentSlide + direction + images.length) % images.length;
    updateSlideshow(currentSlide);
}

function goToSlide(index) {
    const images = getProductImages();
    if (!images) return;
    currentSlide = Math.min(Math.max(index, 0), images.length - 1);
    updateSlideshow(currentSlide);
}

function getProductImages() {
    const id = parseInt(localStorage.getItem('viewProductId') || 1);
    const products = loadProducts();
    const product = products.find(p => p.id === id);
    return product && product.images && product.images.length > 0 ? product.images : null;
}

function updateSlideshow(index) {
    const track = document.getElementById('slideshowTrack');
    const dots = document.querySelectorAll('.dot');
    const counter = document.getElementById('slideshowCounter');
    const images = getProductImages();
    if (!track || !images) return;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
    if (counter) {
        counter.textContent = `${index + 1} / ${images.length}`;
    }
}

// ============================================
// ADMIN PANEL
// ============================================
function verifyAdmin() {
    const password = document.getElementById('adminPassword').value;
    if (password === ADMIN_PASSWORD) {
        document.getElementById('adminPasswordForm').style.display = 'none';
        document.getElementById('adminContent').style.display = 'block';
        loadAdminProducts();
    } else {
        alert('❌ Wrong password!');
    }
}

// ============================================
// SAVE PRODUCT - FIXED
// ============================================
function saveProduct() {
    console.log('🔵 saveProduct() called');
    
    const id = document.getElementById('editProductId').value;
    const name = document.getElementById('productName').value.trim();
    const category = document.getElementById('productCategory').value;
    const originalPrice = parseFloat(document.getElementById('productOriginalPrice').value.trim()) || 0;
    const nowPrice = parseFloat(document.getElementById('productNowPrice').value.trim()) || 0;
    const link = document.getElementById('productLink').value.trim();
    const description = document.getElementById('productDescription').value.trim();

    // ===== FIX: Better validation =====
    // Check if originalPrice is a valid number
    if (isNaN(originalPrice) || originalPrice <= 0) {
        alert('⚠️ Please enter a valid original price (numbers only, e.g., 3008)');
        return;
    }

    // Check if nowPrice is valid (if entered)
    if (nowPrice < 0 || isNaN(nowPrice)) {
        alert('⚠️ Please enter a valid now price (numbers only)');
        return;
    }

    if (!name) { alert('⚠️ Please enter product name!'); return; }
    if (!link) { alert('⚠️ Please enter affiliate link!'); return; }
    if (!description) { alert('⚠️ Please enter description!'); return; }
    if (uploadedImages.length === 0 && !id) { 
        alert('⚠️ Please upload at least one image!'); 
        return; 
    }

    // Calculate discount
    let discount = 0;
    let savings = 0;
    let displayPrice = `PKR ${originalPrice.toLocaleString()}`;
    let priceToShow = `PKR ${originalPrice.toLocaleString()}`;

    if (nowPrice > 0 && nowPrice < originalPrice) {
        discount = Math.round((1 - nowPrice / originalPrice) * 100);
        savings = originalPrice - nowPrice;
        displayPrice = `PKR ${nowPrice.toLocaleString()}`;
        priceToShow = `PKR ${nowPrice.toLocaleString()}`;
    }

    let products = loadProducts();

    if (id) {
        const index = products.findIndex(p => p.id === parseInt(id));
        if (index !== -1) {
            products[index] = {
                ...products[index],
                name: name,
                category: category,
                originalPrice: originalPrice,
                nowPrice: nowPrice,
                discount: discount,
                savings: savings,
                displayPrice: displayPrice,
                price: priceToShow,
                link: link,
                description: description
            };
            if (uploadedImages.length > 0) {
                products[index].images = uploadedImages.slice();
            }
        } else {
            alert('❌ Product not found!');
            return;
        }
    } else {
        const newProduct = {
            id: Date.now(),
            name: name,
            category: category,
            originalPrice: originalPrice,
            nowPrice: nowPrice,
            discount: discount,
            savings: savings,
            displayPrice: displayPrice,
            price: priceToShow,
            images: uploadedImages.slice(),
            link: link,
            description: description,
            rating: 4.5,
            sold: '1K+'
        };
        products.push(newProduct);
    }

    const saved = saveProducts(products);

    if (saved) {
        alert('✅ Product ' + (id ? 'updated' : 'added') + ' successfully!');
        
        document.getElementById('productName').value = '';
        document.getElementById('productOriginalPrice').value = '';
        document.getElementById('productNowPrice').value = '';
        document.getElementById('productLink').value = '';
        document.getElementById('productDescription').value = '';
        document.getElementById('productImagesInput').value = '';
        document.getElementById('imagePreview').innerHTML = '';
        document.getElementById('uploadStatus').textContent = '';
        uploadedImages = [];
        document.getElementById('editProductId').value = '';
        
        document.getElementById('formTitle').textContent = '➕ Add New Product';
        document.getElementById('addProductBtn').textContent = '✅ Add Product';
        document.getElementById('cancelEditBtn').style.display = 'none';
        
        loadAdminProducts();
        if (document.getElementById('productsGrid')) {
            showProducts('all');
        }
    }
}

// ============================================
// EDIT PRODUCT
// ============================================
function editProduct(id) {
    const products = loadProducts();
    const product = products.find(p => p.id === id);
    if (!product) return;

    document.getElementById('editProductId').value = id;
    document.getElementById('formTitle').textContent = '✏️ Edit Product';
    document.getElementById('addProductBtn').textContent = '💾 Update Product';
    document.getElementById('cancelEditBtn').style.display = 'block';

    document.getElementById('productName').value = product.name;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productOriginalPrice').value = product.originalPrice || '';
    document.getElementById('productNowPrice').value = product.nowPrice || '';
    document.getElementById('productLink').value = product.link;
    document.getElementById('productDescription').value = product.description;

    const preview = document.getElementById('imagePreview');
    preview.innerHTML = '';
    uploadedImages = [];
    
    if (product.images) {
        product.images.forEach(img => {
            uploadedImages.push(img);
        });
        renderImages(preview, document.getElementById('uploadStatus'));
    }

    document.getElementById('addProductForm').scrollIntoView({ behavior: 'smooth' });
}

// ============================================
// CANCEL EDIT
// ============================================
function cancelEdit() {
    clearForm();
    document.getElementById('formTitle').textContent = '➕ Add New Product';
    document.getElementById('addProductBtn').textContent = '✅ Add Product';
    document.getElementById('cancelEditBtn').style.display = 'none';
    document.getElementById('editProductId').value = '';
}

// ============================================
// CLEAR FORM
// ============================================
function clearForm() {
    document.getElementById('productName').value = '';
    document.getElementById('productCategory').value = 'consumer-electronics';
    document.getElementById('productOriginalPrice').value = '';
    document.getElementById('productNowPrice').value = '';
    document.getElementById('productLink').value = '';
    document.getElementById('productDescription').value = '';
    document.getElementById('productImagesInput').value = '';
    document.getElementById('imagePreview').innerHTML = '';
    document.getElementById('uploadStatus').textContent = '';
    uploadedImages = [];
    document.getElementById('editProductId').value = '';
}

// ============================================
// ADMIN PRODUCTS LIST
// ============================================
function loadAdminProducts() {
    const products = loadProducts();
    const list = document.getElementById('adminProductList');
    if (!list) return;

    if (products.length === 0) {
        list.innerHTML = '<p style="color:#a7a9be;">No products yet.</p>';
        return;
    }

    list.innerHTML = products.map(p => {
        const displayPrice = p.displayPrice || p.price || `PKR ${p.originalPrice || 0}`;
        return `
            <div class="admin-product-item">
                <img src="${p.images && p.images[0] ? p.images[0] : 'https://via.placeholder.com/50x50/2d2b44/FFFFFF?text=No+Image'}" alt="${p.name}">
                <div class="info">
                    <h4>${p.name}</h4>
                    <p>${displayPrice} • ${categoryNames[p.category] || p.category}</p>
                    ${p.discount > 0 ? `<span style="color:#00ffc8;font-size:12px;">-${p.discount}% off</span>` : ''}
                </div>
                <div class="actions">
                    <button class="edit-btn" onclick="editProduct(${p.id})">✏️ Edit</button>
                    <button class="delete-btn" onclick="deleteProduct(${p.id})">🗑️ Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

// ============================================
// DELETE PRODUCT
// ============================================
function deleteProduct(id) {
    if (!confirm('Delete this product?')) return;
    let products = loadProducts();
    products = products.filter(p => p.id !== id);
    saveProducts(products);
    loadAdminProducts();
    if (document.getElementById('productsGrid')) {
        showProducts('all');
    }
}

// ============================================
// NAVIGATION
// ============================================
function toggleMenu() {
    document.querySelector('nav')?.classList.toggle('open');
}

// ============================================
// BACKUP FUNCTIONS
// ============================================
function exportProducts() {
    const products = loadProducts();
    const dataStr = JSON.stringify(products, null, 2);
    const blob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products_backup.json';
    a.click();
    URL.revokeObjectURL(url);
    alert('✅ Products exported successfully!');
}

function importProducts(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const products = JSON.parse(e.target.result);
            if (Array.isArray(products)) {
                saveProducts(products);
                alert('✅ Products imported successfully!');
                loadAdminProducts();
                if (document.getElementById('productsGrid')) {
                    showProducts('all');
                }
            } else {
                alert('❌ Invalid file format!');
            }
        } catch(err) {
            alert('❌ Error reading file: ' + err.message);
        }
    };
    reader.readAsText(file);
}

function clearAllProducts() {
    if (confirm('⚠️ Delete ALL products? This cannot be undone!')) {
        if (confirm('Are you sure?')) {
            saveProducts([]);
            loadAdminProducts();
            if (document.getElementById('productsGrid')) {
                showProducts('all');
            }
            alert('✅ All products deleted!');
        }
    }
}

function getStorageInfo() {
    try {
        const products = loadProducts();
        const data = JSON.stringify(products);
        const size = new Blob([data]).size;
        const sizeKB = (size / 1024).toFixed(1);
        const sizeMB = (size / (1024 * 1024)).toFixed(2);
        
        alert(`📊 Storage Info:
        
📦 Products: ${products.length}
💾 Size: ${sizeKB} KB (${sizeMB} MB)
📈 Remaining: ~${(5 - parseFloat(sizeMB)).toFixed(2)} MB

💡 Tip: Keep images small (<100KB each)
`);
    } catch(e) {
        alert('Error getting storage info');
    }
}

// ============================================
// PAGE LOAD
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 Page loaded');
    if (document.getElementById('productsGrid')) {
        showProducts('all');
    }
    if (document.getElementById('productDetail')) {
        loadProductDetail();
    }
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', () => {
            document.querySelector('nav')?.classList.remove('open');
        });
    });
});
// ============================================
// CATEGORIES POPUP
// ============================================
function toggleCategories() {
    const popup = document.getElementById('categoriesPopup');
    if (popup.style.display === 'block') {
        popup.style.display = 'none';
    } else {
        popup.style.display = 'block';
    }
}

function selectCategory(category) {
    showCategory(category);
    document.getElementById('categoriesPopup').style.display = 'none';
}

// Close categories popup when clicking outside
document.addEventListener('click', function(event) {
    const popup = document.getElementById('categoriesPopup');
    const toggleBtn = document.querySelector('.categories-toggle');
    if (popup && toggleBtn) {
        if (!popup.contains(event.target) && !toggleBtn.contains(event.target)) {
            popup.style.display = 'none';
        }
    }
});
