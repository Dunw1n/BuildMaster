
import { BuildMasterApp } from './main.js';

class ProductPage extends BuildMasterApp {
    constructor() {
        super(); 
        this.initProductFeatures();
    }

    initProductFeatures() {
        this.initGallery();
        this.initQuantitySelector();
        this.initProductForms();
    }

    initGallery() {
        const mainImage = document.getElementById('mainImage');
        const thumbItems = document.querySelectorAll('.thumb-item');

        if (!mainImage || !thumbItems.length) return;

        thumbItems.forEach(thumb => {
            thumb.addEventListener('click', () => {
                thumbItems.forEach(item => item.classList.remove('active'));
                
                thumb.classList.add('active');
                
                // Меняем основное изображение
                const newImage = thumb.dataset.image;
                mainImage.src = newImage;
                mainImage.alt = thumb.querySelector('img').alt;
            });
        });
    }

    initQuantitySelector() {
        const minusBtn = document.querySelector('.qty-btn.minus');
        const plusBtn = document.querySelector('.qty-btn.plus');
        const qtyInput = document.querySelector('.qty-input');

        if (!minusBtn || !plusBtn || !qtyInput) return;

        minusBtn.addEventListener('click', () => {
            let value = parseInt(qtyInput.value);
            if (value > 1) {
                qtyInput.value = value - 1;
            }
        });

        plusBtn.addEventListener('click', () => {
            let value = parseInt(qtyInput.value);
            const max = parseInt(qtyInput.max) || 100;
            if (value < max) {
                qtyInput.value = value + 1;
            }
        });

        qtyInput.addEventListener('change', () => {
            let value = parseInt(qtyInput.value);
            const min = parseInt(qtyInput.min) || 1;
            const max = parseInt(qtyInput.max) || 100;
            
            if (isNaN(value) || value < min) {
                qtyInput.value = min;
            } else if (value > max) {
                qtyInput.value = max;
            }
        });
    }


    initProductForms() {
        // Консультация в футере
        const consultFooterBtn = document.getElementById('consultFooterBtn');
        if (consultFooterBtn) {
            consultFooterBtn.addEventListener('click', () => {
                this.showNotification('Наш специалист свяжется с вами в течение 15 минут!', 'success');
            });
        }
    }
}

// Инициализация страницы товара при загрузке DOM   
// document.addEventListener('DOMContentLoaded', () => {
//     // Проверяем, находимся ли мы на странице товара
//     if (document.querySelector('.product-main') || 
//         window.location.pathname.includes('product.html')) {
        
//         const productPage = new ProductPage();
//         console.log('Product page initialized!');
//     }
// });

export { ProductPage };