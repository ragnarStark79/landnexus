// js/components/tax-payment.js
document.addEventListener('DOMContentLoaded', () => {
    // Initialize icons
    lucide.createIcons();

    // DOM Elements
    const elements = {
        taxForm: document.getElementById('tax-form'),
        propertyId: document.getElementById('property-id'),
        propertyValue: document.getElementById('property-value'),
        propertyType: document.getElementById('property-type'),
        taxYear: document.getElementById('tax-year'),
        calculateBtn: document.getElementById('calculate-btn'),
        taxResult: document.getElementById('tax-result'),
        taxAmount: document.getElementById('tax-amount'),
        displayTaxYear: document.getElementById('display-tax-year'),
        proceedPaymentBtn: document.getElementById('proceed-payment-btn'),
        paymentInfo: document.getElementById('payment-info'),
        paymentAmount: document.getElementById('payment-amount'),
        paymentDisplayAmount: document.getElementById('payment-display-amount'),
        paymentDisplayId: document.getElementById('payment-display-id'),
        cardDetails: document.getElementById('card-details'),
        nameOnCard: document.getElementById('name-on-card'),
        cardNumber: document.getElementById('card-number'),
        expiryDate: document.getElementById('expiry-date'),
        cvv: document.getElementById('cvv'),
        backBtn: document.getElementById('back-btn'),
        completePaymentBtn: document.getElementById('complete-payment-btn'),
        paymentReceipt: document.getElementById('payment-receipt'),
        receiptPropertyId: document.getElementById('receipt-property-id'),
        receiptAmount: document.getElementById('receipt-amount'),
        receiptDate: document.getElementById('receipt-date'),
        receiptTaxYear: document.getElementById('receipt-tax-year'),
        receiptNumber: document.getElementById('receipt-number'),
        printReceiptBtn: document.getElementById('print-receipt-btn'),
        payAnotherTaxBtn: document.getElementById('pay-another-tax-btn'),
        taxCalculator: document.getElementById('tax-calculator'),
        headerContent: document.getElementById('header-content')
    };

    // Make sure header content is visible
    if (elements.headerContent) {
        elements.headerContent.style.display = 'block';
    }

    // Mock tax rates based on property type
    const TAX_RATES = {
        Residential: 1.2, // 1.2% of property value
        Commercial: 2.0   // 2.0% of property value
    };

    // Enhanced animations and feedback
    const animations = {
        fadeIn: (element, delay = 0) => {
            if (element) {
                element.style.opacity = '0';
                element.style.display = 'block';
                element.style.animation = `fadeIn 0.4s ease-out ${delay}s forwards`;
                setTimeout(() => {
                    element.style.opacity = '1';
                }, delay * 1000 + 400);
            }
        },
        slideUp: (element, delay = 0) => {
            if (element) {
                element.style.opacity = '0';
                element.style.transform = 'translateY(20px)';
                element.style.display = 'block';
                element.style.animation = `slideUp 0.5s ease-out ${delay}s forwards`;
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, delay * 1000 + 500);
            }
        },
        buttonFeedback: (button) => {
            if (button) {
                button.classList.add('scale-95', 'opacity-90');
                setTimeout(() => {
                    button.classList.remove('scale-95', 'opacity-90');
                }, 150);
            }
        }
    };

    // Store the calculated tax value globally
    let calculatedTaxAmount = 0;

    // Format currency
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(value);
    };

    // Format card number with spaces
    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];

        for (let i = 0; i < match.length; i += 4) {
            parts.push(match.substring(i, i + 4));
        }

        if (parts.length) {
            return parts.join(' ');
        } else {
            return value;
        }
    };

    // Format expiry date
    const formatExpiryDate = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');

        if (v.length >= 2) {
            return v.substring(0, 2) + (v.length > 2 ? '/' + v.substring(2, 4) : '');
        }

        return v;
    };

    // Calculate tax based on property value and type
    function calculateTax(value, type) {
        const rate = TAX_RATES[type] || TAX_RATES.Residential; // Default to Residential rate
        return value * (rate / 100);
    }

    // Validate form inputs with enhanced feedback
    function validateFormInputs(inputs) {
        let isValid = true;
        let firstInvalidField = null;

        Object.entries(inputs).forEach(([key, input]) => {
            if (!input) return; // Skip if element not found

            const value = input.value.trim();

            if (value === '') {
                input.classList.add('border-red-500');
                input.classList.remove('border-neutral-300', 'border-primary');

                // Create or update error message
                let errorMsg = input.parentNode.querySelector('.error-message');
                if (!errorMsg) {
                    errorMsg = document.createElement('p');
                    errorMsg.className = 'error-message text-red-500 text-xs mt-1';
                    input.parentNode.appendChild(errorMsg);
                }
                errorMsg.textContent = 'This field is required';

                if (!firstInvalidField) firstInvalidField = input;
                isValid = false;
            } else {
                input.classList.remove('border-red-500');
                input.classList.add('border-neutral-300');

                // Remove error message if exists
                const errorMsg = input.parentNode.querySelector('.error-message');
                if (errorMsg) errorMsg.remove();
            }
        });

        if (firstInvalidField) {
            firstInvalidField.focus();
        }

        return isValid;
    }

    // Handle tax calculation with improved animation
    function handleTaxCalculation() {
        // Validate form inputs
        if (!validateFormInputs({
            propertyId: elements.propertyId,
            propertyValue: elements.propertyValue,
            propertyType: elements.propertyType,
            taxYear: elements.taxYear
        })) {
            showToast('Please fill in all required fields.', 'error');
            return;
        }

        // Validate property value
        const value = parseFloat(elements.propertyValue.value);
        if (isNaN(value) || value <= 0) {
            elements.propertyValue.classList.add('border-red-500');
            showToast('Please enter a valid property value.', 'error');
            return;
        }

        // Calculate tax
        const type = elements.propertyType.value;
        const tax = calculateTax(value, type);
        calculatedTaxAmount = tax; // Store the tax amount globally

        // Button feedback
        animations.buttonFeedback(elements.calculateBtn);

        // Show loading state
        elements.calculateBtn.disabled = true;
        const originalBtnText = elements.calculateBtn.innerHTML;
        elements.calculateBtn.innerHTML = `
            <svg class="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Calculating...
        `;

        // Simulate API call with slight delay
        setTimeout(() => {
            // Update UI with calculated tax
            elements.taxAmount.textContent = formatCurrency(tax);
            elements.displayTaxYear.textContent = elements.taxYear.value;

            // Reset button state
            elements.calculateBtn.disabled = false;
            elements.calculateBtn.innerHTML = originalBtnText;

            // Show result with animation
            elements.taxResult.classList.remove('hidden');
            animations.slideUp(elements.taxResult);

            showToast('Tax calculated successfully!', 'success');
        }, 800);
    }

    // Handle payment completion with enhanced animation
    function handlePaymentCompletion() {
        if (!validateFormInputs({
            nameOnCard: elements.nameOnCard,
            cardNumber: elements.cardNumber,
            expiryDate: elements.expiryDate,
            cvv: elements.cvv
        })) {
            showToast('Please fill in all payment details.', 'error');
            return;
        }

        // Button feedback
        animations.buttonFeedback(elements.completePaymentBtn);

        // Show loading state
        elements.completePaymentBtn.disabled = true;
        const originalBtnText = elements.completePaymentBtn.innerHTML;
        elements.completePaymentBtn.innerHTML = `
            <svg class="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
        `;

        // Simulate payment processing
        setTimeout(() => {
            elements.paymentInfo.classList.add('hidden');
            elements.paymentReceipt.classList.remove('hidden');
            animations.fadeIn(elements.paymentReceipt);

            // Update receipt information
            elements.receiptPropertyId.textContent = elements.propertyId.value;
            elements.receiptAmount.textContent = formatCurrency(calculatedTaxAmount).replace('$', '');
            elements.receiptDate.textContent = new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            elements.receiptTaxYear.textContent = elements.taxYear.value;
            elements.receiptNumber.textContent = `TX-${Math.floor(100000 + Math.random() * 900000)}`;

            // Reset button state
            elements.completePaymentBtn.disabled = false;
            elements.completePaymentBtn.innerHTML = originalBtnText;

            showToast('Payment completed successfully!', 'success');
        }, 1500);
    }

    // Enhanced toast notification function
    function showToast(message, type = 'info') {
        const container = document.getElementById('toast-container') || createToastContainer();

        // Create toast element
        const toast = document.createElement('div');
        toast.className = `flex items-center p-4 mb-4 rounded-lg shadow-md animate-fade-in max-w-xs`;

        // Set background color based on type
        if (type === 'success') {
            toast.classList.add('bg-green-50', 'border-l-4', 'border-green-500', 'text-green-800');
            toast.innerHTML = `
                <svg class="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
            `;
        } else if (type === 'error') {
            toast.classList.add('bg-red-50', 'border-l-4', 'border-red-500', 'text-red-800');
            toast.innerHTML = `
                <svg class="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            `;
        } else {
            toast.classList.add('bg-blue-50', 'border-l-4', 'border-blue-500', 'text-blue-800');
            toast.innerHTML = `
                <svg class="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            `;
        }

        // Add message to toast
        toast.innerHTML += `<span>${message}</span>`;

        // Add toast to container
        container.appendChild(toast);

        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-10px)';
            toast.style.transition = 'opacity 0.3s, transform 0.3s';

            setTimeout(() => {
                container.removeChild(toast);
            }, 300);
        }, 3000);
    }

    // Create toast container if it doesn't exist
    function createToastContainer() {
        const container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'fixed top-4 right-4 z-50';
        document.body.appendChild(container);
        return container;
    }

    // Set up payment method selector
    const setupPaymentMethodSelectors = () => {
        const paymentMethods = document.querySelectorAll('.payment-method-selector');

        paymentMethods.forEach(method => {
            method.addEventListener('click', () => {
                // Remove selected class from all methods
                paymentMethods.forEach(m => m.classList.remove('selected'));

                // Add selected class to clicked method
                method.classList.add('selected');

                // Select the radio input
                const radio = method.querySelector('input[type="radio"]');
                if (radio) radio.checked = true;
            });
        });
    };

    // Format inputs
    const setupInputFormatting = () => {
        // Card number formatting
        if (elements.cardNumber) {
            elements.cardNumber.addEventListener('input', (e) => {
                e.target.value = formatCardNumber(e.target.value);
            });
        }

        // Expiry date formatting
        if (elements.expiryDate) {
            elements.expiryDate.addEventListener('input', (e) => {
                e.target.value = formatExpiryDate(e.target.value);
            });
        }
    };

    // Ensure the header content is visible
    const initializeHeaderContent = () => {
        // Find all header elements by their class
        const headerElements = document.querySelectorAll('.header-element');
        headerElements.forEach(el => {
            el.style.display = 'flex';
            el.style.opacity = '1';
        });

        // Also ensure specific elements for secure payment and timing are visible
        const securePaymentEl = document.querySelector('.secure-payment-label');
        const timingEl = document.querySelector('.timing-label');

        if (securePaymentEl) securePaymentEl.style.display = 'flex';
        if (timingEl) timingEl.style.display = 'flex';
    };

    // Event Listeners
    if (elements.taxForm) {
        elements.taxForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleTaxCalculation();
        });
    }

    if (elements.proceedPaymentBtn) {
        elements.proceedPaymentBtn.addEventListener('click', () => {
            animations.buttonFeedback(elements.proceedPaymentBtn);

            setTimeout(() => {
                // Ensure we have elements before trying to manipulate them
                if (elements.taxCalculator) elements.taxCalculator.classList.add('hidden');
                if (elements.paymentInfo) {
                    elements.paymentInfo.classList.remove('hidden');
                    animations.fadeIn(elements.paymentInfo);
                }

                // Update payment information with the calculated tax amount
                const formattedAmount = formatCurrency(calculatedTaxAmount).replace('$', '');

                if (elements.paymentAmount) elements.paymentAmount.textContent = formattedAmount;
                if (elements.paymentDisplayAmount) elements.paymentDisplayAmount.textContent = formattedAmount;
                if (elements.paymentDisplayId && elements.propertyId) {
                    elements.paymentDisplayId.textContent = elements.propertyId.value;
                }
            }, 150);
        });
    }

    if (elements.backBtn) {
        elements.backBtn.addEventListener('click', () => {
            animations.buttonFeedback(elements.backBtn);

            setTimeout(() => {
                if (elements.paymentInfo) elements.paymentInfo.classList.add('hidden');
                if (elements.taxCalculator) {
                    elements.taxCalculator.classList.remove('hidden');
                    animations.fadeIn(elements.taxCalculator);
                }
            }, 150);
        });
    }

    if (elements.completePaymentBtn) {
        elements.completePaymentBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handlePaymentCompletion();
        });
    }

    if (elements.printReceiptBtn) {
        elements.printReceiptBtn.addEventListener('click', () => {
            animations.buttonFeedback(elements.printReceiptBtn);
            setTimeout(() => {
                window.print();
                showToast('Receipt printed successfully.', 'success');
            }, 150);
        });
    }

    if (elements.payAnotherTaxBtn) {
        elements.payAnotherTaxBtn.addEventListener('click', () => {
            animations.buttonFeedback(elements.payAnotherTaxBtn);

            setTimeout(() => {
                if (elements.paymentReceipt) elements.paymentReceipt.classList.add('hidden');
                if (elements.taxCalculator) {
                    elements.taxCalculator.classList.remove('hidden');
                    animations.fadeIn(elements.taxCalculator);
                }

                // Reset form
                if (elements.taxForm) elements.taxForm.reset();
                if (elements.taxResult) elements.taxResult.classList.add('hidden');

                showToast('Ready to process another payment.', 'info');
            }, 150);
        });
    }

    // Setup input field effects
    document.querySelectorAll('.form-input').forEach(input => {
        input.addEventListener('focus', () => {
            input.classList.add('border-primary');
        });

        input.addEventListener('blur', () => {
            input.classList.remove('border-primary');
        });
    });

    // Initialize components
    setupPaymentMethodSelectors();
    setupInputFormatting();
    initializeHeaderContent(); // Make sure header content is visible
});