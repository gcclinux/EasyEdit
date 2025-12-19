# Cloud Notes Integration

## For End Users

**Good news!** The cloud integration is pre-configured and ready to use. No technical setup required!

### How to Use Google Drive Integration

1. **Open EasyNotes Sidebar**: Click the "EasyNotes" button in the menu bar
2. **Connect to Google Drive**: Click the "Connect" button next to Google Drive
3. **Authorize Access**: A Google sign-in window will open
   - Sign in with your Google account
   - Review the permissions (EasyEdit only requests access to files it creates)
   - Click "Allow" to grant access
4. **Start Creating Notes**: Once connected, you can create and manage your notes!

### What Permissions Does EasyEdit Need?

EasyEdit uses the `drive.file` scope, which means:
- ✅ EasyEdit can only access files it creates
- ✅ Your existing Google Drive files are completely private
- ✅ EasyEdit cannot see or access any other files in your Drive
- ✅ You can revoke access anytime from your Google Account settings

### Managing Your Connection

- **Disconnect**: Click "Disconnect" in the EasyNotes sidebar to sign out
- **Revoke Access**: Visit [Google Account Permissions](https://myaccount.google.com/permissions) to completely revoke access

---

## For Developers

### Development Setup

The application comes with pre-configured OAuth credentials for the EasyEdit project. However, if you're forking this project or need to use your own credentials:

1. Create a Google Cloud Project at [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the Google Drive API
3. Create OAuth 2.0 credentials (Web application type)
4. Add authorized JavaScript origins:
   - `https://localhost:3024` (for development)
   - Your production domain
5. Create a `.env.local` file:

```env
VITE_GOOGLE_CLIENT_ID=your-client-id-here
VITE_GOOGLE_API_KEY=your-api-key-here
```

### Building for Production

When building the packaged application, the pre-configured credentials are embedded in the build. Users don't need to configure anything.

### Security Notes

- OAuth credentials are public by design (they're in the client-side code)
- Security comes from the OAuth flow itself, not from hiding the client ID
- The `drive.file` scope ensures EasyEdit can only access its own files
- Never commit production credentials to public repositories