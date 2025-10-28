import React, { useState } from "react";
import { X, Plus } from "lucide-react";

// Contact Form Modal Component
const ContactFormModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    address: "",
    primaryName: "",
    primaryPhone: "",
    primaryEmail: "",
    secondaryName: "",
    secondaryPhone: "",
    secondaryEmail: "",
    comments: "",
  });
  const [showSecondary, setShowSecondary] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    // You can add your form submission logic here
    onClose();
  };

  const resetForm = () => {
    setFormData({
      address: "",
      primaryName: "",
      primaryPhone: "",
      primaryEmail: "",
      secondaryName: "",
      secondaryPhone: "",
      secondaryEmail: "",
      comments: "",
    });
    setShowSecondary(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Contact Information</h2>
          <button className="modal-close" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          {/* Address */}
          <div className="form-group">
            <label htmlFor="address">Address (number & street) *</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="123 Main Street"
              required
            />
          </div>

          {/* Primary Contact */}
          <div className="form-section">
            <h3>Primary Contact</h3>

            <div className="form-group">
              <label htmlFor="primaryName">Name *</label>
              <input
                type="text"
                id="primaryName"
                name="primaryName"
                value={formData.primaryName}
                onChange={handleInputChange}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="primaryPhone">Phone Number *</label>
              <input
                type="tel"
                id="primaryPhone"
                name="primaryPhone"
                value={formData.primaryPhone}
                onChange={handleInputChange}
                placeholder="(555) 123-4567"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="primaryEmail">Email *</label>
              <input
                type="email"
                id="primaryEmail"
                name="primaryEmail"
                value={formData.primaryEmail}
                onChange={handleInputChange}
                placeholder="john@example.com"
                required
              />
            </div>
          </div>

          {/* Secondary Contact */}
          <div className="form-section">
            <div className="secondary-header">
              <h3>Secondary Contact (Optional)</h3>
              {!showSecondary && (
                <button
                  type="button"
                  className="btn-add-secondary"
                  onClick={() => setShowSecondary(true)}
                >
                  <Plus size={16} />
                  Add Secondary Contact
                </button>
              )}
            </div>

            {showSecondary && (
              <div className="secondary-contact">
                <div className="form-group">
                  <label htmlFor="secondaryName">Name</label>
                  <input
                    type="text"
                    id="secondaryName"
                    name="secondaryName"
                    value={formData.secondaryName}
                    onChange={handleInputChange}
                    placeholder="Jane Doe"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="secondaryPhone">Phone Number</label>
                  <input
                    type="tel"
                    id="secondaryPhone"
                    name="secondaryPhone"
                    value={formData.secondaryPhone}
                    onChange={handleInputChange}
                    placeholder="(555) 987-6543"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="secondaryEmail">Email</label>
                  <input
                    type="email"
                    id="secondaryEmail"
                    name="secondaryEmail"
                    value={formData.secondaryEmail}
                    onChange={handleInputChange}
                    placeholder="jane@example.com"
                  />
                </div>

                <button
                  type="button"
                  className="btn-remove-secondary"
                  onClick={() => {
                    setShowSecondary(false);
                    setFormData((prev) => ({
                      ...prev,
                      secondaryName: "",
                      secondaryPhone: "",
                      secondaryEmail: "",
                    }));
                  }}
                >
                  Remove Secondary Contact
                </button>
              </div>
            )}
          </div>

          {/* Comments */}
          <div className="form-group">
            <label htmlFor="comments">General Questions or Comments</label>
            <textarea
              id="comments"
              name="comments"
              value={formData.comments}
              onChange={handleInputChange}
              placeholder="Any questions or additional information..."
              rows="4"
            />
          </div>

          {/* Submit Buttons */}
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactFormModal;
