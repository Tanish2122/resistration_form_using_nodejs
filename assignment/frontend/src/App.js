import React, { useState } from 'react';

function App() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    gender: '',
    street: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const [submissionStatus, setSubmissionStatus] = useState({
    isSubmitted: false,
    isSuccess: false,
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRadioChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      gender: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic form validation
    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmissionStatus({
          isSubmitted: true,
          isSuccess: true,
          message: result.message || 'Form submitted successfully!',
        });

        // Reset form if successful
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          gender: '',
          street: '',
          city: '',
          state: '',
          zipCode: ''
        });
      } else {
        setSubmissionStatus({
          isSubmitted: true,
          isSuccess: false,
          message: result.message || 'Error submitting form.',
        });
      }

    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmissionStatus({
        isSubmitted: true,
        isSuccess: false,
        message: 'Error submitting form. Please try again.',
      });
    }
  };

  const validateForm = () => {
    // Phone number validation (10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      setSubmissionStatus({
        isSubmitted: true,
        isSuccess: false,
        message: 'Please enter a valid 10-digit phone number.'
      });
      return false;
    }

    // Zip code validation (6 digits)
    const zipCodeRegex = /^\d{6}$/;
    if (!zipCodeRegex.test(formData.zipCode)) {
      setSubmissionStatus({
        isSubmitted: true,
        isSuccess: false,
        message: 'Please enter a valid 6-digit zip code.'
      });
      return false;
    }

    return true;
  };

  return (
    <div className="container" style={{ 
      width: '300px', 
      margin: 'auto', 
      fontFamily: 'Arial, sans-serif',
      position: 'relative'
    }}>
      <h2>Registration Form</h2>
      
      {submissionStatus.isSubmitted && (
        <div style={{
          marginBottom: '15px',
          padding: '10px',
          borderRadius: '5px',
          backgroundColor: submissionStatus.isSuccess ? '#DFF0D8' : '#F2DEDE',
          color: submissionStatus.isSuccess ? '#3C763D' : '#A94442',
          textAlign: 'center'
        }}>
          {submissionStatus.message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            maxLength="50"
            style={{ width: '100%', padding: '5px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '5px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            pattern="\d{10}"
            style={{ width: '100%', padding: '5px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Gender</label>
          <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
            <label>
              <input
                type="radio"
                name="gender"
                value="Male"
                checked={formData.gender === 'Male'}
                onChange={handleRadioChange}
                required
              />
              Male
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="Female"
                checked={formData.gender === 'Female'}
                onChange={handleRadioChange}
                required
              />
              Female
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="Others"
                checked={formData.gender === 'Others'}
                onChange={handleRadioChange}
                required
              />
              Others
            </label>
          </div>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="street">Street Address</label>
          <textarea
            id="street"
            name="street"
            value={formData.street}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '5px', marginTop: '5px', minHeight: '50px' }}
          ></textarea>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="city">City</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '5px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="state">State</label>
          <select
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '5px', marginTop: '5px' }}
          >
            <option value="">Select a state</option>
            <option value="California">California</option>
            <option value="New York">New York</option>
            <option value="Texas">Texas</option>
            <option value="Florida">Florida</option>
          </select>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="zipCode">Zip Code</label>
          <input
            type="text"
            id="zipCode"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            required
            pattern="\d{6}"
            style={{ width: '100%', padding: '5px', marginTop: '5px' }}
          />
        </div>

        <button 
          type="submit" 
          style={{ 
            marginTop: '10px', 
            padding: '10px 20px', 
            backgroundColor: '#4CAF50', 
            color: 'white', 
            border: 'none', 
            cursor: 'pointer', 
            width: '100%' 
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default App;
