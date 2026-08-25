# Studio App Security Specification

## Data Invariants
- A project must have an owner (the creator).
- Sub-resources (dimensions, spaces, etc.) must belong to an existing project.
- Access to project data is restricted to authorized team members or the owner.
- Clients can only see what is specifically shared or assigned to them (sandboxed).
- Critical status transitions (like Approval) are protected.

## The Dirty Dozen Payloads (Logic Leaks)

1. **Identity Spoofing (Project Creation)**: Try to create a project with someone else's `ownerId`.
2. **Project Hijacking**: Try to update a project's `ownerId` to yourself when you're just a member.
3. **Ghost Team Entry**: Try to add yourself to a project's team without being the project admin.
4. **Dimension Poisoning**: Try to inject a 1MB string into a dimension field.
5. **Orphaned Writes**: Try to create a dimension for a non-existent project ID.
6. **Approval Shortcut**: Try to approve your own design module when you're a Junior Designer.
7. **PII Leak**: Try to read the master `projects` collection without being a member of any project.
8. **Shadow Field Injection**: Try to add `isVerified: true` to a project document during update.
9. **Temporal Tampering**: Try to set a future `createdAt` date.
10. **Revision Erasure**: Try to delete a revision log entry.
11. **Client Escalation**: Try to access `drawings` as a user with the `Client` role.
12. **Bulk Extraction**: Try to list all projects in the database without any filters.

## Implementation Status
- `DRAFT_firestore.rules` created.
- Testing against the Dirty Dozen required.
