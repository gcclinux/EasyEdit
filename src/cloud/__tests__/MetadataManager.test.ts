/**
 * Property-based tests for MetadataManager
 * **Feature: cloud-notes-integration, Property 12: Metadata Consistency and Recovery**
 * **Validates: Requirements 7.1, 7.2, 7.4, 7.5**
 */

import * as fc from 'fast-check';
import { MetadataManager } from '../managers/MetadataManager';
import { NoteMetadata } from '../interfaces';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('MetadataManager Property Tests', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  afterEach(() => {
    localStorageMock.clear();
  });

  // Simple unit test to verify basic functionality
  it('should work with basic note metadata', async () => {
    const manager = new MetadataManager();
    
    const note: NoteMetadata = {
      id: 'test-note-1',
      title: 'Test Note',
      fileName: 'test-note.md',
      provider: 'googledrive',
      cloudFileId: 'cloud-file-123',
      lastModified: new Date('2024-01-15T10:00:00Z'),
      lastSynced: new Date('2024-01-15T10:00:00Z'),
      size: 1024,
      checksum: 'sha256:abc123'
    };
    
    await manager.addNote(note);
    const retrieved = await manager.findNote('test-note-1');
    
    expect(retrieved).not.toBeNull();
    expect(retrieved!.title).toBe('Test Note');
    expect(retrieved!.provider).toBe('googledrive');
  });

  /**
   * **Feature: cloud-notes-integration, Property 12: Metadata Consistency and Recovery**
   * **Validates: Requirements 7.1, 7.2, 7.4, 7.5**
   * 
   * Property: For any synchronization operation, the system should maintain accurate 
   * local metadata, handle corruption through cloud rebuilding, and resolve conflicts 
   * by prioritizing cloud data
   */
  describe('Property 12: Metadata Consistency and Recovery', () => {
    // Simplified arbitraries for generating test data
    const idArb = fc.string({ minLength: 1, maxLength: 20 }).map(s => 'note-' + s.replace(/[^a-zA-Z0-9]/g, ''));
    const titleArb = fc.string({ minLength: 1, maxLength: 50 }).map(s => s.trim() || 'Test Note');
    const fileNameArb = fc.string({ minLength: 1, maxLength: 30 }).map(s => s.replace(/[^a-zA-Z0-9]/g, '') + '.md');
    const providerArb = fc.constantFrom('googledrive', 'dropbox', 'onedrive', 'nextcloud');
    const cloudFileIdArb = fc.string({ minLength: 1, maxLength: 30 }).map(s => 'cloud-' + s.replace(/[^a-zA-Z0-9]/g, ''));
    const checksumArb = fc.string({ minLength: 5, maxLength: 20 }).map(s => 'sha256:' + s.replace(/[^a-zA-Z0-9]/g, ''));
    const sizeArb = fc.integer({ min: 0, max: 10000 });
    
    // Generate valid dates
    const dateArb = fc.date({ 
      min: new Date('2023-01-01'), 
      max: new Date('2024-12-31') 
    }).filter(date => !isNaN(date.getTime())); // Ensure valid dates only

    const noteMetadataArb = fc.record({
      id: idArb,
      title: titleArb,
      fileName: fileNameArb,
      provider: providerArb,
      cloudFileId: cloudFileIdArb,
      lastModified: dateArb,
      lastSynced: dateArb,
      size: sizeArb,
      checksum: checksumArb
    });

    it('should maintain metadata consistency across save and load operations', async () => {
      await fc.assert(fc.asyncProperty(
        fc.array(noteMetadataArb, { minLength: 1, maxLength: 3 }),
        async (notes) => {
          // Clear localStorage before each property test run
          localStorageMock.clear();
          
          // Create a fresh manager for each test
          const manager = new MetadataManager();
          
          // Ensure unique note IDs by adding index
          const uniqueNotes = notes.map((note, index) => ({
            ...note,
            id: note.id + '-' + index
          }));
          
          // Add all notes
          for (const note of uniqueNotes) {
            await manager.addNote(note);
          }
          
          // Load metadata and verify all notes are present
          const loadedNotes = await manager.loadMetadata();
          expect(loadedNotes).toHaveLength(uniqueNotes.length);
          
          // Verify each note can be found and matches original
          for (const originalNote of uniqueNotes) {
            const foundNote = await manager.findNote(originalNote.id);
            expect(foundNote).not.toBeNull();
            expect(foundNote!.id).toBe(originalNote.id);
            expect(foundNote!.title).toBe(originalNote.title);
            expect(foundNote!.fileName).toBe(originalNote.fileName);
            expect(foundNote!.provider).toBe(originalNote.provider);
            expect(foundNote!.cloudFileId).toBe(originalNote.cloudFileId);
            expect(foundNote!.size).toBe(originalNote.size);
            expect(foundNote!.checksum).toBe(originalNote.checksum);
            expect(foundNote!.lastModified.getTime()).toBe(originalNote.lastModified.getTime());
            expect(foundNote!.lastSynced.getTime()).toBe(originalNote.lastSynced.getTime());
          }
        }
      ), { numRuns: 10 });
    });

    it('should handle metadata updates correctly', async () => {
      await fc.assert(fc.asyncProperty(
        noteMetadataArb,
        titleArb,
        sizeArb,
        checksumArb,
        dateArb,
        async (originalNote, newTitle, newSize, newChecksum, newDate) => {
          // Clear localStorage before each property test run
          localStorageMock.clear();
          
          // Create a fresh manager for each test
          const manager = new MetadataManager();
          
          // Add original note
          await manager.addNote(originalNote);
          
          // Update the note
          const updates = {
            title: newTitle,
            size: newSize,
            checksum: newChecksum,
            lastModified: newDate
          };
          
          await manager.updateNote(originalNote.id, updates);
          
          // Verify updates were applied
          const updatedNote = await manager.findNote(originalNote.id);
          expect(updatedNote).not.toBeNull();
          expect(updatedNote!.id).toBe(originalNote.id);
          expect(updatedNote!.title).toBe(newTitle);
          expect(updatedNote!.size).toBe(newSize);
          expect(updatedNote!.checksum).toBe(newChecksum);
          expect(updatedNote!.lastModified.getTime()).toBe(newDate.getTime());
          
          // Verify unchanged fields remain the same
          expect(updatedNote!.fileName).toBe(originalNote.fileName);
          expect(updatedNote!.provider).toBe(originalNote.provider);
          expect(updatedNote!.cloudFileId).toBe(originalNote.cloudFileId);
          expect(updatedNote!.lastSynced.getTime()).toBe(originalNote.lastSynced.getTime());
        }
      ), { numRuns: 10 });
    });

    it('should handle note removal correctly', async () => {
      await fc.assert(fc.asyncProperty(
        fc.array(noteMetadataArb, { minLength: 2, maxLength: 5 }),
        async (notes) => {
          // Clear localStorage before each property test run
          localStorageMock.clear();
          
          // Create a fresh manager for each test
          const manager = new MetadataManager();
          
          // Ensure unique note IDs
          const uniqueNotes = notes.reduce((acc, note) => {
            acc[note.id] = note;
            return acc;
          }, {} as Record<string, NoteMetadata>);
          
          const notesList = Object.values(uniqueNotes);
          if (notesList.length < 2) return; // Skip if not enough unique notes
          
          // Add all notes
          for (const note of notesList) {
            await manager.addNote(note);
          }
          
          // Remove the first note
          const noteToRemove = notesList[0];
          await manager.removeNote(noteToRemove.id);
          
          // Verify the note is removed
          const removedNote = await manager.findNote(noteToRemove.id);
          expect(removedNote).toBeNull();
          
          // Verify other notes still exist
          const remainingNotes = notesList.slice(1);
          for (const note of remainingNotes) {
            const foundNote = await manager.findNote(note.id);
            expect(foundNote).not.toBeNull();
            expect(foundNote!.id).toBe(note.id);
          }
          
          // Verify metadata count is correct
          const allNotes = await manager.loadMetadata();
          expect(allNotes).toHaveLength(remainingNotes.length);
        }
      ), { numRuns: 10 });
    });

    it('should filter notes by provider correctly', async () => {
      await fc.assert(fc.asyncProperty(
        fc.array(noteMetadataArb, { minLength: 3, maxLength: 8 }),
        providerArb,
        async (notes, targetProvider) => {
          // Clear localStorage before each property test run
          localStorageMock.clear();
          
          // Create a fresh manager for each test
          const manager = new MetadataManager();
          
          // Ensure unique note IDs and mix of providers
          const uniqueNotes = notes.reduce((acc, note) => {
            acc[note.id] = note;
            return acc;
          }, {} as Record<string, NoteMetadata>);
          
          const notesList = Object.values(uniqueNotes);
          if (notesList.length < 3) return; // Skip if not enough unique notes
          
          // Ensure at least one note has the target provider
          notesList[0] = { ...notesList[0], provider: targetProvider };
          
          // Add all notes
          for (const note of notesList) {
            await manager.addNote(note);
          }
          
          // Find notes by provider
          const providerNotes = await manager.findNotesByProvider(targetProvider);
          
          // Verify all returned notes have the correct provider
          for (const note of providerNotes) {
            expect(note.provider).toBe(targetProvider);
          }
          
          // Verify we found at least the one we set
          expect(providerNotes.length).toBeGreaterThan(0);
          
          // Verify no notes from other providers are included
          const expectedCount = notesList.filter(n => n.provider === targetProvider).length;
          expect(providerNotes).toHaveLength(expectedCount);
        }
      ), { numRuns: 10 });
    });

    it('should recover from corrupted metadata by rebuilding from cloud data', async () => {
      await fc.assert(fc.asyncProperty(
        fc.array(noteMetadataArb, { minLength: 1, maxLength: 5 }),
        async (cloudNotes) => {
          // Clear localStorage before each property test run
          localStorageMock.clear();
          
          // Create a fresh manager for each test
          const manager = new MetadataManager();
          
          // Ensure unique note IDs
          const uniqueNotes = cloudNotes.reduce((acc, note) => {
            acc[note.id] = note;
            return acc;
          }, {} as Record<string, NoteMetadata>);
          
          const notesList = Object.values(uniqueNotes);
          if (notesList.length === 0) return; // Skip empty arrays
          
          // Simulate corrupted metadata by storing invalid JSON
          localStorage.setItem('easynotes-metadata.json', 'invalid json {');
          
          // Rebuild from cloud data
          await manager.rebuildFromCloud(notesList);
          
          // Verify all cloud notes are now in metadata
          const loadedNotes = await manager.loadMetadata();
          expect(loadedNotes).toHaveLength(notesList.length);
          
          // Verify each note matches the cloud data
          for (const cloudNote of notesList) {
            const foundNote = await manager.findNote(cloudNote.id);
            expect(foundNote).not.toBeNull();
            expect(foundNote!.id).toBe(cloudNote.id);
            expect(foundNote!.title).toBe(cloudNote.title);
            expect(foundNote!.provider).toBe(cloudNote.provider);
            expect(foundNote!.cloudFileId).toBe(cloudNote.cloudFileId);
          }
        }
      ), { numRuns: 10 });
    });

    it('should handle empty metadata gracefully', async () => {
      await fc.assert(fc.asyncProperty(
        fc.constant(null), // Just a placeholder to run the test
        async (_) => {
          // Clear localStorage before each property test run
          localStorageMock.clear();
          
          // Create a fresh manager for each test
          const manager = new MetadataManager();
          
          // Load metadata when none exists
          const notes = await manager.loadMetadata();
          expect(notes).toHaveLength(0);
          
          // Try to find a non-existent note
          const foundNote = await manager.findNote('non-existent');
          expect(foundNote).toBeNull();
          
          // Try to find notes by provider when none exist
          const providerNotes = await manager.findNotesByProvider('googledrive');
          expect(providerNotes).toHaveLength(0);
          
          // Verify we can still add notes after starting with empty metadata
          const testNote: NoteMetadata = {
            id: 'test-1',
            title: 'Test',
            fileName: 'test.md',
            provider: 'googledrive',
            cloudFileId: 'cloud-1',
            lastModified: new Date(),
            lastSynced: new Date(),
            size: 100,
            checksum: 'test-checksum'
          };
          
          await manager.addNote(testNote);
          const retrievedNote = await manager.findNote('test-1');
          expect(retrievedNote).not.toBeNull();
          expect(retrievedNote!.title).toBe('Test');
        }
      ), { numRuns: 10 });
    });

    it('should validate note metadata and reject invalid data', async () => {
      await fc.assert(fc.asyncProperty(
        fc.record({
          id: fc.constantFrom('', '   ', 123 as any), // Invalid IDs
          title: titleArb,
          fileName: fileNameArb,
          provider: providerArb,
          cloudFileId: cloudFileIdArb,
          lastModified: dateArb,
          lastSynced: dateArb,
          size: sizeArb,
          checksum: checksumArb
        }),
        async (invalidNote) => {
          // Clear localStorage before each property test run
          localStorageMock.clear();
          
          // Create a fresh manager for each test
          const manager = new MetadataManager();
          
          // Try to add invalid note - should throw error
          await expect(manager.addNote(invalidNote as any))
            .rejects.toThrow();
          
          // Verify no notes were added
          const notes = await manager.loadMetadata();
          expect(notes).toHaveLength(0);
        }
      ), { numRuns: 20 });
    });
  });
});