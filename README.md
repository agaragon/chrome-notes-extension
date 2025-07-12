# Note Taker Chrome Extension

A simple Chrome extension that allows you to take notes and automatically upload them to AWS S3.

## Features

- Simple note-taking interface with a popup window
- Automatic upload to AWS S3
- Configurable AWS credentials and S3 bucket
- Notes are saved with timestamps
- Local storage for draft notes

## Installation

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension directory
5. The extension icon should appear in your Chrome toolbar

## Configuration

Before using the extension, you need to configure your AWS credentials:

1. Click on the extension icon in the toolbar
2. If not configured, you'll be prompted to set up AWS credentials
3. Alternatively, right-click the extension icon and select "Options"
4. Enter the following information:
   - AWS Access Key ID
   - AWS Secret Access Key
   - AWS Region (e.g., us-east-1)
   - S3 Bucket Name

## Usage

1. Click the extension icon to open the note-taking popup
2. Write your note in the text area
3. Click "Save Note" to upload it to your configured S3 bucket
4. Notes are saved with filenames like `note-2025-07-12T16-07-55-123Z.txt`

## AWS Setup

To use this extension, you need:

1. An AWS account
2. An S3 bucket created in your desired region
3. AWS credentials (Access Key ID and Secret Access Key) with permissions to upload to your S3 bucket

### Required AWS Permissions

Your AWS user should have the following S3 permissions:
- `s3:PutObject` on your bucket
- `s3:PutObjectAcl` on your bucket (optional, for setting object permissions)

## Security Note

This extension stores AWS credentials locally in Chrome's sync storage. Make sure to:
- Use IAM credentials with minimal required permissions
- Consider using temporary credentials or AWS STS tokens for enhanced security
- Never share your AWS credentials

## Files Structure

- `manifest.json` - Extension configuration
- `popup.html` - Main note-taking interface
- `popup.js` - Popup functionality and S3 upload logic
- `options.html` - AWS configuration page
- `options.js` - Options page functionality
- `style.css` - Styling for all pages
- `aws-sdk-2.1563.0.min.js` - AWS SDK for JavaScript
- `images/` - Extension icons

## License

This project is open source and available under the MIT License.

