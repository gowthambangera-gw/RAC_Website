
const accordionData = [
    {
        question: 'How far back can the RAC go in reviewing claims?',
        answer: 'The RAC can audit claims three (3) years from the Health First Colorado paid date after the 365-day timely filing deadline. Claims are subject to RAC audits if the paid date was within the last four (4) years but not within the last 365 days. Claims paid within the last 365 days are considered active and are not subject to an RAC audit.'
    },
    {
        question: 'What is an automated audit?',
        answer: 'Automated audits use data mining algorithms to identify overpaid claims based on Health First Colorado paid claims data. These audits compare claim data elements against established policies and rules without the need to review medical records.'
    },
    {
        question: 'What is a complex audit?',
        answer: 'A complex audit requires human review of medical records or other supporting documentation to evaluate the validity of claims submitted by a facility.'
    },
    {
        question: 'Will the RAC be conducting data mining and will providers receive notice?',
        answer: 'The RAC conducts ongoing data mining of claims processed by HCPF. Providers are not notified for automated reviews. For complex audits, a Medical Records Request letter will be sent.'
    },
    {
        question: 'Will the RAC audit all claims paid by HCPF?',
        answer: 'The RAC may review any claims submitted by a facility, especially if data mining identifies questionable billing patterns. Typically, audits are limited to specific projects and audit tiers defined in SB 25-314.'
    },
    {
        question: 'Will the audits focus only on institutional providers?',
        answer: 'No. Audits may include all provider types such as laboratories, physicians, therapists, durable medical equipment suppliers, long-term care, and home health providers.'
    },
    {
        question: 'How are claims selected for review?',
        answer: 'Claims are selected based on audit project focus. HMS uses data mining algorithms applied to procedure codes, diagnosis codes, DRGs, modifiers, and other claim elements.'
    },
    {
        question: 'Can I submit records electronically?',
        answer: 'Yes. Providers may submit electronic medical records through the HMS Provider Portal or via Secure File Transfer Protocol (SFTP), as outlined in the Medical Records Request letter.'
    },
    {
        question: 'How do I sign up to use the provider portal?',
        answer: 'Visit https://hmsportal.hms.com/, select “Register,” and then choose the Provider Card on the following screen.'
    },
    {
        question: 'Will the RAC pay for the cost of copying medical records?',
        answer: 'No. Colorado State Regulations do not require the RAC to pay for copying medical records.'
    },
    {
        question: 'How long do I have to respond to a Medical Records Request Letter?',
        answer: 'For complex audits, providers have 45 calendar days from receipt of the Medical Records Request letter to submit documentation.'
    },
    {
        question: 'What happens if there is a delay in obtaining requested medical records?',
        answer: 'Providers must notify the RAC in writing within 15 days of the Medical Records Request letter, explaining the delay and requesting an extension. The RAC will notify the provider whether the extension is approved or denied.'
    },
    {
        question: 'Will I have an opportunity to request an Exit Conference?',
        answer: 'Yes. Providers may request an Exit Conference within 30 days of receiving the Notice of Preliminary Findings using the provider portal or by contacting HMS Provider Services.'
    },
    {
        question: 'Can I submit additional documentation after receiving the Preliminary Findings Letter?',
        answer: 'Yes. For complex audits, providers may submit additional documentation at least 10 days before the Exit Conference. If no Exit Conference is requested, documentation may be submitted during the Informal Reconsideration phase.'
    },
    {
        question: 'What happens if I disagree with the findings in the Notice of Adverse Action?',
        answer: 'Providers may file a Formal Appeal with the Office of Administrative Courts within 30 calendar days of receiving the Notice of Adverse Action.'
    },
    {
        question: 'If I request an Informal Reconsideration or Formal Appeal, do I still have to repay the overpayment?',
        answer: 'Providers are not required to return disputed overpayments until the review process is complete. Unchallenged overpayments must be repaid.'
    },
    {
        question: 'What happens if I fail to respond to a Notice of Adverse Action?',
        answer: 'Failure to respond within 30 calendar days results in waiver of the right to a Formal Appeal, and HCPF may pursue recovery actions including interest assessment.'
    },
    {
        question: 'Can the RAC audit a claim already audited by another entity?',
        answer: 'No. Claims already audited or under audit by another state or federal agency for the same reason cannot be audited by the RAC.'
    },
    {
        question: 'What happens if I fail to respond to a Medical Records Request?',
        answer: 'Claims without submitted documentation within 45 days may result in a Technical Denial. Providers may later submit records during Preliminary Findings or Informal Reconsideration phases.'
    },
    {
        question: 'How does the RAC calculate overpayments?',
        answer: 'Overpayments are calculated as the amount paid in error.'
    },
    {
        question: 'How will overpayments be recouped?',
        answer: 'Providers may submit a refund check or money order, request an offset, or establish a payment plan as outlined in the Notice of Adverse Action.'
    },
    {
        question: 'Will the RAC provide education regarding billing errors?',
        answer: 'Yes. Each overpayment notice includes an explanation of the billing error and an offer of education via written correspondence, phone conference, or webinar.'
    },
    {
        question: 'What happens if my medical records are incomplete?',
        answer: 'Incomplete records may result in a Finding or Technical Denial, but providers retain rights to Informal Reconsideration or Formal Appeal.'
    },
    {
        question: 'How do I update my contact or address information in the HMS Provider Portal?',
        answer: 'Providers should review the HMS Provider Portal Training document or contact HMS Provider Services for assistance.'
    },
    {
        question: 'Are claims requiring prior authorization excluded from audits?',
        answer: 'No. Claims that require prior authorization may be included in RAC audit review projects.'
    }

];
