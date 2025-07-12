document.addEventListener('DOMContentLoaded', function() {
  const awsAccessKeyInput = document.getElementById('aws-access-key');
  const awsSecretKeyInput = document.getElementById('aws-secret-key');
  const awsRegionInput = document.getElementById('aws-region');
  const s3BucketNameInput = document.getElementById('s3-bucket-name');
  const saveButton = document.getElementById('save-options');
  const statusDiv = document.getElementById('status');

  // Load saved options
  chrome.storage.sync.get([
    'awsAccessKey',
    'awsSecretKey', 
    'awsRegion',
    's3BucketName'
  ], function(result) {
    awsAccessKeyInput.value = result.awsAccessKey || '';
    awsSecretKeyInput.value = result.awsSecretKey || '';
    awsRegionInput.value = result.awsRegion || 'us-east-1';
    s3BucketNameInput.value = result.s3BucketName || '';
  });

  // Save options
  saveButton.addEventListener('click', function() {
    const awsAccessKey = awsAccessKeyInput.value.trim();
    const awsSecretKey = awsSecretKeyInput.value.trim();
    const awsRegion = awsRegionInput.value.trim();
    const s3BucketName = s3BucketNameInput.value.trim();

    // Validate required fields
    if (!awsAccessKey || !awsSecretKey || !awsRegion || !s3BucketName) {
      showStatus('Please fill in all fields.', 'error');
      return;
    }

    // Validate AWS region format
    const regionPattern = /^[a-z0-9-]+$/;
    if (!regionPattern.test(awsRegion)) {
      showStatus('Please enter a valid AWS region (e.g., us-east-1).', 'error');
      return;
    }

    // Validate S3 bucket name format
    const bucketPattern = /^[a-z0-9.-]+$/;
    if (!bucketPattern.test(s3BucketName) || s3BucketName.length < 3 || s3BucketName.length > 63) {
      showStatus('Please enter a valid S3 bucket name (3-63 characters, lowercase letters, numbers, dots, and hyphens only).', 'error');
      return;
    }

    // Save to Chrome storage
    chrome.storage.sync.set({
      awsAccessKey: awsAccessKey,
      awsSecretKey: awsSecretKey,
      awsRegion: awsRegion,
      s3BucketName: s3BucketName
    }, function() {
      if (chrome.runtime.lastError) {
        showStatus('Error saving options: ' + chrome.runtime.lastError.message, 'error');
      } else {
        showStatus('Options saved successfully!', 'success');
      }
    });
  });

  function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.style.color = type === 'error' ? 'red' : 'green';
    
    // Clear status after 3 seconds
    setTimeout(function() {
      statusDiv.textContent = '';
    }, 3000);
  }
});

