/**
 * Connection Diagnostic Utility
 * Helper to diagnose connection issues
 */

import { cloudCredentialManager } from '../managers/CloudCredentialManager';
import { cloudManager } from '../managers/CloudManager';

export class ConnectionDiagnostic {
  static async runDiagnostic(): Promise<void> {
    console.log('=== CONNECTION DIAGNOSTIC ===');
    
    try {
      // Use singleton CloudManager instance
      
      // Check stored credentials
      const credentials = await cloudCredentialManager.getCredentials('googledrive');
      console.log('Stored credentials:', credentials ? 'Found' : 'Not found');
      
      if (credentials) {
        console.log('Credentials details:', {
          hasAccessToken: !!credentials.accessToken,
          expiresAt: credentials.expiresAt,
          isExpired: credentials.expiresAt ? credentials.expiresAt <= new Date() : 'No expiry',
          scope: credentials.scope
        });
      }
      
      // Check provider metadata
      const metadata = await cloudManager.getProviderMetadata('googledrive');
      console.log('Provider metadata:', metadata);
      
      // Check if provider thinks it's connected
      const isConnected = await cloudManager.isProviderConnected('googledrive');
      console.log('Is provider connected:', isConnected);
      
      // Check available providers
      const availableProviders = await cloudManager.getAvailableProviders();
      console.log('Available providers:', availableProviders.map(p => p.name));
      
    } catch (error) {
      console.error('Diagnostic error:', error);
    }
    
    console.log('=== END DIAGNOSTIC ===');
  }
}

// Make it available globally for testing
(window as any).runConnectionDiagnostic = ConnectionDiagnostic.runDiagnostic;

// Add manual unlock function
(window as any).unlockCloudCredentials = async (password: string) => {
  try {
    const success = await cloudCredentialManager.unlock(password);
    if (success) {
      console.log('Cloud credentials unlocked successfully!');
      return true;
    } else {
      console.error('Invalid password for cloud credentials');
      return false;
    }
  } catch (error) {
    console.error('Failed to unlock cloud credentials:', error);
    return false;
  }
};

// Add function to check if cloud credentials are unlocked
(window as any).checkCloudCredentialsStatus = () => {
  const isUnlocked = cloudCredentialManager.isUnlocked();
  const hasMasterPassword = cloudCredentialManager.hasMasterPassword();
  console.log('Cloud credentials status:', {
    isUnlocked,
    hasMasterPassword
  });
  return { isUnlocked, hasMasterPassword };
};

// Add function to set up cloud master password
(window as any).setupCloudMasterPassword = async (password: string) => {
  try {
    await cloudCredentialManager.setMasterPassword(password);
    console.log('Cloud master password set successfully!');
    return true;
  } catch (error) {
    console.error('Failed to set cloud master password:', error);
    return false;
  }
};

// Add function to test GIS authentication
(window as any).testGISAuth = async () => {
  try {
    console.log('=== TESTING GIS AUTHENTICATION ===');
    
    // Get the Google Drive provider
    const availableProviders = await cloudManager.getAvailableProviders();
    const googleProvider = availableProviders.find(p => p.name === 'googledrive');
    
    if (!googleProvider) {
      console.error('Google Drive provider not found');
      return false;
    }
    
    console.log('Found Google Drive provider:', googleProvider.displayName);
    
    // Test authentication
    console.log('Starting authentication test...');
    const authResult = await googleProvider.authenticate();
    
    console.log('Authentication result:', authResult);
    
    if (authResult.success) {
      console.log('✅ Authentication successful!');
      
      // Test if authenticated
      const isAuth = await googleProvider.isAuthenticated();
      console.log('Is authenticated:', isAuth);
      
      return true;
    } else {
      console.error('❌ Authentication failed:', authResult.error);
      return false;
    }
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
    return false;
  }
};

// Add function to test full connection flow
(window as any).testFullConnection = async () => {
  try {
    console.log('=== TESTING FULL CONNECTION FLOW ===');
    
    // Step 1: Test authentication
    console.log('Step 1: Testing authentication...');
    const authSuccess = await (window as any).testGISAuth();
    
    if (!authSuccess) {
      console.error('❌ Authentication failed, stopping test');
      return false;
    }
    
    // Step 2: Test connection
    console.log('Step 2: Testing connection...');
    const connectSuccess = await cloudManager.connectProvider('googledrive');
    
    if (!connectSuccess) {
      console.error('❌ Connection failed');
      return false;
    }
    
    console.log('✅ Connection successful!');
    
    // Step 3: Test provider status
    console.log('Step 3: Checking provider status...');
    const isConnected = await cloudManager.isProviderConnected('googledrive');
    console.log('Is provider connected:', isConnected);
    
    // Step 4: Test metadata
    console.log('Step 4: Checking provider metadata...');
    const metadata = await cloudManager.getProviderMetadata('googledrive');
    console.log('Provider metadata:', metadata);
    
    // Step 5: Test note creation
    console.log('Step 5: Testing note creation...');
    try {
      const testNote = await cloudManager.createNote('googledrive', 'Test Note from GIS');
      console.log('✅ Note created successfully:', testNote);
      
      // Step 6: Test note listing
      console.log('Step 6: Testing note listing...');
      const notes = await cloudManager.listNotes('googledrive');
      console.log('✅ Notes listed:', notes.length, 'notes found');
      
      return true;
    } catch (noteError) {
      console.error('❌ Note operations failed:', noteError);
      return false;
    }
    
  } catch (error) {
    console.error('❌ Full connection test failed:', error);
    return false;
  }
};
// Add function to test sync functionality
(window as any).testSync = async () => {
  try {
    console.log('=== TESTING SYNC FUNCTIONALITY ===');
    
    // Test sync
    console.log('Testing sync...');
    const syncResult = await cloudManager.syncNotes('googledrive');
    
    console.log('Sync result:', syncResult);
    
    if (syncResult.success) {
      console.log('✅ Sync successful!');
      console.log(`Files processed: ${syncResult.filesProcessed}`);
      return true;
    } else {
      console.error('❌ Sync failed with errors:', syncResult.errors);
      return false;
    }
    
  } catch (error) {
    console.error('❌ Sync test failed:', error);
    return false;
  }
};
// Add function to debug authentication issues
(window as any).debugAuth = async () => {
  try {
    console.log('=== DEBUGGING AUTHENTICATION ===');
    
    // Check credentials
    const credentials = await cloudCredentialManager.getCredentials('googledrive');
    console.log('Stored credentials:', {
      hasCredentials: !!credentials,
      hasAccessToken: credentials ? !!credentials.accessToken : false,
      tokenLength: credentials ? credentials.accessToken?.length : 0,
      expiresAt: credentials ? credentials.expiresAt : null,
      isExpired: credentials && credentials.expiresAt ? credentials.expiresAt <= new Date() : null
    });
    
    // Check provider authentication
    const availableProviders = await cloudManager.getAvailableProviders();
    const googleProvider = availableProviders.find(p => p.name === 'googledrive');
    
    if (googleProvider) {
      console.log('Google provider found');
      const isAuth = await googleProvider.isAuthenticated();
      console.log('Provider isAuthenticated():', isAuth);
    } else {
      console.log('Google provider not found');
    }
    
    // Check connection status
    const isConnected = await cloudManager.isProviderConnected('googledrive');
    console.log('Is provider connected:', isConnected);
    
    // Check provider metadata
    const metadata = await cloudManager.getProviderMetadata('googledrive');
    console.log('Provider metadata:', metadata);
    
  } catch (error) {
    console.error('Debug auth error:', error);
  }
};

// Add function to check localStorage credentials
(window as any).checkLocalStorage = () => {
  try {
    console.log('=== CHECKING LOCALSTORAGE ===');
    
    const cloudStorageKey = 'easyedit_cloud_credentials';
    const storedString = localStorage.getItem(cloudStorageKey);
    
    console.log('Raw localStorage data:', storedString);
    
    if (storedString) {
      try {
        const parsed = JSON.parse(storedString);
        console.log('Parsed credentials:', parsed);
        console.log('Number of stored credentials:', parsed.length);
        
        parsed.forEach((cred: any, index: number) => {
          console.log(`Credential ${index}:`, {
            provider: cred.provider,
            userId: cred.userId,
            hasEncrypted: !!cred.encrypted,
            expiresAt: cred.expiresAt
          });
        });
      } catch (parseError) {
        console.error('Failed to parse localStorage data:', parseError);
      }
    } else {
      console.log('No credentials found in localStorage');
    }
    
  } catch (error) {
    console.error('Error checking localStorage:', error);
  }
};
// Add function to test file discovery
(window as any).testDiscovery = async () => {
  try {
    console.log('=== TESTING FILE DISCOVERY ===');
    
    // Get provider metadata
    const metadata = await cloudManager.getProviderMetadata('googledrive');
    if (!metadata || !metadata.applicationFolderId) {
      console.error('No application folder found');
      return false;
    }
    
    console.log('Application folder ID:', metadata.applicationFolderId);
    
    // Get the provider
    const availableProviders = await cloudManager.getAvailableProviders();
    const googleProvider = availableProviders.find(p => p.name === 'googledrive');
    
    if (!googleProvider) {
      console.error('Google Drive provider not found');
      return false;
    }
    
    // List files in the folder
    console.log('Listing files in Google Drive folder...');
    const cloudFiles = await googleProvider.listFiles(metadata.applicationFolderId);
    console.log('Files found in Google Drive:', cloudFiles);
    
    // Get local notes for comparison
    const localNotes = await cloudManager.listNotes('googledrive');
    console.log('Local notes:', localNotes);
    
    return true;
    
  } catch (error) {
    console.error('❌ Discovery test failed:', error);
    return false;
  }
};