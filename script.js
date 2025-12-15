document.addEventListener('DOMContentLoaded', function() {
    const bookingForm = document.getElementById('bookingForm');
    const confirmationDiv = document.getElementById('confirmation');
    const newBookingBtn = document.getElementById('newBooking');
    const dateInput = document.getElementById('date');

    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);

    // Form submission handler
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(bookingForm);
        const bookingData = {};
        formData.forEach((value, key) => {
            bookingData[key] = value;
        });

        // Validate form
        if (validateForm(bookingData)) {
            // Display confirmation
            displayConfirmation(bookingData);
        }
    });

    // New booking button handler
    newBookingBtn.addEventListener('click', function() {
        confirmationDiv.classList.add('hidden');
        bookingForm.classList.remove('hidden');
        bookingForm.reset();
    });

    // Form validation
    function validateForm(data) {
        // Validate phone number format
        const phoneRegex = /^[\d\s\-\(\)]+$/;
        if (!phoneRegex.test(data.phone)) {
            alert('Please enter a valid phone number');
            return false;
        }

        // Validate email format (browser handles this, but double check)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            alert('Please enter a valid email address');
            return false;
        }

        // Validate date is not in the past
        const selectedDate = new Date(data.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            alert('Please select a date that is today or in the future');
            return false;
        }

        return true;
    }

    // Display confirmation
    function displayConfirmation(data) {
        // Hide form and show confirmation
        bookingForm.classList.add('hidden');
        confirmationDiv.classList.remove('hidden');

        // Update confirmation email
        document.getElementById('confirmEmail').textContent = data.email;

        // Format and display booking details
        const detailsDiv = document.getElementById('bookingDetails');
        const formattedDate = new Date(data.date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Format time to 12-hour format
        const formattedTime = formatTime(data.time);

        // Get service type label
        const serviceLabels = {
            'restaurant': 'Restaurant Dining',
            'event': 'Event Space',
            'private': 'Private Room',
            'catering': 'Catering Service'
        };

        // Build details HTML
        let detailsHTML = `
            <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
            <p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>
            <p><strong>Date:</strong> ${formattedDate}</p>
            <p><strong>Time:</strong> ${formattedTime}</p>
            <p><strong>Guests:</strong> ${data.guests === 'more' ? 'More than 8' : data.guests}</p>
            <p><strong>Service:</strong> ${serviceLabels[data.service] || data.service}</p>
        `;

        if (data.notes) {
            detailsHTML += `<p><strong>Special Requests:</strong> ${escapeHtml(data.notes)}</p>`;
        }

        detailsDiv.innerHTML = detailsHTML;
    }

    // Format time to 12-hour format
    function formatTime(time24) {
        const [hours, minutes] = time24.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    }

    // Escape HTML to prevent XSS
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});
