// Exchange Rate API URL
const API_URL = 'https://open.er-api.com/v6/latest';

// DOM Elements
const amountInput = document.getElementById('amount');
const fromSelect = document.getElementById('fromCurrency');
const toSelect = document.getElementById('toCurrency');
const form = document.getElementById('converter-form');
const resultDiv = document.getElementById('result');

// Currencies Load karne aur Dropdowns me fill karne ke liye function
async function initializeCurrencies() {
    try {
        resultDiv.textContent = 'Loading currencies...';
        
        // Base rates fetch karein
        const response = await fetch(`${API_URL}/USD`);
        const data = await response.json();

        if (data.result === 'success') {
            const currencies = Object.keys(data.rates).sort();
            
            // Dropdown options populate karein
            populateDropdown(fromSelect, currencies, 'USD');
            populateDropdown(toSelect, currencies, 'INR');
            
            resultDiv.textContent = 'Enter amount and click Convert';
        } else {
            resultDiv.textContent = 'Failed to load exchange rates.';
        }
    } catch (error) {
        console.error('Error fetching currencies:', error);
        resultDiv.textContent = 'Error connecting to currency service.';
    }
}

// Dropdown populate karne ka helper function
function populateDropdown(selectElement, currencies, defaultValue) {
    selectElement.innerHTML = '';
    currencies.forEach(currency => {
        const option = document.createElement('option');
        option.value = currency;
        option.textContent = currency;
        if (currency === defaultValue) {
            option.selected = true;
        }
        selectElement.appendChild(option);
    });
}

// Form Submission / Currency Convert Handle karna
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const amount = parseFloat(amountInput.value);
    const fromCurrency = fromSelect.value;
    const toCurrency = toSelect.value;

    if (isNaN(amount) || amount <= 0) {
        resultDiv.textContent = 'Please enter a valid amount.';
        return;
    }

    resultDiv.textContent = 'Converting...';

    try {
        // Selected "From" currency ke basis par rate fetch karein
        const response = await fetch(`${API_URL}/${fromCurrency}`);
        const data = await response.json();

        if (data.result === 'success') {
            const rate = data.rates[toCurrency];
            const convertedAmount = (amount * rate).toFixed(2);
            
            resultDiv.textContent = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
        } else {
            resultDiv.textContent = 'Conversion failed. Please try again.';
        }
    } catch (error) {
        console.error('Error during conversion:', error);
        resultDiv.textContent = 'Error fetching conversion rate.';
    }
});

// Page load hone par application initialize karein
initializeCurrencies();
