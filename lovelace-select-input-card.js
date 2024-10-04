// lovelace-select-input-card.js - Version 0.0.2

// Import the LitElement base class and html helper function
const LitElement = Object.getPrototypeOf(
    customElements.get('home-assistant-main') || customElements.get('hui-view')
  );
  const { html, css } = LitElement.prototype;
  
  // Define the custom element class
  class LovelaceSelectInputCard extends LitElement {
    // Define reactive properties
    static get properties() {
      return {
        hass: {},    // Home Assistant object
        _config: {}, // Configuration object
        _value: {},  // Current value of the input
      };
    }
  
    // Define CSS styles for the card
    static get styles() {
      return css`
        /* Container for the buttons */
        .flex {
          display: flex;
          align-items: center;
          justify-content: space-evenly;
          position: relative;
        }
        /* Style for the buttons */
        .button {
          cursor: pointer;
          padding: 16px;
          transition: opacity 0.5s linear;
        }
        /* Style for the textarea input */
        .textarea {
          background: var(--card-background-color);
          border: 1px solid var(--primary-color);
          color: var(--primary-text-color);
          font-size: 16px;
          margin-top: 20px;
          outline: none;
          padding: 5px;
          min-height: 80px;
          width: 100%;
          resize: vertical;
        }
        /* Style for the select input */
        .select-input {
          width: 100%;
          padding: 5px;
          margin-top: 20px;
          font-size: 16px;
          border: 1px solid var(--primary-color);
          background: var(--card-background-color);
          color: var(--primary-text-color);
          appearance: none;
          /* Custom arrow icon for the dropdown */
          background-image: url('data:image/svg+xml;utf8,<svg fill="%23FFFFFF" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>');
          background-repeat: no-repeat;
          background-position: right 10px center;
          background-size: 24px;
          border-radius: 4px;
        }
        /* Style for the message display */
        .message {
          padding: 5px;
          background-color: var(--primary-background-color);
          border: 1px solid var(--primary-color);
          border-radius: 3px;
          text-align: center;
          font-size: 11px;
          opacity: 0;
          transition: opacity 0.5s linear;
          position: absolute;
          width: 100%;
          top: -25px;
          left: 0;
        }
        .message.visible {
          opacity: 1;
        }
        /* Error message style */
        .error {
          color: var(--error-color);
        }
      `;
    }
  
    // Constructor to initialize the component
    constructor() {
      super();
      this._value = ''; // Initialize the input value
    }
  
    // Method to set the configuration from YAML
    setConfig(config) {
      if (!config) {
        throw new Error('Invalid configuration');
      }
  
      // Set the configuration with defaults
      this._config = {
        title: config.title || '', // Card title
        use_text_input: config.use_text_input !== false, // Use text input or select input
        select_options: config.select_options || [], // Options for select input
        event_name: config.event_name || 'custom_input_event', // Event name for sending data
        max_length: config.max_length || 500, // Maximum length for text input
        pattern: config.pattern || null, // Validation pattern for text input
      };
  
      // Validation for select input options
      if (!this._config.use_text_input && !this._config.select_options.length) {
        throw new Error('Please specify select_options.');
      }
  
      // Initialize _value based on the input type
      if (!this._config.use_text_input) {
        // For select input, set initial value to the first option
        this._value = this._config.select_options[0] || '';
      } else {
        // For text input, initialize as empty
        this._value = '';
      }
    }
  
    // Method to get the size of the card
    getCardSize() {
      return 3;
    }
  
    // Render the card's HTML
    render() {
      // Check if configuration is set
      if (!this._config) {
        return html`<ha-card>
          <div class="card-content">Invalid configuration.</div>
        </ha-card>`;
      }
  
      return html`
        <ha-card .header=${this._config.title}>
          <div class="card-content">
            <!-- Conditionally render input type based on configuration -->
            ${this._config.use_text_input
              ? html`
                  <!-- Textarea input -->
                  <textarea
                    class="textarea"
                    .value=${this._value}
                    @input=${this._handleInputChange}
                    maxlength="${this._config.max_length}"
                  ></textarea>
                `
              : html`
                  <!-- Select input -->
                  <select
                    class="select-input"
                    @change=${this._handleSelectChange}
                    .value=${this._value}
                  >
                    <!-- Render select options -->
                    ${this._config.select_options.map(
                      (option) => html`
                        <option value="${option}">${option}</option>
                      `
                    )}
                  </select>
                `}
            <!-- Error message display -->
            <div class="message error" id="errorMessage"></div>
            <!-- Buttons for delete and send actions -->
            <div class="flex">
              ${this._renderButton('delete')}
              ${this._renderButton('send')}
            </div>
            <!-- Success message display area -->
            <div class="message" id="serviceMessage"></div>
          </div>
        </ha-card>
      `;
    }
  
    // Method to render action buttons
    _renderButton(action) {
      // Define icons and tooltips for each action
      const icons = {
        delete: 'mdi:trash-can-outline',
        send: 'mdi:send',
      };
  
      const hints = {
        delete: 'Clear', // Tooltip for delete button
        send: 'Send',    // Tooltip for send button
      };
  
      // Return the button HTML
      return html`
        <div
          class="button"
          title="${hints[action]}"
          @click=${() => this._handleButtonClick(action)}
        >
          <ha-icon .icon=${icons[action]}></ha-icon>
        </div>
      `;
    }
  
    // Event handler for text input changes
    _handleInputChange(e) {
      this._value = e.target.value; // Update the value
      this._clearErrorMessage();    // Clear any existing error messages
    }
  
    // Event handler for select input changes
    _handleSelectChange(e) {
      this._value = e.target.value; // Update the value
      this._clearErrorMessage();    // Clear any existing error messages
    }
  
    // Event handler for button clicks
    _handleButtonClick(action) {
      if (action === 'delete') {
        this._deleteValue(); // Handle delete action
      } else if (action === 'send') {
        this._sendValue();   // Handle send action
      }
    }
  
    // Method to clear the input value
    _deleteValue() {
      if (this._config.use_text_input) {
        this._value = ''; // Clear text input
      } else {
        this._value = this._config.select_options[0] || ''; // Reset to first select option
      }
  
      // Display message to the user
      this._displayMessage('Value cleared.', true);
  
      // Request an update to re-render the component
      this.requestUpdate();
    }
  
    // Method to send the input value via custom event
    _sendValue() {
      try {
        const value = this._value || ''; // Get the current value
  
        // Input validation
        if (this._config.use_text_input) {
          // Validate text input
          if (!this._validateText(value)) {
            return; // Stop processing if validation fails
          }
        } else {
          // Validate select input
          if (!this._validateSelect(value)) {
            return; // Stop processing if validation fails
          }
        }
  
        // Sanitize the value to prevent XSS attacks
        const sanitizedValue = this._sanitizeValue(value);
  
        // Use Home Assistant's WebSocket service to fire a custom event
        this.hass.callWS({
          type: 'fire_event',
          event_type: this._config.event_name, // Event name from configuration
          event_data: {
            value: sanitizedValue, // Include the sanitized input value in event data
          },
        });
  
        // Display success message to the user
        this._displayMessage('Value sent.', true);
      } catch (error) {
        // Handle any errors that occur during the process
        console.error('Error sending value:', error);
        this._displayErrorMessage('An error occurred while sending the value.');
      }
    }
  
    // Method to validate text input
    _validateText(value) {
      // Check if the value is empty
      if (!value.trim()) {
        this._displayErrorMessage('Input cannot be empty.');
        return false;
      }
  
      // Check for maximum length
      if (value.length > this._config.max_length) {
        this._displayErrorMessage(`Input cannot exceed ${this._config.max_length} characters.`);
        return false;
      }
  
      // Check against a validation pattern if provided
      if (this._config.pattern) {
        const regex = new RegExp(this._config.pattern);
        if (!regex.test(value)) {
          this._displayErrorMessage('Input does not match the required format.');
          return false;
        }
      }
  
      // All validations passed
      return true;
    }
  
    // Method to validate select input
    _validateSelect(value) {
      // Ensure the selected value is one of the predefined options
      if (!this._config.select_options.includes(value)) {
        this._displayErrorMessage('Invalid selection.');
        return false;
      }
  
      // Validation passed
      return true;
    }
  
    // Method to sanitize input values
    _sanitizeValue(value) {
      // Use a DOM parser to encode HTML entities
      const parser = new DOMParser();
      const doc = parser.parseFromString(value, 'text/html');
      return doc.body.textContent || '';
    }
  
    // Method to display error messages
    _displayErrorMessage(message) {
      const errorEl = this.shadowRoot.getElementById('errorMessage');
      if (errorEl) {
        errorEl.textContent = message;       // Set the error message text
        errorEl.classList.add('visible');    // Show the error message
      }
    }
  
    // Method to clear error messages
    _clearErrorMessage() {
      const errorEl = this.shadowRoot.getElementById('errorMessage');
      if (errorEl) {
        errorEl.textContent = '';            // Clear the error message text
        errorEl.classList.remove('visible'); // Hide the error message
      }
    }
  
    // Method to display success messages
    _displayMessage(message, success) {
      const messageEl = this.shadowRoot.getElementById('serviceMessage');
      if (messageEl) {
        messageEl.textContent = message;        // Set the message text
        messageEl.classList.add('visible');     // Show the message
        setTimeout(() => {
          messageEl.classList.remove('visible'); // Hide the message after 2 seconds
        }, 2000);
      }
    }
  }
  
  // Register the custom element with the browser
  customElements.define('lovelace-select-input-card', LovelaceSelectInputCard);
  
  // Register the card in the Lovelace card picker
  window.customCards = window.customCards || [];
  window.customCards.push({
    type: 'lovelace-select-input-card', // Type name for the custom card
    name: 'Select Input Card',          // Display name in the card picker
    description:
      'A card that can be used as an input text or select input, with delete and send functionalities, including input validation and security enhancements.',
    preview: true,                      // Enable visual preview in card picker
  });
  