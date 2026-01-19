/**
 * Dynamic Table Generator Module with Search, Sort, and Pagination Functionality
 */
const TableGenerator = (function () {
    'use strict';

    const SORT_ICON_SVG = `
        <svg class="sort-icon" style="width: 13px; transform: translateY(-2px); margin-right: 10px; height: 17px; opacity: 1; vertical-align: middle;" width="334" height="534" viewBox="0 0 334 534" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path class="svg-path" fill-rule="evenodd" clip-rule="evenodd" d="M190.237 9.763C177.22 -3.25433 156.113 -3.25433 143.097 9.763L9.763 143.096C-3.25433 156.114 -3.25433 177.219 9.763 190.237C22.7807 203.253 43.886 203.253 56.9037 190.237L166.667 80.4737L276.43 190.237C289.447 203.253 310.553 203.253 323.57 190.237C336.587 177.219 336.587 156.114 323.57 143.096L190.237 9.763ZM9.763 390.237L143.097 523.57C156.113 536.587 177.22 536.587 190.237 523.57L323.57 390.237C336.587 377.22 336.587 356.113 323.57 343.097C310.553 330.08 289.447 330.08 276.43 343.097L166.667 452.86L56.9037 343.097C43.886 330.08 22.7807 330.08 9.763 343.097C-3.25433 356.113 -3.25433 377.22 9.763 390.237Z" fill="#F5F5F5"/>
        </svg>`;

    function init(data, targetContainerId, columns, options = {}) {
        // Per-table state so multiple tables can coexist on the same page.
        const state = {
            originalData: data,
            tableColumns: columns,
            containerId: targetContainerId,
            currentPage: 1,
            currentSort: { key: null, dir: 'asc' },
            currentSearchTerm: '',
            currentDataSet: null,
            sortConfig: options.sortConfig || {},
            itemsPerPage: options.itemsPerPage || 10,
            searchPlaceholder: options.searchPlaceholder || 'Search with letter name'
        };

        // Anchor container for this table instance.
        const wrapper = document.getElementById(state.containerId);
        if (!wrapper) {
            console.error(`Initialization failed: Container ID "${state.containerId}" not found.`);
            return;
        }

        // Unique search input id per table.
        const searchInputId = `${state.containerId}-search`;

        // Normalize list values to a clean array of items for list rendering.
        const normalizeListItems = (value) => {
            if (Array.isArray(value)) return value.map(item => String(item).trim()).filter(Boolean);
            return typeof value === 'string'
                ? value.split('\n').map(item => item.replace(/^\u2022\s*/u, '').trim()).filter(Boolean)
                : [];
        };

        // Sort data based on column config (string/custom/date).
        const sortData = (dataToSort, sortKey, sortDir) => {
            if (!sortKey) return dataToSort;

            const rule = state.sortConfig[sortKey] || {};
            const accessor = typeof rule.accessor === 'function' ? rule.accessor : (row) => row[sortKey];
            const direction = sortDir === 'asc' ? 1 : -1;
            const compare = {
                string: (a, b) => ((a || '').toString().toLowerCase()).localeCompare((b || '').toString().toLowerCase()) * direction,
                custom: (a, b) => {
                    if (!Array.isArray(rule.order)) return 0;
                    const order = sortDir === 'asc' ? rule.order : [...rule.order].reverse();
                    return order.indexOf((a || '').toString()) - order.indexOf((b || '').toString());
                },
                date: (a, b) => {
                    const aVal = Date.parse(a || '');
                    const bVal = Date.parse(b || '');
                    if (Number.isNaN(aVal) && Number.isNaN(bVal)) return 0;
                    if (Number.isNaN(aVal)) return 1;
                    if (Number.isNaN(bVal)) return -1;
                    return (aVal - bVal) * direction;
                }
            }[rule.type];

            if (!compare) return [...dataToSort];
            return [...dataToSort].sort((a, b) => compare(accessor(a), accessor(b)));
        };

        // Update page and re-render the table.
        const changePage = (pageNumber, dataSet) => {
            const data = dataSet || state.currentDataSet || state.originalData;
            const totalPages = Math.ceil(data.length / state.itemsPerPage);
            if (pageNumber < 1 || pageNumber > totalPages) return;
            state.currentPage = pageNumber;
            renderTable(data);
        };

        // Render the table markup, search box, and sort state.
        const renderTable = (dataToRender) => {
            state.currentDataSet = dataToRender;

            const sortedData = sortData(dataToRender, state.currentSort.key, state.currentSort.dir);
            const startIndex = (state.currentPage - 1) * state.itemsPerPage;
            const paginatedData = sortedData.slice(startIndex, startIndex + state.itemsPerPage);

            // Ensure the table container exists.
            let tableContainer = wrapper.querySelector('.table-container');
            if (!tableContainer) {
                tableContainer = document.createElement('div');
                tableContainer.className = 'table-container';
                wrapper.appendChild(tableContainer);
            }

            // Ensure the search box exists.
            if (!tableContainer.querySelector('.app-search-box')) {
                tableContainer.insertAdjacentHTML('afterbegin', `
                    <div class="app-search-box mb-3">
                        <form action="#" class="search-form">
                            <div class="form-group search-input-container">
                                <input type="text" class="form-control" id="${searchInputId}" placeholder="${state.searchPlaceholder}" aria-label="${state.searchPlaceholder}">
                                <span class="search-icon" aria-hidden="true">
                                    <svg width="22" height="22" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="14" cy="14" r="11" stroke="#2f3a42" stroke-width="2.5"/>
                                        <path d="M22.5 22.5L30 30" stroke="#2f3a42" stroke-width="2.5" stroke-linecap="round"/>
                                    </svg>
                                </span>
                            </div>
                        </form>
                    </div>
                `);
            }

            // Keep search input value in sync with state.
            const searchInput = tableContainer.querySelector(`#${searchInputId}`);
            if (searchInput && searchInput.value !== state.currentSearchTerm) {
                searchInput.value = state.currentSearchTerm;
            }

            // Build a single cell, including list and link rendering.
            const buildCellHtml = (rowData, col) => {
                const rawValue = rowData[col.key];
                const cellValue = rawValue === undefined || rawValue === null ? '' : String(rawValue);
                const listItems = (col.listStyle || Array.isArray(rawValue)) ? normalizeListItems(rawValue) : [];

                if (col.key === 'letterName' && rowData.url) {
                    return `<td><a href="${rowData.url}" target="_blank" rel="noopener noreferrer">${cellValue}</a></td>`;
                }

                if (listItems.length) {
                    const listClass = col.listStyleClass || 'list-style';
                    return `<td><ul class="${listClass}">${listItems.map(item => `<li>${item}</li>`).join('')}</ul></td>`;
                }

                return `<td>${cellValue}</td>`;
            };

            // Build header and row HTML in one pass for speed.
            const headerHtml = state.tableColumns.map(col => {
                const isSortable = !!state.sortConfig[col.key];
                return `
                    <th scope="col" width="${col.width || 'auto'}" data-sort-key="${col.key}" class="text-nowrap">
                        ${isSortable ? SORT_ICON_SVG : ''}<span>${col.header}</span>
                    </th>
                `;
            }).join('');

            const bodyHtml = paginatedData.map(rowData => `
                <tr>
                    ${state.tableColumns.map(col => buildCellHtml(rowData, col)).join('')}
                </tr>
            `).join('');

            // Replace the previous table on re-render.
            const existingTable = tableContainer.querySelector('.app-table');
            if (existingTable) existingTable.remove();

            const appTableWrapper = document.createElement('div');
            appTableWrapper.className = 'app-table table-responsive';
            appTableWrapper.innerHTML = `
                <table>
                    <thead><tr>${headerHtml}</tr></thead>
                    <tbody>${bodyHtml}</tbody>
                </table>
            `;
            tableContainer.appendChild(appTableWrapper);

            // Update the active sort icon after rendering.
            if (state.currentSort.key) {
                const svg = wrapper.querySelector(`th[data-sort-key="${state.currentSort.key}"] .sort-icon`);
                if (svg) {
                    svg.style.opacity = '1';
                    svg.style.transform = state.currentSort.dir === 'asc' ? 'rotate(0deg)' : 'rotate(180deg)';
                }
            }

            // Render pagination for the current dataset.
            renderPaginationControls(sortedData.length);
        };

        // Build and render pagination controls for the current dataset.
        const renderPaginationControls = (totalItems) => {
            const paginationScope = wrapper.parentElement || wrapper;
            const paginationContainer = paginationScope.querySelector('.table-pagination');
            const paginationList = paginationContainer?.querySelector('.pagination');
            if (!paginationContainer || !paginationList) return;

            const totalPages = Math.ceil(totalItems / state.itemsPerPage);
            if (totalPages <= 1) {
                paginationContainer.style.display = 'none';
                return;
            }

            paginationContainer.style.display = 'block';
            let html = '';

            // Previous button
            html += `
                <li class="page-item ${state.currentPage === 1 ? 'disabled' : ''}">
                    <a class="page-link"
                       href="javascript:void(0)"
                       ${state.currentPage === 1 ? 'aria-disabled="true" tabindex="-1"' : `data-page="${state.currentPage - 1}"`}
                       aria-label="Previous page">
                       Previous
                    </a>
                </li>
            `;

            // Page numbers
            for (let i = 1; i <= totalPages; i++) {
                const active = state.currentPage === i;
                html += `
                    <li class="page-item ${active ? 'active' : ''}">
                        <a class="page-link"
                           href="javascript:void(0)"
                           ${active ? 'aria-current="page"' : `data-page="${i}"`}
                           aria-label="Page ${i}">
                            <span>${i}</span>
                        </a>
                    </li>
                `;
            }

            // Next button
            html += `
                <li class="page-item ${state.currentPage === totalPages ? 'disabled' : ''}">
                    <a class="page-link"
                       href="javascript:void(0)"
                       ${state.currentPage === totalPages ? 'aria-disabled="true" tabindex="-1"' : `data-page="${state.currentPage + 1}"`}
                       aria-label="Next page">
                     Next
                    </a>
                </li>
            `;

            paginationList.innerHTML = html;

            // Delegate pagination clicks to a single handler.
            if (!paginationContainer.dataset.bound) {
                paginationContainer.addEventListener('click', (event) => {
                    const link = event.target.closest('a[data-page]');
                    if (!link) return;
                    event.preventDefault();
                    const page = Number(link.dataset.page);
                    if (!Number.isNaN(page)) changePage(page);
                });
                paginationContainer.dataset.bound = 'true';
            }
        };

        // Filter rows by a free-text search across all fields.
        const filterTable = (searchTerm) => {
            const rawTerm = searchTerm || '';
            const normalizedTerm = rawTerm.toLowerCase().trim();
            state.currentSearchTerm = rawTerm;

            const filteredData = normalizedTerm
                ? state.originalData.filter(row =>
                    Object.values(row).some(value =>
                        value !== null &&
                        value !== undefined &&
                        String(value).toLowerCase().includes(normalizedTerm)
                    )
                )
                : state.originalData;

            state.currentPage = 1;
            renderTable(filteredData);
        };

        // Bind sorting and search input events.
        const bindEvents = () => {
            wrapper.addEventListener('click', (event) => {
                const th = event.target.closest('th');
                if (!th) return;

                const sortKey = th.getAttribute('data-sort-key');
                if (!state.sortConfig[sortKey]) return;

                if (state.currentSort.key === sortKey) {
                    state.currentSort.dir = state.currentSort.dir === 'asc' ? 'desc' : 'asc';
                } else {
                    state.currentSort.key = sortKey;
                    state.currentSort.dir = 'asc';
                }

                const currentSearchTerm = wrapper.querySelector(`#${searchInputId}`)?.value || '';
                filterTable(currentSearchTerm);
            });

            wrapper.addEventListener('input', (event) => {
                if (event.target && event.target.id === searchInputId) {
                    filterTable(event.target.value);
                }
            });
        };

        // Initial bind + render.
        bindEvents();
        filterTable('');
    }

    return { init };
})();
