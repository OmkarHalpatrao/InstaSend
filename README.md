# Email  Tool

A modern, full-stack Next.js application for creating, managing, and sending personalized email  with template support.

## Features

- **Compose Email**: Fill in recipient, subject, and body using dynamic placeholders.
- **Template Management**: Create, edit, and delete reusable email templates with custom placeholders.
- **Template Placeholders**: Define and use dynamic fields (e.g., {role}, {company}) in your templates.
- **Preview & Send**: Preview your email with filled placeholders before sending.
- **File Attachments**: Attach files (PDF, DOCX, etc.) to your emails.
- **User Authentication**: Secure access with authentication (NextAuth.js).
- **Modern UI**: Clean, responsive design using Tailwind CSS and shadcn/ui.
- **Consistent Light Mode**: UI always uses a light theme for best readability.
- **Accessible**: Keyboard navigation and accessible components.
- **Optimized for Productivity**: Fast template switching, editing, and sending.

## Usage

1. **Start the development server:**
   ```bash
   npm install
   npm run dev
   # or yarn dev
   ```
2. **Open [http://localhost:3000](http://localhost:3000) in your browser.**
3. **Sign in** (if authentication is enabled).
4. **Compose an email** or manage templates using the tabs and menu options.
5. **Create/Edit/Delete templates** in the Template Manager tab. Use the delete button to remove templates.
6. **Use placeholders** in your templates for dynamic content.
7. **Preview and send** your email with attachments as needed.

## Project Structure
- `components/` - UI and logic components (template manager, editor, etc.)
- `pages/` - Next.js pages and API routes
- `models/` - Mongoose models for templates and users
- `styles/` - Tailwind CSS and global styles



## Tech Stack
- Next.js 15
- React 19
- Tailwind CSS
- shadcn/ui
- NextAuth.js
- MongoDB (Mongoose)

---

Feel free to contribute or customize for your workflow!
