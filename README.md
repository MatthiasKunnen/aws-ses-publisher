[![npm version](https://img.shields.io/npm/v/aws-ses-publisher.svg?logo=npm&style=for-the-badge)](https://www.npmjs.com/package/aws-ses-publisher)
[![Build Status](https://img.shields.io/github/workflow/status/MatthiasKunnen/aws-ses-publisher/Main?label=Build&logo=github&style=for-the-badge)
](https://github.com/MatthiasKunnen/aws-ses-publisher/actions)
[![Build Status](https://img.shields.io/npm/l/aws-ses-publisher?&style=for-the-badge)
](https://github.com/MatthiasKunnen/aws-ses-publisher/blob/master/LICENSE)

# AWS SES publisher
A CLI/node utility to create/update your templates in Amazon SES.

# Config
A JSON config file is used to map template name, subject and files.

Example config:
```json5
{
    // The key is the template name
    "PasswordReset": { 
        "subject": "Example.com - Password reset",
        // Filename relative to --templateDir. If not provided an empty string will be used
        "html": "password-reset.html",
        "text": "password-reset.txt"
    }
}
```

# Usage

## AWS Authentication
Authentication and region changes can be done using environment variables as described here:
- [With manual AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-environment.html)
- [From shared credential file/profile](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-shared.html)
  e.g. `AWS_PROFILE=your-profile ses-publish ...`

## Example
File tree:
```
Directory
├── templates
│   ├── password-reset.html
│   └── password-reset.txt
└── templates.json
```

`AWS_PROFILE=prod ses-publish --template-dir templates`

## More options
`--only` allows you to selectively upload templates by their name.

`--suffix` allows you to upload test versions of your templates. E.g. `--suffix Review` would
publish `PasswordResetReview`.

`--help` argument is available for the full capabilities of the CLI utility. 
