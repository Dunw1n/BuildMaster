export class TabSwitcher {
    constructor(containerSelector = '.product-gallery') {
        this.container = document.querySelector(containerSelector);
        this.mainImage = null;
        this.thumbItems = [];
        this.init();
    }

    init() {
        if (!this.container) {
            console.warn('Контейнер галереи не найден');
            return;
        }

        this.mainImage = this.container.querySelector('#mainImage');
        this.thumbItems = this.container.querySelectorAll('.thumb-item');
        
        if (!this.mainImage || this.thumbItems.length === 0) {
            console.warn('Элементы галереи не найдены');
            return;
        }

        this.addEventListeners();
        this.addStyles();
    }

    addEventListeners() {
        this.thumbItems.forEach(item => {
            // Клик мышью
            item.addEventListener('click', (e) => this.switchImage(e, item));
            
            // Доступность с клавиатуры
            item.setAttribute('tabindex', '0');
            item.addEventListener('keydown', (e) => this.handleKeyDown(e, item));
        });
    }

    switchImage(event, targetItem) {
        // Если элемент уже активен - ничего не делаем
        if (targetItem.classList.contains('active')) {
            return;
        }

        // Добавляем анимацию исчезновения
        this.mainImage.style.opacity = '0';

        setTimeout(() => {
            // Снимаем активный класс со всех превью
            this.thumbItems.forEach(item => {
                item.classList.remove('active');
            });

            // Добавляем активный класс текущему превью
            targetItem.classList.add('active');

            // Меняем главное изображение
            const newImageSrc = targetItem.getAttribute('data-image');
            if (newImageSrc) {
                this.mainImage.src = newImageSrc;
                
                // Обновляем alt текст
                const thumbImg = targetItem.querySelector('img');
                if (thumbImg) {
                    this.mainImage.alt = thumbImg.alt;
                }
            }

            // Плавное появление нового изображения
            this.mainImage.style.opacity = '1';
        }, 200);
    }

    handleKeyDown(event, item) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.switchImage(event, item);
        }
        
        // Опционально: навигация стрелками
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
            event.preventDefault();
            this.navigateWithArrows(event.key, item);
        }
    }

    navigateWithArrows(direction, currentItem) {
        const currentIndex = Array.from(this.thumbItems).indexOf(currentItem);
        let nextIndex;

        if (direction === 'ArrowRight') {
            nextIndex = (currentIndex + 1) % this.thumbItems.length;
        } else if (direction === 'ArrowLeft') {
            nextIndex = (currentIndex - 1 + this.thumbItems.length) % this.thumbItems.length;
        }

        const nextItem = this.thumbItems[nextIndex];
        nextItem.focus();
        this.switchImage(null, nextItem);
    }

    addStyles() {
        // Добавляем стили для анимации, если их еще нет
        if (!document.querySelector('#tab-switcher-styles')) {
            const style = document.createElement('style');
            style.id = 'tab-switcher-styles';
            style.textContent = `
                .thumb-item {
                    cursor: pointer;
                    border: 2px solid transparent;
                    border-radius: 4px;
                    overflow: hidden;
                    transition: all 0.3s ease;
                }
                
                .thumb-item:hover {
                    border-color: #ccc;
                    transform: translateY(-2px);
                }
                
                .thumb-item.active {
                    border-color: #007bff;
                }
                
                .thumb-item:focus {
                    outline: 2px solid #007bff;
                    outline-offset: 2px;
                }
                
                #mainImage {
                    transition: opacity 0.3s ease;
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Метод для принудительного переключения на определенное изображение
    switchToIndex(index) {
        if (index >= 0 && index < this.thumbItems.length) {
            const item = this.thumbItems[index];
            this.switchImage(null, item);
        }
    }

    // Метод для получения текущего активного индекса
    getActiveIndex() {
        return Array.from(this.thumbItems).findIndex(item => 
            item.classList.contains('active')
        );
    }

    // Метод для уничтожения экземпляра (очистка событий)
    destroy() {
        this.thumbItems.forEach(item => {
            const clone = item.cloneNode(true);
            item.parentNode.replaceChild(clone, item);
        });
        
        const styles = document.querySelector('#tab-switcher-styles');
        if (styles) {
            styles.remove();
        }
    }
}

// Экспорт по умолчанию для удобства
export default TabSwitcher;