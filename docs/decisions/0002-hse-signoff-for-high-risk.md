# 0002 High-risk work orders need HSE sign-off before closing
Status: accepted
Why: closing high-risk work without a safety check is the most expensive mistake this app can enable.
Consequence: POST /close on a high-risk order without hseSignedOffBy returns 409 and sets status awaiting_hse. Only the hse role can sign off. Changing this rule needs the HSE lead's approval (CODEOWNERS).
