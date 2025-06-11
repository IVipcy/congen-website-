// EmailJS設定
(function() {
    // EmailJSが読み込まれているかチェック
    if (typeof emailjs !== 'undefined') {
        try {
            emailjs.init({
                publicKey: "ndMgdwPPaggGsyp6N",
            });
            console.log('EmailJS v4 initialized successfully with key: ndMgdwPPaggGsyp6N');
        } catch (error) {
            console.error('EmailJS initialization failed:', error);
            // フォールバック：古い方法も試す
            try {
                emailjs.init("ndMgdwPPaggGsyp6N");
                console.log('EmailJS fallback initialization successful');
            } catch (fallbackError) {
                console.error('EmailJS fallback initialization failed:', fallbackError);
            }
        }
    } else {
        console.error('EmailJS not loaded');
    }
})();

// DOM読み込み完了時の処理
document.addEventListener('DOMContentLoaded', function() {
    // スムーズスクロール
    initSmoothScroll();
    
    // スクロールアニメーション
    initScrollAnimations();
    
    // お問い合わせフォーム
    initContactForm();
    
    // ナビゲーションのアクティブ状態
    initNavigation();
    
    // ハンバーガーメニュー
    initHamburgerMenu();
});

// スムーズスクロール
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// スクロールアニメーション
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // アニメーション対象要素
    const animatedElements = document.querySelectorAll('.card, .step, .usecase-item, .partner-item');
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// お問い合わせフォーム
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitButton = this.querySelector('.btn');
            const originalText = submitButton.textContent;
            
            // ボタンを無効化
            submitButton.disabled = true;
            submitButton.textContent = '送信中...';
            submitButton.style.opacity = '0.6';
            
            // フォームデータを取得
            const formData = new FormData(this);
            
            // 詳細なフォームデータのログ
            console.log('Form data raw:');
            for (let [key, value] of formData.entries()) {
                console.log(`${key}: "${value}"`);
            }
            
            const templateParams = {
                from_name: formData.get('name') || '',
                from_email: formData.get('email') || '',
                company_name: formData.get('company') || '',
                phone_number: formData.get('phone') || '',
                message: formData.get('message') || ''
            };
            
            console.log('Template params:', templateParams);
            
            // 必須フィールドのチェック
            if (!templateParams.from_name.trim()) {
                showMessage('お名前を入力してください。', 'error');
                submitButton.disabled = false;
                submitButton.textContent = originalText;
                submitButton.style.opacity = '1';
                return;
            }
            
            if (!templateParams.from_email.trim()) {
                showMessage('メールアドレスを入力してください。', 'error');
                submitButton.disabled = false;
                submitButton.textContent = originalText;
                submitButton.style.opacity = '1';
                return;
            }
            
            if (!templateParams.message.trim()) {
                showMessage('お問い合わせ内容を入力してください。', 'error');
                submitButton.disabled = false;
                submitButton.textContent = originalText;
                submitButton.style.opacity = '1';
                return;
            }
            
            // EmailJSが利用可能かチェック
            if (typeof emailjs === 'undefined') {
                console.error('EmailJS is not available');
                showMessage('EmailJSが読み込まれていません。ページを再読み込みしてください。', 'error');
                submitButton.disabled = false;
                submitButton.textContent = originalText;
                submitButton.style.opacity = '1';
                return;
            }
            
            // EmailJS設定確認
            console.log('Sending with:');
            console.log('Service ID: service_sqp51lf');
            console.log('Template ID: template_rcgbdhf');
            console.log('Public Key: ndMgdwPPaggGsyp6N');
            
            // EmailJSでメール送信
            emailjs.send('service_sqp51lf', 'template_rcgbdhf', templateParams)
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    showMessage('お問い合わせありがとうございます。\n内容を確認次第、ご連絡いたします。', 'success');
                    contactForm.reset();
                })
                .catch(function(error) {
                    console.error('EmailJS FAILED:', error);
                    console.error('Error details:', {
                        status: error.status,
                        text: error.text,
                        message: error.message
                    });
                    
                    let errorMessage = '送信に失敗しました。';
                    if (error.status === 400) {
                        errorMessage += '\nフォームの内容に問題があります。';
                    } else if (error.status === 403) {
                        errorMessage += '\n認証に失敗しました。';
                    } else if (error.status === 404) {
                        errorMessage += '\nサービスまたはテンプレートが見つかりません。';
                    } else if (error.status >= 500) {
                        errorMessage += '\nサーバーエラーが発生しました。';
                    }
                    errorMessage += '\nお手数ですが、もう一度お試しください。';
                    
                    showMessage(errorMessage, 'error');
                })
                .finally(function() {
                    // ボタンを元に戻す
                    submitButton.disabled = false;
                    submitButton.textContent = originalText;
                    submitButton.style.opacity = '1';
                });
        });
    }
}

// メッセージ表示
function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        max-width: 300px;
        font-size: 14px;
        line-height: 1.4;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    messageDiv.textContent = message;
    
    document.body.appendChild(messageDiv);
    
    // アニメーション表示
    setTimeout(() => {
        messageDiv.style.transform = 'translateX(0)';
    }, 100);
    
    // 5秒後に削除
    setTimeout(() => {
        messageDiv.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 300);
    }, 5000);
}

// ナビゲーションのアクティブ状態
function initNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || 
            (currentPage === '' && href === 'index.html') ||
            (currentPage === 'index.html' && href === 'index.html')) {
            link.style.color = 'var(--main-color)';
            link.style.fontWeight = '700';
        }
    });
}

// ページトップへのスクロール
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ページトップボタン
function initScrollToTop() {
    const scrollButton = document.createElement('button');
    scrollButton.innerHTML = '↑';
    scrollButton.className = 'scroll-to-top';
    scrollButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--main-color);
        color: white;
        border: none;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    `;
    
    scrollButton.addEventListener('click', scrollToTop);
    document.body.appendChild(scrollButton);
    
    // スクロール位置に応じて表示/非表示
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollButton.style.opacity = '1';
            scrollButton.style.visibility = 'visible';
        } else {
            scrollButton.style.opacity = '0';
            scrollButton.style.visibility = 'hidden';
        }
    });
}

// ハンバーガーメニュー
function initHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav');
    
    if (hamburger && nav) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            nav.classList.toggle('active');
        });
        
        // メニューリンクをクリックしたらメニューを閉じる
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
            });
        });
        
        // ウィンドウリサイズ時にメニューを閉じる
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
            }
        });
        
        // メニュー外クリック時に閉じる
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !nav.contains(e.target)) {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
            }
        });
    }
}

// ページトップボタンを初期化
document.addEventListener('DOMContentLoaded', function() {
    initScrollToTop();
}); 