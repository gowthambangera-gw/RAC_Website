/**
 * Video Gallery Core Script
 * This file remains THE SAME across all state websites
 * Only video-data.js changes per state
 */

(function () {
    'use strict';

    // Wait for video data to be loaded
    if (typeof videoData === 'undefined') {
        console.error('Video data not loaded. Please include video-data.js before video-gallery.js');
        return;
    }

    let currentPage = 1;
    const videosPerPage = 6;

    function filterVideos() {
        const type = document.getElementById('typeFilter').value;
        return videoData.filter(video => type === 'all' || video.type === type);
    }

    function renderVideos() {
        const filteredVideos = filterVideos();
        const container = document.getElementById('videoContainer');
        const paginationContainer = document.getElementById('paginationContainer');

        if (!container) return;

        if (filteredVideos.length === 0) {
            container.innerHTML = '<div class="col-12"><div class="no-results" role="status"><h4>No videos found</h4><p>Try adjusting your filters</p></div></div>';
            if (paginationContainer) paginationContainer.style.display = 'none';
            announceToScreenReader('No videos found. Try adjusting your filters.');
            return;
        }

        const startIndex = (currentPage - 1) * videosPerPage;
        const endIndex = startIndex + videosPerPage;
        const videosToShow = filteredVideos.slice(startIndex, endIndex);

        container.innerHTML = videosToShow.map(video => `
            <div class="col-md-6 col-lg-4" role="listitem">
                <article class="video-card">
                    <div class="video-thumbnail">
                        <img src="${video.thumbnail}" alt="" role="presentation">
                        <button 
                            class="play-button" 
                            onclick="window.open('${video.videoUrl}', '_blank')"
                            aria-label="Play video: ${video.title}"
                            type="button">
                            <span class="play-icon" aria-hidden="true"></span>
                        </button>
                    </div>
                    <div class="video-content">
                        <h3 class="video-title">${video.title}</h3>
                        <p class="video-date">
                            <time datetime="${formatDateISO(video.date)}">Updated on: ${video.date}</time>
                        </p>
                        <a href="${video.videoUrl}" 
                           class="watch-link" 
                           target="_blank" 
                           rel="noopener noreferrer"
                           aria-label="Watch ${video.title} (opens in new tab)">
                            Watch Now
                        </a>
                    </div>
                </article>
            </div>
        `).join('');

        renderPagination(filteredVideos.length);
        announceToScreenReader(`Showing ${videosToShow.length} of ${filteredVideos.length} videos. Page ${currentPage}.`);
    }

    function formatDateISO(dateStr) {
        const parts = dateStr.split('/');
        if (parts.length !== 3) return dateStr;
        return `20${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
    }

    function announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'visually-hidden';
        announcement.textContent = message;
        document.body.appendChild(announcement);
        setTimeout(() => announcement.remove(), 1000);
    }

    function renderPagination(totalVideos) {
        const paginationContainer = document.getElementById('paginationContainer');
        if (!paginationContainer) return;

        const totalPages = Math.ceil(totalVideos / videosPerPage);

        if (totalPages <= 1) {
            paginationContainer.style.display = 'none';
            return;
        }

        paginationContainer.style.display = 'block';
        const pagination = paginationContainer.querySelector('.pagination');
        if (!pagination) return;

        let html = '';

        // Previous button
        html += `
            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" 
                   href="javascript:void(0)" 
                   ${currentPage === 1 ? 'aria-disabled="true" tabindex="-1"' : ''} 
                   onclick="${currentPage === 1 ? 'return false;' : `window.videoGallery.changePage(${currentPage - 1}); return false;`}"
                   aria-label="Previous page">
                   Previous
                </a>
            </li>
        `;

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            html += `
                <li class="page-item ${currentPage === i ? 'active' : ''}">
                    <a class="page-link" 
                       href="javascript:void(0)" 
                       onclick="window.videoGallery.changePage(${i}); return false;"
                       aria-label="Page ${i}"
                       ${currentPage === i ? 'aria-current="page"' : ''}>
                        <span>${i}</span>
                    </a>
                </li>
            `;
        }

        // Next button
        html += `
            <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" 
                   href="javascript:void(0)" 
                   ${currentPage === totalPages ? 'aria-disabled="true" tabindex="-1"' : ''} 
                   onclick="${currentPage === totalPages ? 'return false;' : `window.videoGallery.changePage(${currentPage + 1}); return false;`}"
                   aria-label="Next page">
                 Next
                </a>
            </li>
        `;

        pagination.innerHTML = html;
    }

    function changePage(page) {
        const filteredVideos = filterVideos();
        const totalPages = Math.ceil(filteredVideos.length / videosPerPage);

        if (page < 1 || page > totalPages) return;

        currentPage = page;
        renderVideos();

        const videoContainer = document.getElementById('videoContainer');
        if (videoContainer) {
            const containerTop = videoContainer.getBoundingClientRect().top + window.pageYOffset - 100;
            window.scrollTo({ top: containerTop, behavior: 'smooth' });
        }
    }

    // Initialize
    function init() {
        const filterElement = document.getElementById('typeFilter');
        if (filterElement) {
            filterElement.addEventListener('change', () => {
                currentPage = 1;
                renderVideos();
            });
        }
        renderVideos();
    }

    // Expose public API
    window.videoGallery = {
        changePage: changePage,
        refresh: renderVideos,
        reset: function () {
            currentPage = 1;
            const filterElement = document.getElementById('typeFilter');
            if (filterElement) filterElement.value = 'all';
            renderVideos();
        }
    };

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();