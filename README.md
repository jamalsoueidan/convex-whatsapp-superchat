# Whatsapp Application

![Desktop](screenshots/bot.png)

This project is a WhatsApp-based chat application that allows users to interact with WhatsApp via the WhatsApp Business API. The application provides a frontend interface built with React, using Realm for data storage and state management. It supports real-time chat functionality, user conversations, and message management.

## Features

- **Real-time Chat**: Users can engage in real-time conversations.
- **Unread Message Count**: The application tracks unread messages per conversation, showing users how many new messages they have.
- **User Conversations**: Each user has their own conversation history, and the application tracks when the user last viewed each conversation.
- **WhatsApp Business API Integration**: The application integrates with the WhatsApp Business API to handle incoming and outgoing messages.
- **Interactive Message Flows**: Automate responses using interactive message flows, such as sending lists or buttons to users, and handle user responses to trigger further actions.
- **Responsive Design**: The UI adapts to mobile and desktop layouts, providing a smooth experience across devices.
- **Attachments Support**: Users can send and receive attachments, such as images or documents.
- **Settings Drawer**: Users can access and manage conversation settings through a settings drawer in the UI.
- **Conversation**: Admins have the ability to manage users and conversations, including assigning users to specific conversations.
- **Sticky Date Headers**: While scrolling through messages, date headers remain sticky, providing context for when messages were sent, and enhancing the readability of the chat history.
- **Infinity Scroll for Conversations**: Load older messages as the user scrolls up, with a smooth infinity scroll that ensures efficient message loading without overwhelming the interface.
- **Dynamic User Assignment**: Admins can dynamically assign or remove users from conversations, with system messages automatically generated to notify participants of these changes.
- **Team Page & Role Management**: Users can view a list of team members, and admins have the ability to change user roles, ensuring proper access control and management within the team.
- **Contacts**: Users can access and search through contacts, making it easy to re-engage with past customers and send new messages.
- **Internal Messaging with Mentions**: Users can send internal messages to team members within the chat using mentions (@), enabling streamlined communication and collaboration directly in the chat interface.
- **Automated Interactive Workflows**: Users can create and manage complex interactive workflows using a visual interface, allowing for automated sequences based on user responses. This includes managing flows like interactive lists and buttons, which can trigger subsequent actions.
- **Visual Flow**: A Visual Flow interface for building and managing the sequences of automated responses, making it easier to create and modify workflows without needing to code.
- **Custom Node Components**: Users can choose from various node types (e.g., interactive lists, buttons, or triggers) within the visual flow builder, with each node defining a specific type of interaction.
- **Auto Layout for Flow Nodes**: Automatically organizes and arranges nodes in the visual flow builder to ensure a clean and understandable layout, improving the user experience when managing complex workflows.

## Tech Stack

- **Frontend**: Remix/React
- **Backend**: Convex Fullstack backend / WhatsApp Cloud Api
- **Styling**: Mantine for UI components and layout
