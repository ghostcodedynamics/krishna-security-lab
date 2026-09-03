# Lab flag reference (for maintainers / automated checks)

| Lab | Port | Flag |
|-----|------|------|
| auth | 4001 | KSL{weak_auth_default_creds_bypass} |
| nosql-injection | 4002 | KSL{nosql_operator_injection_bypass} |
| xss | 4003 | KSL{xss_reflected_and_stored_mastered} |
| idor | 4004 | KSL{idor_horizontal_privilege_escalation} |
| jwt | 4005 | KSL{jwt_none_alg_and_weak_secret} |
| api-security | 4006 | KSL{api_mass_assignment_and_exposure} |
| rbac | 4007 | KSL{rbac_client_role_not_trusted} |
| final-boss | — | KSL{cyber_guardian_security_core_unlocked} |

Never deploy lab containers to the public internet without isolation.
