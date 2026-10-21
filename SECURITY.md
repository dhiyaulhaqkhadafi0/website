# Security policy

Security matters because this product handles account and commerce workflows.

## Reporting

Please **do not** publish exploit details, personal information, checkout URLs, credentials, or payment data in a public GitHub issue.

If GitHub's **Private vulnerability reporting** option is available for this repository, use it. Otherwise, use the contact method on [khadafidaffa.com](https://khadafidaffa.com) to request a secure reporting channel first; do not include sensitive proof-of-concept details in the initial message.

No response-time or bug-bounty commitments are implied by this policy.

## Responsible testing

- Do not test payment processing with live cards, wallets, or third-party accounts without explicit authorization.
- Do not access, download, alter, or enumerate user data.
- Do not attempt destructive actions, denial of service, or social engineering.
- Share the affected route, expected versus observed behavior, minimal reproduction, and potential impact privately.

## Maintainer checklist

- Store provider and database service credentials only in protected environment secrets.
- Use separate production and sandbox resources where supported.
- Review access controls, RLS policies, payment signature checks, idempotency, and signed download expiry.
- Keep dependencies updated and run lint/build and regression tests before deploying.
- Revoke and rotate any key suspected of exposure. Deleting a secret from the latest commit does not remove it from Git history.

Documentation is not a substitute for an independent security review.
