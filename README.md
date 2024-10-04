

# **Select Input Card**

A custom Lovelace card for [Home Assistant](https://www.home-assistant.io/) that provides an input interface allowing users to enter text or select from predefined options. The card includes validation and security enhancements to ensure safe and acceptable user input. It sends the input value via a custom Home Assistant event, which can be used in automations or [Node-RED](https://nodered.org/) flows.

----------

## **Table of Contents**

-   [Features](#features)
-   [Installation](#installation)
-   [Configuration](#configuration)
    -   [Options](#options)
    -   [Examples](#examples)
-   [Usage](#usage)
    -   [Text Input Validation](#text-input-validation)
    -   [Select Input Validation](#select-input-validation)
    -   [Listening for Events](#listening-for-events)
-   [Security Considerations](#security-considerations)
-   [Troubleshooting](#troubleshooting)
-   [Contributing](#contributing)
-   [License](#license)

----------

## **Features**

-   **Supports Text Input or Select Input**: Choose between a text area or a dropdown select input.
-   **Input Validation**: Validate user input with maximum length and regular expression patterns.
-   **Security Enhancements**: Sanitizes input to prevent Cross-Site Scripting (XSS) attacks.
-   **Custom Events**: Sends the input value via a custom event using Home Assistant's WebSocket API.
-   **No Entities Required**: Does not require any `input_text` or `input_select` entities.
-   **User-Friendly Messages**: Displays error and success messages to guide the user.

----------

## **Installation**

### **1. Download the Card**

Save the `lovelace-select-input-card.js` file to your Home Assistant `www` directory (e.g., `/config/www/`).

### **2. Add the Resource to Home Assistant**

Add via the **Lovelace Dashboards** > **Resources** UI:

### **3. Restart Home Assistant**

Restart Home Assistant to load the new custom card.

### **4. Clear Browser Cache**

Clear your browser cache or perform a hard refresh to ensure the latest version of the card is loaded.

----------


## **Configuration**

Configure the card via YAML in your Lovelace dashboard.

### **Options**

| Option           | Type      | Required                          | Default                 | Description                                                                                                  |
| ---------------- | --------- | --------------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------ |
| `type`           | `string`  | **Yes**                           |                         | Must be `'custom:lovelace-select-input-card'`.                                                               |
| `title`          | `string`  | No                                | `''` (empty string)     | The title displayed at the top of the card.                                                                  |
| `use_text_input` | `boolean` | No                                | `true`                  | Use text input (`true`) or select input (`false`). Defaults to `true`.                                       |
| `select_options` | `array`   | **If** `use_text_input` is `false` |                         | An array of options for the select input. Required if `use_text_input` is `false`.                           |
| `event_name`     | `string`  | No                                | `'custom_input_event'`  | The name of the custom event to fire when the **Send** button is clicked.                                    |
| `max_length`     | `number`  | No                                | `500`                   | Maximum length for text input. Applies only when `use_text_input` is `true`.                                 |
| `pattern`        | `string`  | No                                |                         | Regular expression pattern to validate the text input. Applies only when `use_text_input` is `true`.         |

### **Examples**

#### **Text Input Card with Validation**

```yaml
type: 'custom:lovelace-select-input-card'
title: 'Secure Text Input Card'
use_text_input: true
event_name: 'secure_text_input_event'
max_length: 100
pattern: '^[a-zA-Z0-9 ]*$'  # Allows only letters, numbers, and spaces.
```

### **Examples**

#### **Text Input Card with Validation**

```yaml
`type: 'custom:lovelace-select-input-card'
title: 'Secure Text Input Card'
use_text_input: true
event_name: 'secure_text_input_event'
max_length: 100
pattern: '^[a-zA-Z0-9 ]*$'  # Allows only letters, numbers, and spaces` 
```

#### **Select Input Card with Validation**

```yaml
`type: 'custom:lovelace-select-input-card'
title: 'Secure Select Input Card'
use_text_input: false
select_options:
  - 'Option 1'
  - 'Option 2'
  - 'Option 3'
event_name: 'secure_select_input_event'` 
```
----------

## **Usage**

### **Text Input Validation**

-   **Empty Input**: The card will display an error if the input is empty when **Send** is clicked.
-   **Maximum Length**: The input field enforces the maximum length specified by `max_length`.
-   **Pattern Matching**: If a `pattern` is specified, the input must match the regular expression.

### **Select Input Validation**

-   **Option Verification**: The card ensures that the selected value is one of the predefined options in `select_options`.
-   **Invalid Selection Handling**: If an invalid value is somehow selected, an error message will be displayed.

### **Interacting with the Card**

-   **Enter Text or Select an Option**: Use the input field to enter your data.
-   **Delete**: Click the **Delete** button to clear the input or reset the selection.
-   **Send**: Click the **Send** button to validate and send the input via a custom event.

### **Listening for Events**

You can use Home Assistant automations or Node-RED to listen for the custom events fired by the card.

#### **Home Assistant Automation**

```yaml
automation:
  - alias: 'Handle Secure Text Input Event'
    trigger:
      platform: event
      event_type: 'secure_text_input_event'
    action:
      - service: notify.notify
        data:
          message: "Received secure input: {{ trigger.event.data.value }}"` 
```
#### **Node-RED Flow**

1.  **Add an `events: all` Node**
    
    -   **Event Type**: Set to the event name specified in your card configuration (e.g., `'secure_text_input_event'`).
2.  **Add a `debug` Node**
    
    -   Connect it to the `events: all` node.
    -   Set it to display the complete message object (`msg`).
3.  **Deploy the Flow and Test**
    
    -   Interact with the card and click the **Send** button.
    -   Observe the event data in the debug panel.

#### **Accessing Event Data**

-   **In Automations**: Use `{{ trigger.event.data.value }}` to access the value.
-   **In Node-RED**: Access `msg.payload.event.event_data.value`.

----------

## **Security Considerations**

-   **Input Sanitization**: The card sanitizes all input values to prevent XSS attacks before sending them via events.
-   **Validation**: Use the `pattern` option to restrict input to acceptable characters.
-   **Event Data Monitoring**: Regularly check that the event data does not contain unexpected or malicious content.
-   **Home Assistant Updates**: Keep your Home Assistant instance up-to-date for the latest security patches.

----------

## **Troubleshooting**

-   **Card Not Appearing**
    
    -   Ensure the custom card file is correctly placed in the `www` directory.
    -   Verify the resource URL is correctly added in Home Assistant.
    -   Clear your browser cache.
-   **Event Not Firing**
    
    -   Make sure the `event_name` in your card configuration matches what your automations or Node-RED flows are listening for.
    -   Check for errors in the browser console.
-   **Validation Errors**
    
    -   Ensure your input meets the specified validation criteria (`max_length`, `pattern`).
    -   Error messages will be displayed below the input field.
-   **Styles Not Applied**
    
    -   Clear your browser cache.
    -   Ensure there are no CSS conflicts with other custom cards.

----------

## **Contributing**

Contributions are welcome! Please open an issue or submit a pull request on GitHub.

**Steps to Contribute:**

1.  **Fork the Repository**: Click the **Fork** button at the top right of this page.
2.  **Clone Your Fork**: Clone your forked repository to your local machine.
3.  **Create a Branch**: Create a new branch for your feature or bug fix.
4.  **Make Changes**: Implement your changes, ensuring code quality and style consistency.
5.  **Commit and Push**: Commit your changes and push them to your forked repository.
6.  **Open a Pull Request**: Submit a pull request to the original repository.

----------

## **License**

This project is licensed under the MIT License - see the LICENSE file for details.

----------

## **Acknowledgments**

-   Thanks to the Home Assistant community for their support and contributions.
-   Inspired by the need for secure and user-friendly input methods in smart home interfaces.
