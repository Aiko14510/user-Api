# Security Report — Users API

## 1. Overview

This report describes the security measures implemented in the Users API as part of Assignment 2.5. It reviews the application using the OWASP Top 10 (2021) security categories.

## 2. OWASP Top 10 Security Review

### A01: Broken Access Control
Authentication middleware and permission-based authorization restrict access to protected routes and prevent users from performing unauthorized actions.

### A02: Cryptographic Failures
JWT access tokens are signed using a secret that must be at least 32 characters long. Refresh tokens are stored as hashes rather than plain text.

### A03: Injection
Zod validation checks incoming request data, validates data types and rejects unexpected fields before the data reaches application logic.

### A04: Insecure Design
The API uses permission checks, input validation, rate limiting and authentication controls to reduce common security risks.

### A05: Security Misconfiguration
Helmet adds security-related HTTP headers, CORS restricts permitted origins, and environment variables are used for sensitive configuration.

### A06: Vulnerable and Outdated Components
Dependencies are checked using `npm audit`. At the time of this report, the audit found zero vulnerabilities.

### A07: Identification and Authentication Failures
The API uses authentication routes, JWT access tokens, refresh-token rotation and rate limiting to help protect user accounts from unauthorized access.

### A08: Software and Data Integrity Failures
The API validates incoming data and processes uploaded images through an image-processing pipeline. Dependency integrity and deployment security should also be maintained.

### A09: Security Logging and Monitoring Failures
The application provides server-side error and operational output. However, more comprehensive security-event monitoring and alerting could be added.

### A10: Server-Side Request Forgery (SSRF)
The current API does not provide a general feature that fetches arbitrary URLs supplied by users. If this feature is added, destination validation and network restrictions will be needed.

## 3. Remaining Security Weakness

One remaining weakness is that refresh-token storage currently uses an in-memory repository. Stored refresh-token records may be lost when the server restarts, and this approach is not suitable for a larger production deployment.

To improve this, refresh-token records should be stored in a persistent database. The database should store only hashed refresh tokens and support token rotation, expiration and revocation.

## 4. Conclusion

The Users API includes several important security protections, including input validation, authentication, authorization, rate limiting, CORS restrictions, CSRF protection and secure HTTP headers.

All 131 automated tests passed, and `npm audit` reported zero vulnerabilities during this assignment. Security should continue to be reviewed and improved as the application grows.