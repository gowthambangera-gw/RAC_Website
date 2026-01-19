// This data array has been expanded to test the pagination feature of the dynamic table.
const dynamicTableData = [
    { 
        letterName: 'Notice of Preliminary Findings', url: '#',
        reviewType: 'Automated', 
        description: 'Notice of Preliminary Findings', 
        approvedOn: '10/27/2025' 
    },
    { 
        letterName: 'Notice of Informal Reconsideration', url: '#',
        reviewType: 'Automated', 
        description: 'The Notice of Preliminary Findings letter also provided instructions to identify which claims you agree or disagree are overpayment', 
        approvedOn: '10/07/2025' 
    },
    { 
        letterName: 'NOAA No Participation in IR No Appeal Rights', url: '#',
        reviewType: 'Automated', 
        description: 'Notice of Adverse Action, Overpayment Determination due to Failure to Participate in Informal Reconsideration', 
        approvedOn: '10/27/2025' 
    },
    { 
        letterName: 'NOAA Provider Agrees No Appeal Rights', url: '#',
        reviewType: 'Automated', 
        description: 'Notice of Adverse Action, Overpayment Determination due to Provider Agreement with Preliminary Findings', 
        approvedOn: '10/27/2025' 
    },
    { 
        letterName: 'NOAA With Appeal Rights', url: '#',
        reviewType: 'Automated', 
        description: 'Notice of Adverse Action, Overpayment Determination', 
        approvedOn: '10/27/2025' 
    },

    { 
        letterName: 'Notice of Preliminary Findings', url: '#',
        reviewType: 'Automated', 
        description: 'Notice of Preliminary Findings', 
        approvedOn: '10/27/2025' 
    },
    { 
        letterName: 'Notice of Informal Reconsideration', url: '#',
        reviewType: 'Automated', 
        description: 'The Notice of Preliminary Findings letter also provided instructions to identify which claims you agree or disagree are overpayment', 
        approvedOn: '10/07/2025' 
    },
    { 
        letterName: 'NOAA No Participation in IR No Appeal Rights', url: '#',
        reviewType: 'Automated', 
        description: 'Notice of Adverse Action, Overpayment Determination due to Failure to Participate in Informal Reconsideration', 
        approvedOn: '10/27/2025' 
    },
    { 
        letterName: 'NOAA Provider Agrees No Appeal Rights', url: '#',
        reviewType: 'Automated', 
        description: 'Notice of Adverse Action, Overpayment Determination due to Provider Agreement with Preliminary Findings', 
        approvedOn: '10/27/2025' 
    },
    { 
        letterName: 'NOAA With Appeal Rights', url: '#',
        reviewType: 'Automated', 
        description: 'Notice of Adverse Action, Overpayment Determination', 
        approvedOn: '10/27/2025' 
    }

];

const dynamicTableColumns = [
    { header: 'Letter Name', key: 'letterName', width: '270px' },
    { header: 'Review Type', key: 'reviewType', width: '150px' },
    { header: 'Description', key: 'description', width: '480px' },
    { header: 'Approved On', key: 'approvedOn', width: '150px' }
];

document.addEventListener('DOMContentLoaded', () => {
    TableGenerator.init(dynamicTableData, 'dynamicTableContainer', dynamicTableColumns, {
        sortConfig: {
            letterName: { type: 'string' },
            reviewType: { type: 'custom', order: ['Automated', 'Complex'] },
            approvedOn: { type: 'date' }
        },
        searchPlaceholder: 'Search with letter name'
    });
});