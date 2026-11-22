# Firestore Security Specification — CodeNest

## 1. Data Invariants
1. **Default-Deny Catch-All**: Every undefined path is denied read and write access (`allow read, write: if false;`).
2. **Public CMS Read, Admin-Only Write**: Public marketing collections (`siteSettings`, `services`, `projects`, `posts`, `team`, `testimonials`, `sectors`, `techStack`, `faqs`, `legal`) are publicly readable so SSR/RSC and visitors can load content, while create/update/delete is strictly limited to verified admins (`isAdmin()`).
3. **PII Isolation (`contactSubmissions`)**:
   - Anyone may `create` a contact submission ONLY if it matches the exact key set (`hasAll` + `hasOnly`), passes strict field length/format checks, initializes `status == "new"` and `notes == ""`, and uses server timestamps (`createdAt == request.time && updatedAt == request.time`).
   - Reading (`get`, `list`), updating (`status`, `notes`, `updatedAt`), and deleting `contactSubmissions` is strictly restricted to verified admins (`isAdmin()`).
4. **Admin Verification & Anti-Spoofing**:
   - `isAdmin()` requires `request.auth != null`, `request.auth.token.email_verified == true`, and either a bootstrapped admin email (`abduarahman.naif.ali@gmail.com`, `abdelrahmandevcode@gmail.com`) or an existing `/admins/{request.auth.uid}` document.
   - Clients can never self-register into `/admins/{uid}`.
5. **Path Variable & Array Bounds**:
   - All document IDs on single-document ops validate against `isValidId(id)` (`^[a-zA-Z0-9_\-]+$`, max 128 chars).
   - All arrays (`socials`, `results`, `stack`, `body`, `responsibilities`, `sections`) are bounded by `.size() <= MAX`.
6. **Temporal Integrity & Immutability**:
   - `createdAt` on `contactSubmissions` is immutable (`incoming().createdAt == existing().createdAt`) and must equal `request.time` on creation.
   - `updatedAt` on all mutable documents must equal `request.time`.

## 2. "Dirty Dozen" Adversarial Payloads
1. **Shadow Field Injection on Contact**: `POST /contactSubmissions` with `{ ..., isAdmin: true }` -> DENIED (`hasOnly` check).
2. **Status Escalation on Contact Create**: `POST /contactSubmissions` with `{ ..., status: "replied" }` -> DENIED (`status == "new"` required on create).
3. **Spoofed Timestamp on Contact Create**: `POST /contactSubmissions` with client-supplied past/future `createdAt` -> DENIED (`createdAt == request.time`).
4. **PII Leak (Unauthenticated Read)**: `GET /contactSubmissions/{id}` or `LIST /contactSubmissions` by unauthenticated or non-admin user -> DENIED (`isAdmin()` required).
5. **Unverified Admin Email Spoof**: Signed-in user with `email == "abdelrahmandevcode@gmail.com"` and `email_verified == false` -> DENIED (`email_verified == true` required).
6. **Self-Privilege Escalation**: Non-admin user attempts `CREATE /admins/{myUid}` -> DENIED (`/admins` write blocked for non-admins).
7. **ID Poisoning Attack**: `CREATE /projects/<1500-char-id>` -> DENIED (`isValidId` rejects > 128 chars or invalid chars).
8. **Denial-of-Wallet Oversized Message**: `CREATE /contactSubmissions` with `message` > 2000 chars -> DENIED (`size() <= 2000`).
9. **Immutable Field Mutation**: Admin or attacker attempts to mutate `createdAt` or `email` on `contactSubmissions` update -> DENIED (`affectedKeys().hasOnly(['status', 'notes', 'updatedAt'])`).
10. **Unauthorized CMS Overwrite**: Non-admin authenticated user attempts `UPDATE /projects/sample-saas-dashboard` -> DENIED (`isAdmin()` required).
11. **Unbounded Array Bomb**: Admin or caller submits `stack` array with 100 items on `/projects/{id}` -> DENIED (`stack.size() <= 20`).
12. **Ghost Collection Access**: Read or write to `/internalSecrets/key` -> DENIED (global catch-all `allow read, write: if false`).
