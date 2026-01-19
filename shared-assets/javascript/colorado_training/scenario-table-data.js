// Scenario table data and initialization using the existing dynamic table component.
const coloradoTableData = [
    {
        scenarioName: 'EMT Trips without Medical Claim',
        scenarioType: 'Automated',
        scenarioDescription: 'Where an EMT service was billed without an Outpatient or Inpatient hospital admission or transfer between hospitals.',
        providerType: ['Emergency Medical Transport', 'Hospitals'],
        dateApproved: '10/16/2025'
    },
    {
        scenarioName: 'Professional Duplicates',
        scenarioType: 'Automated',
        scenarioDescription: 'Two or more paid professional claims with the same date of service and same procedure code are not allowed.',
        providerType: ['Physicians – Office/Group', 'Non-physician practitioners/Group', 'Podiatrists', 'Clinic Practitioners', 'DME Providers'],
        dateApproved: '10/16/2025'
    }
];

const coloradoTableColumns = [
    { header: 'Scenario Name', key: 'scenarioName', width: '230px' },
    { header: 'Scenario Type', key: 'scenarioType', width: '170px' },
    { header: 'Scenario Description', key: 'scenarioDescription', width: '380px' },
    { header: 'Provider Type', key: 'providerType', width: '280px',  listStyle: true },
    { header: 'Date Approved', key: 'dateApproved', width: '160px' }
];

document.addEventListener('DOMContentLoaded', () => {
    TableGenerator.init(coloradoTableData, 'scenarioTableContainer', coloradoTableColumns, {
        sortConfig: {
            scenarioName: { type: 'string' },
            scenarioType: { type: 'custom', order: ['Automated', 'Complex'] },
            providerType: { type: 'string' },
            dateApproved: { type: 'date' }
        },
        searchPlaceholder: 'Search with Scenario Name'
    });
});
