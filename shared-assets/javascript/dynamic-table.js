/**
 * Dynamic Table Generator Module with Search, Sort, and Pagination Functionality
 */
const TableGenerator = (function() {

    let originalData = [];
    let tableColumns = [];
    let containerId = ''; 
    let searchInputId = 'tableSearchInput'; 
    let currentSort = { key: null, dir: 'asc' };
    let currentSearchTerm = '';
    
    // --- Pagination Variables ---
    const itemsPerPage = 10; 
    let currentPage = 1;

    // Helper to create DOM nodes with attributes and classes
    const createElement = (tag, classes = [], attributes = {}, innerHTML = '') => {
        const element = document.createElement(tag);
        if (classes.length) {
            element.classList.add(...classes);
        }
        for (const key in attributes) {
            element.setAttribute(key, attributes[key]);
        }
        if (innerHTML) {
            element.innerHTML = innerHTML;
        }
        return element;
    };

    // --- Function: Sort Data ---
    const sortData = (dataToSort, sortKey, sortDir) => {
        const sorted = [...dataToSort];
        if (!sortKey) return sorted;

        if (sortKey === 'letterName') {
            sorted.sort((a, b) => {
                const aVal = (a[sortKey] || '').toString().toLowerCase();
                const bVal = (b[sortKey] || '').toString().toLowerCase();
                return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
            });
            return sorted;
        }

        if (sortKey === 'reviewType') {
            const orderAsc = ['Automated', 'Complex'];
            const orderDesc = ['Complex', 'Automated'];
            const order = sortDir === 'asc' ? orderAsc : orderDesc;
            sorted.sort((a, b) => {
                const aVal = (a[sortKey] || '').toString();
                const bVal = (b[sortKey] || '').toString();
                return order.indexOf(aVal) - order.indexOf(bVal);
            });
            return sorted;
        }

         if (sortKey === 'approvedOn') {
            sorted.sort((a, b) => {
                const aVal = Date.parse(a[sortKey] || '');
                const bVal = Date.parse(b[sortKey] || '');
                if (Number.isNaN(aVal) && Number.isNaN(bVal)) return 0;
                if (Number.isNaN(aVal)) return 1;
                if (Number.isNaN(bVal)) return -1;
                return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
            });
            return sorted;
        }
        return sorted;
    };

    // Update current page and re-render table
    const changePage = (pageNumber, data) => {
        const totalPages = Math.ceil(data.length / itemsPerPage);
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            currentPage = pageNumber;
            renderTable(data); 
        }
    };

    const renderTable = (dataToRender) => {
        const wrapperContainer = document.getElementById(containerId);

        if (!wrapperContainer) {
            console.error(`Table container with ID "${containerId}" not found.`);
            return;
        }
        
        // Sort the full filtered data before pagination
        const sortedDataToRender = sortData(dataToRender, currentSort.key, currentSort.dir);

        // Paginater the sorted data
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        // Slice the data to show only the items for the current page
        const paginatedData = sortedDataToRender.slice(startIndex, endIndex);

        let tableContainer = wrapperContainer.querySelector('.table-container');
        if (!tableContainer) {
            tableContainer = createElement('div', ['table-container']);
            wrapperContainer.appendChild(tableContainer);
        }

        let searchBox = tableContainer.querySelector('.app-search-box');
        if (!searchBox) {
            const searchBoxHTML = `
                <div class="app-search-box mb-3">
                    <form action="#" class="search-form">
                        <div class="form-group search-input-container">
                            <input type="text" class="form-control" id="${searchInputId}" placeholder="Search with letter name" aria-label="Search with letter name">
                            <span class="search-icon" aria-hidden="true">
                                <svg width="22" height="22" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="14" cy="14" r="11" stroke="#2f3a42" stroke-width="2.5"/>
                                    <path d="M22.5 22.5L30 30" stroke="#2f3a42" stroke-width="2.5" stroke-linecap="round"/>
                                </svg>
                            </span>
                        </div>
                    </form>
                </div>
            `;
            tableContainer.insertAdjacentHTML('afterbegin', searchBoxHTML);
            searchBox = tableContainer.querySelector('.app-search-box');
        }

        // Sync search input value with currentSearchTerm state
         const searchInput = tableContainer.querySelector(`#${searchInputId}`);
        if (searchInput && searchInput.value !== currentSearchTerm) {
            searchInput.value = currentSearchTerm;
        }

        // Remove the old table before rendering a new one
        const existingTable = tableContainer.querySelector('.app-table');
        if (existingTable) {
            existingTable.remove();
        }
        const appTableWrapper = createElement('div', ['app-table', 'table-responsive']);
        const table = createElement('table');
        
        const thead = createElement('thead');
        const headerRow = createElement('tr');

        tableColumns.forEach(col => {
            const th = createElement('th', ['text-nowrap'], { 
                'scope': 'col', 
                'width': col.width || 'auto',
                'data-sort-key': col.key 
            });
            // Only show sort icon for sortable columns
            const isSortable = col.key === 'letterName' || col.key === 'reviewType' || col.key === 'approvedOn';
            const sortIconSvg = `
            <svg class="sort-icon" style="width: 13px; transform: translateY(-2px); margin-right: 10px; height: 17px; opacity: 0.3; vertical-align: middle;" width="334" height="534" viewBox="0 0 334 534" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path class="svg-path" fill-rule="evenodd" clip-rule="evenodd" d="M190.237 9.763C177.22 -3.25433 156.113 -3.25433 143.097 9.763L9.763 143.096C-3.25433 156.114 -3.25433 177.219 9.763 190.237C22.7807 203.253 43.886 203.253 56.9037 190.237L166.667 80.4737L276.43 190.237C289.447 203.253 310.553 203.253 323.57 190.237C336.587 177.219 336.587 156.114 323.57 143.096L190.237 9.763ZM9.763 390.237L143.097 523.57C156.113 536.587 177.22 536.587 190.237 523.57L323.57 390.237C336.587 377.22 336.587 356.113 323.57 343.097C310.553 330.08 289.447 330.08 276.43 343.097L166.667 452.86L56.9037 343.097C43.886 330.08 22.7807 330.08 9.763 343.097C-3.25433 356.113 -3.25433 377.22 9.763 390.237Z" fill="#F5F5F5"/>
            </svg>`;
            const headerHTML = `${isSortable ? sortIconSvg : ''}<span>${col.header}</span>`;
            th.innerHTML = headerHTML;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = createElement('tbody');
        // Iterate over paginated data for current page
        paginatedData.forEach(rowData => {
            const tr = createElement('tr');
            tableColumns.forEach(col => {
                const cellValue = rowData[col.key] !== undefined && rowData[col.key] !== null ? String(rowData[col.key]) : '';
                
                if (col.key === 'letterName' && rowData.url) {
                    const td = createElement('td');
                    td.innerHTML = `<a href="${rowData.url}" target="_blank" rel="noopener noreferrer">${cellValue}</a>`;
                    tr.appendChild(td);
                } else {
                    tr.appendChild(createElement('td', [], {}, cellValue));
                }
            });
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);

        appTableWrapper.appendChild(table);
        tableContainer.appendChild(appTableWrapper);

        // Update active sort icon visuals after rendering
        if (currentSort.key) {
            const activeHeader = wrapperContainer.querySelector(`th[data-sort-key="${currentSort.key}"]`);
            if (activeHeader) {
                const svg = activeHeader.querySelector('.sort-icon');
                svg.style.opacity = '1'; 
                if (currentSort.dir === 'asc') {
                    svg.style.transform = 'rotate(0deg)'; 
                } else {
                    svg.style.transform = 'rotate(180deg)';
                }
            }
        }
        
        // --- Render Pagination Controls for Current Data Set
        renderPaginationControls(sortedDataToRender.length, dataToRender);
    };

    // Build pagination UI based on total items and current page
    const renderPaginationControls = (totalItems, currentDataSet) => {
        let paginationContainer = document.getElementById('tablePagination');
        if (!paginationContainer) {
            paginationContainer = createElement('div', ['pagination-container'], { 'id': 'tablePagination' });
            document.getElementById(containerId).appendChild(paginationContainer);
        } else {
            paginationContainer.innerHTML = ''; // Clear existing controls
        }

        const totalPages = Math.ceil(totalItems / itemsPerPage);

        if (totalPages <= 1) {
            paginationContainer.style.display = 'none';
            return;
        }

        paginationContainer.style.display = 'block';
        const nav = createElement('nav', [], { 'aria-label': 'Table pagination' });
        const ul = createElement('ul', ['pagination', 'justify-content-center']);

        // Previous button
        const prevDisabled = currentPage === 1;
        const prevLi = createElement('li', ['page-item', ...(prevDisabled ? ['disabled'] : [])]);
        const prevA = createElement('a', ['page-link'], { 'href': '#', 'aria-label': 'Previous', 'tabindex': prevDisabled ? '-1' : null });
        prevA.innerHTML = 'Previous';
        prevA.addEventListener('click', (e) => {
            e.preventDefault();
            // Pass the currentDataSet to changePage
            if (!prevDisabled) changePage(currentPage - 1, currentDataSet);
        });
        prevLi.appendChild(prevA);
        ul.appendChild(prevLi);

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            const active = currentPage === i;
            const li = createElement('li', ['page-item', ...(active ? ['active'] : [])]);
            const a = createElement('a', ['page-link'], { 'href': '#' });
            a.textContent = i;
            if (active) a.setAttribute('aria-current', 'page');
            a.addEventListener('click', (e) => {
                e.preventDefault();
                // Pass the currentDataSet to changePage
                changePage(i, currentDataSet);
            });
            li.appendChild(a);
            ul.appendChild(li);
        }

        // Next button
        const nextDisabled = currentPage === totalPages;
        const nextLi = createElement('li', ['page-item', ...(nextDisabled ? ['disabled'] : [])]);
        const nextA = createElement('a', ['page-link'], { 'href': '#', 'aria-label': 'Next', 'tabindex': nextDisabled ? '-1' : null });
        nextA.innerHTML = 'Next';
        nextA.addEventListener('click', (e) => {
            e.preventDefault();
            // Pass the currentDataSet to changePage
            if (!nextDisabled) changePage(currentPage + 1, currentDataSet);
        });
        nextLi.appendChild(nextA);
        ul.appendChild(nextLi);

        nav.appendChild(ul);
        paginationContainer.appendChild(nav);
    };


    // Filter data by free-text search across all fields
    const filterTable = (searchTerm) => {
        // Update the module state's search term
        currentSearchTerm = searchTerm;
        const lowerCaseSearch = searchTerm.toLowerCase().trim();
        let filteredData;
        
        if (!lowerCaseSearch) {
            filteredData = originalData;
        } else {
            filteredData = originalData.filter(row => {
                return Object.values(row).some(value => {
                    if (value === null || value === undefined) return false;
                    return String(value).toLowerCase().includes(lowerCaseSearch);
                });
            });
        }
        
        // When filter runs, reset to the first page (important for usability)
        currentPage = 1;
        // The current sort state is used internally by renderTable
        renderTable(filteredData);
    };
    
    // --- Function: Initialization ---
    const init = (data, targetContainerId, columns) => {
        originalData = data;
        tableColumns = columns;
        containerId = targetContainerId;
        currentPage = 1; // Start on page 1

        const wrapperContainer = document.getElementById(containerId);
        if (!wrapperContainer) {
            console.error(`Initialization failed: Container ID "${containerId}" not found.`);
            return;
        }

        // Add sorting click listener to wrapper (delegation)
        wrapperContainer.addEventListener('click', (event) => {
            const th = event.target.closest('th');
            if (!th) return;
            
            const sortKey = th.getAttribute('data-sort-key');
            if (sortKey !== 'letterName' && sortKey !== 'reviewType' && sortKey !== 'approvedOn') return;

            if (currentSort.key === sortKey) {
                currentSort.dir = currentSort.dir === 'asc' ? 'desc' : 'asc';
            } else {
                currentSort.key = sortKey;
                currentSort.dir = 'asc';
            }

            // Re-run filterTable to apply sorting on the current filtered data
            const currentSearchTerm = document.getElementById(searchInputId)?.value || '';
            filterTable(currentSearchTerm); 
        });

        // Live search handler
        wrapperContainer.addEventListener('input', (event) => {
            if (event.target && event.target.id === searchInputId) {
                filterTable(event.target.value);
            }
        });
        
        // Initial render with full data
        filterTable('');
    };

    return {
        init: init
    };
})();

// Initialization Call (Example Usage - requires dynamicTableData and dynamicTableColumns to be defined in scope)
document.addEventListener('DOMContentLoaded', () => {
    TableGenerator.init(dynamicTableData, 'dynamicTableContainer', dynamicTableColumns);
});
