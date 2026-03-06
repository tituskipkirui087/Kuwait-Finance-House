/**
 * KFH Kuwait - Landing Page Script
 * Handles loan calculator, form validation, and interactive features
 */

// ========================================
// Kuwaiti Names Database
// ========================================
const kuwaitiNames = {
    male: [
        "خالد", "أحمد", "محمد", "عبدالله", "فهد", "سعود", "ناصر", "يوسف", "إبراهيم", "علي",
        "محمود", "حسين", "عادل", "جميل", "راشد", "سلطان", "نواف", "صالح", "طارق", "وليد",
        "خليل", "مساعد", "جاسم", "بدر", "عيسى", "مرزوق", "علياء", "فيصل", "مبارك", "رفيق",
        "حمود", "سامي", "عمر", "إسماعيل", "عبد الرحمن", "عبد الوهاب", "مازن", "هيثم", "رشيد", "مطلق",
        "نايف", "منصور", "مهنا", "صقر", "فوزي", "سيف", "عمار", "وائل", "يامن", "بلال",
        "يزن", "توفيق", "نور", "شافي", "عاشور", "فؤاد", "سعيد", "مالك", "إياد", "شعبان",
        "خليفة", "سلطان", "ماجد", "فايز", "جلال", "كمال", "رشاد", "نجيب", "حمد", "فاضل",
        "إدريس", "أسامة", "حمزة", "عبد الغني", "سالم", "منير", "هشام", "وائل", "ساهر", "بشار",
        "رؤوف", "سليمان", "قاسم", "نوح", "إلياس", "أكرم", "حاتم", "شادي", "عمران", "كامل",
        "ناصح", "سعد", "عبد المعطي", "محيي", "ثابت", "راغب", "سعود", "مقبل", "مبارك", "مطرف",
        "عقيل", "نوري", "سليم", "محمود", "فريد", "مصطفي", "حامد", "حسن", "فهد", "عبد الله",
        "مشاري", "بشير", "رامي", "أنس", "ياسر", "صلاح", "إبراهيم", "مصعب", "حاتم", "سفيان",
        "عمر", "عبد العزيز", "عبد الرحيم", "خالد", "أحمد", "محمد", "علي", "حسين", "جعفر", "مهد"
    ],
    female: [
        "فاطمة", "أمينة", "خالد", "نورة", "مريم", "سارة", "ليلى", "هند", "منى", "عبير",
        "جميلة", "رانية", "نجوى", "شيماء", "سمية", "أسماء", "رحمه", "مليكة", "هدى", "بسمة",
        "عزة", "مروة", "رقي", "هالة", "دانة", "جنى", "يارا", "لينا", "سلمى", "حلا",
        "أثير", "نادية", "مريم", "عائشة", "فاطمة", "زينب", "مريم", "كلثوم", "خديجة", "رقية",
        "حورية", "حورية", "علي", "مريم", "فاطمة", "زينب", "حسين", "أحمد", "علي", "محمد",
        "خالد", "عمر", "سعد", "بدر", "ناصر", "فهد", "سعود", "نايف", "سلطان", "مبارك",
        "نوال", "حياة", "فاتن", "سناء", "ناريمان", "شهر", "عفاف", "وردة", "ياسمين", "جوري",
        "سما", "إيلاف", "راما", "دلع", "ملاك", "حنين", "وعد", "بسمة", "ضحى", "اصيل",
        "هبة", "رودينا", "لجين", "ألين", "سار", "تين", "ريما", "جود", "نوف", "لمى",
        "شذى", "وريد", "آسيا", "ديما", "رانيا", "سحر", "سميرة", "نادية", "فاطمة", "مريم",
        "هند", "ملك", "إكرام", "سعاد", "بهية", "ثريا", "فضيلة", "أمينة", "كريمة", "نور",
        "عائشة", "مونية", "مليكة", "آمال", "خولة", "وردية", "جوهرة", "زكية", "صبرينة", "ميمونة",
        "فاتحة", "زهرة", "ليلى", "نادية", "سعاد", "مباركة", "حليمة", "سعيدة", "فاطمة", "مريم"
    ]
};

// Random loan amounts in KWD
const loanAmounts = [100, 250, 500, 750, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 6000, 7000, 8000, 9000, 10000, 12000, 15000, 18000, 20000, 25000, 30000, 35000, 40000, 45000, 50000];

// ========================================
// Loan Approval Notification System
// ========================================
let isNotificationShowing = false;

function createNotification() {
    const container = document.getElementById('notificationContainer');
    if (!container || isNotificationShowing) return;

    // Don't show if there's already a notification
    if (container.children.length > 0) return;
    
    isNotificationShowing = true;

    // Randomly choose male or female
    const gender = Math.random() > 0.5 ? 'male' : 'female';
    const names = kuwaitiNames[gender];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomAmount = loanAmounts[Math.floor(Math.random() * loanAmounts.length)];

    const notification = document.createElement('div');
    notification.className = 'notification-popup';
    notification.innerHTML = `
        <div class="notification-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <path d="M9 12l2 2 4-4"></path>
            </svg>
        </div>
        <div class="notification-content">
            <div class="notification-title">✓ Loan Approved</div>
            <div class="notification-name">${randomName}</div>
            <div class="notification-amount">KWD ${randomAmount.toLocaleString()}</div>
        </div>
    `;

    container.appendChild(notification);

    // Remove after animation completes (4 seconds)
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.5s ease-in forwards';
            setTimeout(() => {
                notification.remove();
                isNotificationShowing = false;
            }, 500);
        }
    }, 4000);
}

function startNotificationSystem() {
    // Initial delay before first notification
    setTimeout(() => {
        createNotification();
        
        // Then show notifications at random intervals between 6-12 seconds
        function scheduleNext() {
            const randomInterval = Math.random() * 6000 + 6000; // 6-12 seconds
            setTimeout(() => {
                createNotification();
                scheduleNext();
            }, randomInterval);
        }
        
        scheduleNext();
    }, 3000); // First notification after 3 seconds
}

// ========================================
// KFH AI Chatbot
// ========================================
function toggleChatbot() {
    const window = document.getElementById('chatbotWindow');
    window.classList.toggle('active');
}

function handleChatbotInput(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function sendMessage() {
    const input = document.getElementById('chatbotInput');
    const message = input.value.trim();
    
    if (message) {
        addMessage(message, 'user');
        input.value = '';
        
        // Simulate AI response
        setTimeout(() => {
            const response = getAIResponse(message);
            addMessage(response, 'bot');
        }, 1000);
    }
}

function addMessage(text, sender) {
    const container = document.getElementById('chatbotMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message ${sender}`;
    
    if (sender === 'bot') {
        messageDiv.innerHTML = `
            <img src="image copy.png" alt="KFH AI" class="message-avatar">
            <div class="message-content">
                <p>${text}</p>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${text}</p>
            </div>
        `;
    }
    
    container.appendChild(messageDiv);
    container.scrollTop = container.scrollHeight;
}

function getAIResponse(message) {
    message = message.toLowerCase();
    
    const responses = {
        'hello': 'Hello! Welcome to KFH Kuwait. How can I assist you with your Islamic financing needs today?',
        'hi': 'Hi there! Welcome to KFH Kuwait. How can I help you?',
        'hey': 'Hey! Welcome to KFH. What can I help you with today?',
        'good morning': 'Good morning! Welcome to KFH Kuwait. How may I assist you?',
        'good evening': 'Good evening! Welcome to KFH. How can I help you?',
        'loan': 'We offer personal financing up to KWD 50,000 with competitive profit rates. Would you like to use our loan calculator or apply now?',
        'finance': 'KFH offers Islamic financing solutions including Personal Finance (up to KWD 50,000), Housing Finance (up to KWD 150,000), and Auto Finance. Which one interests you?',
        'financing': 'KFH provides 100% Sharia-compliant Islamic financing. We have Personal, Housing, and Auto Finance options available.',
        'apply': 'Great! You can apply for a loan by clicking the Apply Now button. The process is simple and takes just a few minutes.',
        'application': 'To apply: 1) Click Apply Now, 2) Fill in your details, 3) Upload documents, 4) Get instant approval!',
        'how to apply': 'You can apply online through our website. Click Apply Now and complete the simple form. Approval within minutes!',
        'what is needed': 'To apply, you need: 1) Valid Civil ID, 2) Salary certificate, 3) Bank statements (3 months), 4) Employment letter. Ready to apply?',
        'what do i need': 'Required documents: Civil ID, Salary certificate, Bank statements (3 months), Employment letter. Would you like more details?',
        'need': 'You need: Civil ID, Salary certificate, Bank statements (3 months), and Employment letter. Shall I explain more?',
        'requirements': 'Eligibility requirements: Kuwait residency, valid civil ID, employed or self-employed, meeting minimum income requirements.',
        'needed': 'For your loan application, you need: Civil ID, salary certificate, 3-month bank statements, and employment verification.',
        'documents': 'Required documents: Civil ID, Salary certificate, Bank statements (3 months), Employment letter. Would you like more details?',
        'document': 'The documents needed are: Civil ID, salary certificate, 3 months bank statements, and employment letter.',
        'id': 'Yes, a valid Civil ID is required for all applicants. It should be Kuwait-issued and not expired.',
        'salary': 'A salary certificate from your employer is required. It should show your monthly income and employment status.',
        'profit rate': 'Our Islamic profit rate starts from 5% APR. The final rate depends on your eligibility and loan amount. Use our calculator for estimates!',
        'rate': 'Our profit rates start from 5% APR. The exact rate depends on your loan amount and repayment period.',
        'interest': 'We follow Islamic banking principles - no interest (riba). Our financing uses profit rates instead.',
        'riba': 'Riba (interest) is prohibited in Islamic banking. KFH offers Sharia-compliant profit-based financing instead.',
        'maximum': 'The maximum personal financing amount is KWD 50,000. For housing finance, we offer up to KWD 150,000.',
        'minimum': 'The minimum loan amount is KWD 100. You can borrow up to KWD 50,000 for personal financing.',
        'amount': 'You can borrow between KWD 100 to KWD 50,000 for personal loans. Use our calculator to find your ideal amount!',
        'period': 'Loan periods range from 6 to 60 months. You can choose the term that best fits your budget.',
        'months': 'Loan terms are available from 6 to 60 months. Shorter terms mean less total profit.',
        'duration': 'You can choose a repayment period between 6 and 60 months based on what works best for your budget.',
        'term': 'Loan terms range from 6 to 60 months. Want me to help you calculate the best option?',
        'approval': 'Our instant approval process means you could get approved within minutes! Funds are typically disbursed the same day.',
        'approved': 'Once approved, funds are usually disbursed on the same day. You will receive notification via SMS and email.',
        'how long': 'Our instant approval system means you could be approved within minutes! The whole process takes just a few minutes.',
        'time': 'The application takes just a few minutes, approval is instant, and funds are disbursed the same day!',
        'sharia': 'All our financing products are 100% Sharia compliant with no interest (riba). We follow Islamic banking principles.',
        'islamic': 'Yes! All KFH products are 100% Sharia-compliant. We follow Islamic banking principles with profit rates, not interest.',
        'halal': 'Absolutely! All our financing is Halal and Sharia-compliant. No riba (interest) involved.',
        'contact': 'You can reach us through the app, or visit any KFH branch. Our team is ready to help!',
        'phone': 'You can contact KFH through their official channels. Visit our website for contact details.',
        'branch': 'KFH has branches across Kuwait. Use our mobile app KFHOnline for 24/7 banking services.',
        'calculator': 'Use our loan calculator on this page to estimate your monthly payments. It is quick and easy!',
        'calculate': 'Check our calculator above to see your estimated monthly payments. Adjust the amount and period to find what works for you.',
        'estimate': 'Our calculator can give you instant estimates. Just slide the amount and period to see your potential payments!',
        'personal': 'Personal financing up to KWD 50,000 with flexible terms. Perfect for weddings, education, or unexpected expenses!',
        'housing': 'Housing finance up to KWD 150,000 for your dream home. 100% Sharia-compliant!',
        'auto': 'Auto finance up to KWD 25,000 for new or used vehicles. Drive your dream car today!',
        'business': 'We offer Small Business financing too. Visit a branch for details on business loans.',
        'help': 'I can help you with: loan applications, eligibility, documents required, profit rates, repayment periods, and more. What would you like to know?',
        'thank': 'You are welcome! Is there anything else I can help you with regarding KFH financing options?',
        'thanks': 'Happy to help! Feel free to ask if you have any more questions about KFH loans.',
        'bye': 'Goodbye! Thank you for choosing KFH Kuwait. We look forward to serving you!',
        'default': 'Thank you for your message! Our team is here to help. Would you like to apply for a loan or speak with a representative?'
    };
    
    for (let key in responses) {
        if (message.includes(key)) {
            return responses[key];
        }
    }
    
    return responses['default'];
}

(function() {
    'use strict';

    // ========================================
    // Loan Calculator - KFH Kuwait
    // ========================================
    const calculator = {
        // Islamic Profit Rate (3.5% APR)
        interestRate: 0.035,
        processingFee: 25,
        
        // DOM Elements
        elements: {
            amountSlider: null,
            amountDisplay: null,
            periodSlider: null,
            periodDisplay: null,
            monthlyPayment: null,
            totalRepayment: null,
            loanTerms: null,
            processingFeeEl: null,
            termButtons: null
        },

        // Initialize calculator
        init: function() {
            // Get elements from index.html
            this.elements.amountSlider = document.getElementById('loanAmount');
            this.elements.amountDisplay = document.getElementById('loanAmountDisplay');
            this.elements.periodInput = document.getElementById('loanPeriodInput');
            this.elements.periodDisplay = document.getElementById('loanPeriodDisplay');
            this.elements.monthlyPayment = document.getElementById('monthlyPayment');
            this.elements.totalRepayment = document.getElementById('totalAmount');
            this.elements.loanTerms = document.getElementById('loanTerms');
            this.elements.processingFeeEl = document.getElementById('processingFee');
            this.elements.termButtons = document.querySelectorAll('.term-btn');

            if (!this.elements.amountSlider) {
                return;
            }

            // Initialize input handlers
            initAmountInput();
            initPeriodInput();

            // Bind events
            this.bindEvents();
            
            // Initial calculation
            this.calculate();
        },

        // Bind event listeners
        bindEvents: function() {
            // Amount slider change
            this.elements.amountSlider.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                this.updateAmountDisplay(value);
                this.updateSliderFill(e.target);
                const input = document.getElementById('loanAmountInput');
                if (input) input.value = value;
                this.calculate();
            });

            // Initialize slider fill on load
            this.updateSliderFill(this.elements.amountSlider);

            // Period input change - handled separately in initPeriodInput

            // Term buttons
            this.elements.termButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    // Remove active class from all
                    this.elements.termButtons.forEach(b => b.classList.remove('active'));
                    // Add active to clicked
                    e.target.classList.add('active');
                    this.calculate();
                });
            });
        },

        // Update slider fill color (like volume button)
        updateSliderFill: function(slider) {
            const min = slider.min || 0;
            const max = slider.max || 100;
            const value = slider.value;
            const percentage = ((value - min) / (max - min)) * 100;
            
            // Create gradient background with filled portion in green
            slider.style.background = `linear-gradient(to right, #009144 0%, #00a854 ${percentage}%, #e0e0e0 ${percentage}%, #e0e0e0 100%)`;
        },

        // Update amount display
        updateAmountDisplay: function(value) {
            if (this.elements.amountDisplay) {
                this.elements.amountDisplay.textContent = value.toLocaleString('en-KW');
            }
        },

        // Update period display
        updatePeriodDisplay: function(value) {
            if (this.elements.periodDisplay) {
                this.elements.periodDisplay.textContent = value;
            }
        },

        // Get selected term
        getSelectedTerm: function() {
            const activeBtn = document.querySelector('.term-btn.active');
            return activeBtn ? parseInt(activeBtn.dataset.term) : 12;
        },

        // Calculate loan
        calculate: function() {
            const amount = parseInt(this.elements.amountSlider.value);
            const termMonths = this.elements.periodInput ? parseInt(this.elements.periodInput.value) : 12;
            const monthlyRate = this.interestRate / 12;

            let monthlyPayment;
            if (monthlyRate === 0) {
                monthlyPayment = amount / termMonths;
            } else {
                const factor = Math.pow(1 + monthlyRate, termMonths);
                monthlyPayment = amount * (monthlyRate * factor) / (factor - 1);
            }

            const totalRepayment = monthlyPayment * termMonths;
            const totalProfit = totalRepayment - amount;

            // Update display
            if (this.elements.monthlyPayment) {
                this.elements.monthlyPayment.textContent = 'KWD ' + Math.round(monthlyPayment).toLocaleString('en-KW');
            }
            if (this.elements.totalRepayment) {
                this.elements.totalRepayment.textContent = 'KWD ' + Math.round(totalRepayment).toLocaleString('en-KW');
            }
            if (this.elements.loanTerms) {
                this.elements.loanTerms.textContent = termMonths + ' Months';
            }
            if (this.elements.processingFeeEl) {
                this.elements.processingFeeEl.textContent = 'KWD ' + this.processingFee;
            }
        }
    };

    // Quick select functions
    function setLoanAmount(amount) {
        const slider = document.getElementById('loanAmount');
        const input = document.getElementById('loanAmountInput');
        if (slider) {
            slider.value = amount;
            document.getElementById('loanAmountDisplay').textContent = amount.toLocaleString('en-KW');
            if (input) input.value = amount;
            calculator.calculate();
        }
    }

    function setLoanPeriod(period) {
        const input = document.getElementById('loanPeriodInput');
        const display = document.getElementById('loanPeriodDisplay');
        if (input) {
            input.value = period;
            if (display) display.textContent = period;
            calculator.calculate();
        }
    }

    // Handle manual amount input
    function initAmountInput() {
        const input = document.getElementById('loanAmountInput');
        if (input) {
            input.addEventListener('input', function() {
                let value = parseInt(this.value);
                if (value < 100) value = 100;
                if (value > 50000) value = 50000;
                const slider = document.getElementById('loanAmount');
                if (slider) {
                    slider.value = value;
                    document.getElementById('loanAmountDisplay').textContent = value.toLocaleString('en-KW');
                }
                calculator.calculate();
            });
        }
    }

    // Handle manual period input
    function initPeriodInput() {
        const input = document.getElementById('loanPeriodInput');
        if (input) {
            input.addEventListener('input', function() {
                let value = parseInt(this.value);
                if (value < 6) value = 6;
                if (value > 60) value = 60;
                const display = document.getElementById('loanPeriodDisplay');
                if (display) display.textContent = value;
                calculator.calculate();
            });
        }
    }

    // Make functions globally available
    window.setLoanAmount = setLoanAmount;
    window.setLoanPeriod = setLoanPeriod;

    // ========================================
    // Initialize on DOM Ready
    // ========================================
    document.addEventListener('DOMContentLoaded', function() {
        calculator.init();
        startNotificationSystem();
    });

})();
