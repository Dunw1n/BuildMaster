import TabSwitcher from "./TabSwitcher";
// import { CallModal } from "./Modal";

class BuildMasterApp {
    constructor() {
        this.init();
    }

    init() {
        this.initMobileMenu();
        this.initTabs();
        this.initSlider();
        this.initForms();
        this.initSmoothScroll();
        this.initAnimations();
        this.bindEvents();
        this.initModal();
    }

    initMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const nav = document.querySelector('.nav'); 
        const navOverlay = document.querySelector('.nav-overlay'); 

        if (!mobileMenuBtn || !nav || !navOverlay) return;

        mobileMenuBtn.addEventListener('click', () => {
            const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
            mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
            nav.classList.toggle('active');
            navOverlay.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        navOverlay.addEventListener('click', () => {
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            nav.classList.remove('active');
            navOverlay.classList.remove('active');
            document.body.classList.remove('menu-open');
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (nav.classList.contains('active')) {
                    mobileMenuBtn.setAttribute('aria-expanded', 'false');
                    nav.classList.remove('active');
                    navOverlay.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            });
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 767 && nav.classList.contains('active')) {
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                nav.classList.remove('active');
                navOverlay.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }

    initTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.dataset.tab;
                
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                btn.classList.add('active');
                document.getElementById(tabId).classList.add('active');
            });
        });
    }

    initSlider() {
        if (typeof Swiper !== 'undefined' && document.querySelector('.swiper')) {
            this.swiper = new Swiper('.swiper', {
                loop: true,
                speed: 800,
                autoplay: {
                    delay: 5000,
                    disableOnInteraction: false,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                effect: 'slide',
                grabCursor: true,
                on: {
                    init: function() {
                        const activeSlide = this.slides[this.activeIndex];
                        if (activeSlide) {
                            const slideContent = activeSlide.querySelector('.slide-content');
                            if (slideContent) {
                                slideContent.style.opacity = '1';
                                slideContent.style.transform = 'translateY(0)';
                            }
                        }
                    },
                    slideChangeTransitionStart: function() {
                        this.slides.forEach(slide => {
                            const slideContent = slide.querySelector('.slide-content');
                            if (slideContent) {
                                slideContent.style.opacity = '0';
                                slideContent.style.transform = 'translateY(20px)';
                            }
                        });
                    },
                    slideChangeTransitionEnd: function() {
                        const activeSlide = this.slides[this.activeIndex];
                        if (activeSlide) {
                            const slideContent = activeSlide.querySelector('.slide-content');
                            if (slideContent) {
                                slideContent.style.opacity = '1';
                                slideContent.style.transform = 'translateY(0)';
                            }
                        }
                    }
                }
            });
        }
    }

    initForms() {
        const subscribeForm = document.getElementById('subscribeForm');
        if (subscribeForm) {
            subscribeForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const emailInput = subscribeForm.querySelector('.newsletter-input');
                const email = emailInput.value;
                
                if (!email || !this.validateEmail(email)) {
                    this.showNotification('Пожалуйста, введите корректный email', 'error');
                    return;
                }
                
                emailInput.value = '';
                
                const submitBtn = subscribeForm.querySelector('button');
                const originalHtml = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Успешно!';
                submitBtn.style.background = 'var(--success)';
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalHtml;
                    submitBtn.style.background = '';
                }, 2000);
                
                this.showNotification(`Спасибо за подписку! На адрес ${email} отправлено письмо с подтверждением.`, 'success');
            });
        }
    }

    initModal() {
        try {
            this.modal = new CallModal();
            console.log('Модальное окно инициализировано');
        } catch (error) {
            console.error('Ошибка при инициализации модального окна:', error);
        }
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = anchor.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
                    const nav = document.querySelector('.nav');
                    const navOverlay = document.querySelector('.nav-overlay');
                    
                    if (nav && nav.classList.contains('active')) {
                        mobileMenuBtn.setAttribute('aria-expanded', 'false');
                        nav.classList.remove('active');
                        navOverlay.classList.remove('active');
                        document.body.classList.remove('menu-open');
                    }
                    
                    const headerHeight = document.getElementById('header')?.offsetHeight || 80;
                    window.scrollTo({
                        top: targetElement.offsetTop - headerHeight,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    initAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, observerOptions);

            document.querySelectorAll('.category-card, .tab-item, .product-card').forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                observer.observe(el);
            });
        }
    }

    bindEvents() {
        document.addEventListener('click', (e) => {
            const viewDetailsBtn = e.target.closest('.view-details');
            if (viewDetailsBtn) {
                const productCard = viewDetailsBtn.closest('.product-card');
                const productName = productCard?.querySelector('.product-title')?.textContent || 'Товар';
                this.showNotification(`Страница товара "${productName}" в разработке`);
            }

            const categoryLink = e.target.closest('.category-link');
            if (categoryLink) {
                e.preventDefault();
                this.showNotification('Категория товаров в разработке');
            }

            const heroBtn = e.target.closest('.hero-buttons .btn');
            if (heroBtn && heroBtn.getAttribute('href') === '#contact') {
                e.preventDefault();
                this.showNotification('Наш менеджер свяжется с вами для консультации');
            }
        });
    }

    showNotification(message, type = 'info') {
        const existingToast = document.querySelector('.notification-toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = 'notification-toast';
        toast.textContent = message;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');

        if (type === 'success') {
            toast.style.background = 'var(--success)';
        } else if (type === 'error') {
            toast.style.background = '#ef4444';
        } else {
            toast.style.background = 'var(--primary)';
        }

        toast.style.cssText += `
            position: fixed;
            bottom: 20px;
            right: 20px;
            color: white;
            padding: 16px 24px;
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-xl);
            z-index: 10000;
            max-width: 350px;
            opacity: 0;
            transform: translateX(100%);
            transition: opacity 0.3s ease, transform 0.3s ease;
        `;

        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(0)';
        });

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);

        toast.addEventListener('click', () => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new BuildMasterApp();
    console.log('BuildMaster app initialized!');

    const galleryTabs = new TabSwitcher('.product-gallery');
});


export { BuildMasterApp };