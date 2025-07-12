document.addEventListener('DOMContentLoaded', function() {
  const noteText = document.getElementById('note-text');
  const saveButton = document.getElementById('save-note');

  // Load any existing note from local storage
  chrome.storage.local.get(['currentNote'], function(result) {
    if (result.currentNote) {
      noteText.value = result.currentNote;
    }
  });

  // Save note to local storage as user types
  noteText.addEventListener('input', function() {
    chrome.storage.local.set({currentNote: noteText.value});
  });

  // Handle save button click
  saveButton.addEventListener('click', function() {
    const note = noteText.value.trim();
    
    if (!note) {
      alert('Please write a note before saving.');
      return;
    }

    // Check if AWS configuration exists
    chrome.storage.sync.get(['awsAccessKey', 'awsSecretKey', 'awsRegion', 's3BucketName'], function(result) {
      if (!result.awsAccessKey || !result.awsSecretKey || !result.awsRegion || !result.s3BucketName) {
        alert('Please configure AWS settings in the options page first.');
        chrome.runtime.openOptionsPage();
        return;
      }

      // Upload note to S3
      uploadNoteToS3(note, result);
    });
  });

  function uploadNoteToS3(note, awsConfig) {
    saveButton.textContent = 'Saving...';
    saveButton.disabled = true;

    // Create a filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `note-${timestamp}.txt`;

    // Configure AWS SDK
    AWS.config.update({
      accessKeyId: awsConfig.awsAccessKey,
      secretAccessKey: awsConfig.awsSecretKey,
      region: awsConfig.awsRegion
    });

    const s3 = new AWS.S3();

    const params = {
      Bucket: awsConfig.s3BucketName,
      Key: filename,
      Body: note,
      ContentType: 'text/plain'
    };

    s3.upload(params, function(err, data) {
      saveButton.textContent = 'Save Note';
      saveButton.disabled = false;

      if (err) {
        console.error('Error uploading note:', err);
        alert('Error uploading note: ' + err.message);
      } else {
        console.log('Note uploaded successfully:', data.Location);
        alert('Note saved successfully to S3!');
        
        // Clear the note after successful upload
        noteText.value = '';
        chrome.storage.local.remove(['currentNote']);
      }
    });
  }
});

