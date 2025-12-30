
jQuery(document).ready(function ($) {
    // Navbar scroll effect
    $(window).scroll(function () {
        if ($(this).scrollTop() > 50) {
            $('.navbar').addClass('scrolled');
        } else {
            $('.navbar').removeClass('scrolled');
        }

        if ($(this).scrollTop() > 300) {
            $('.scroll-top').addClass('show');
        } else {
            $('.scroll-top').removeClass('show');
        }
    });

    // Scroll to top
    $('.scroll-top').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 600);
    });

    // Hamburger menu animation and toggle
    $('.navbar-toggler').click(function () {
        
        var expanded = $(this).attr('aria-expanded') === 'true';
        $(this).toggleClass('active');
        $(this).attr('aria-expanded', !expanded);
        $('#navbarNav').toggleClass('show');
    });

    // Keyboard navigation for hamburger menu
    $('.navbar-toggler').keydown(function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            $(this).click();
        }
    });

    // Close mobile menu when clicking outside
    $(document).click(function (event) {
        var target = $(event.target);
        if (!target.closest('.navbar').length && $('#navbarNav').hasClass('show')) {
            $('.navbar-toggler').removeClass('active');
            $('.navbar-toggler').attr('aria-expanded', 'false');
            $('#navbarNav').removeClass('show');
        }
    });

    // Escape key to close mobile menu
    $(document).keydown(function (e) {
        if (e.key === 'Escape' && $('#navbarNav').hasClass('show')) {
            $('.navbar-toggler').removeClass('active');
            $('.navbar-toggler').attr('aria-expanded', 'false');
            $('#navbarNav').removeClass('show');
            $('.navbar-toggler').focus();
        }
    });

    // Smooth scrolling for anchor links
    $('a[href^="#"]').click(function (e) {
        var target = $(this).attr('href');
        if (target !== '#' && target !== '#home') {
            e.preventDefault();
            var targetElement = $(target);
            if (targetElement.length) {
                $('html, body').animate({
                    scrollTop: targetElement.offset().top - 80
                }, 600);

                // Set focus to target for accessibility
                targetElement.attr('tabindex', '-1').focus();
            }

            if ($('#navbarNav').hasClass('show')) {
                $('.navbar-toggler').removeClass('active');
                $('.navbar-toggler').attr('aria-expanded', 'false');
                $('#navbarNav').removeClass('show');
            }
        }
    });

    // Desktop dropdown - hover effect
    if ($(window).width() > 1199) {
        $('.dropdown').hover(
            function () {
                $(this).find('.dropdown-menu').addClass('show');
                $(this).find('.dropdown-toggle').attr('aria-expanded', 'true');
            },
            function () {
                $(this).find('.dropdown-menu').removeClass('show');
                $(this).find('.dropdown-toggle').attr('aria-expanded', 'false');
            }
        );
    }

    // Keyboard navigation for dropdown menus (Desktop and Mobile)
    $('.dropdown-toggle').on('keydown', function (e) {
        var parent = $(this).parent();
        var menu = $(this).next('.dropdown-menu');
        var isOpen = parent.hasClass('show');

        // Enter or Space to toggle dropdown
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();

            if ($(window).width() <= 1199) {
                // Mobile behavior
                $('.dropdown-menu').not(menu).removeClass('show').slideUp(300);
                $('.dropdown').not(parent).removeClass('show');

                menu.toggleClass('show');
                if (menu.hasClass('show')) {
                    menu.slideDown(300);
                    // Focus first item in dropdown
                    setTimeout(function () {
                        menu.find('.dropdown-item').first().focus();
                    }, 100);
                } else {
                    menu.slideUp(300);
                }

                parent.toggleClass('show');
                $(this).attr('aria-expanded', parent.hasClass('show'));
            } else {
                // Desktop behavior
                if (!isOpen) {
                    menu.addClass('show');
                    parent.addClass('show');
                    $(this).attr('aria-expanded', 'true');
                    // Focus first item in dropdown
                    setTimeout(function () {
                        menu.find('.dropdown-item').first().focus();
                    }, 100);
                } else {
                    menu.removeClass('show');
                    parent.removeClass('show');
                    $(this).attr('aria-expanded', 'false');
                }
            }
        }

        // Arrow Down to open and focus first item
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (!isOpen) {
                if ($(window).width() <= 1199) {
                    menu.addClass('show').slideDown(300);
                } else {
                    menu.addClass('show');
                }
                parent.addClass('show');
                $(this).attr('aria-expanded', 'true');
            }
            menu.find('.dropdown-item').first().focus();
        }

        // Escape to close dropdown
        if (e.key === 'Escape' && isOpen) {
            e.preventDefault();
            if ($(window).width() <= 1199) {
                menu.removeClass('show').slideUp(300);
            } else {
                menu.removeClass('show');
            }
            parent.removeClass('show');
            $(this).attr('aria-expanded', 'false');
            $(this).focus();
        }
    });

    // Keyboard navigation within dropdown items
    $('.dropdown-item').on('keydown', function (e) {
        var items = $(this).closest('.dropdown-menu').find('.dropdown-item');
        var currentIndex = items.index(this);
        var parent = $(this).closest('.dropdown');
        var toggle = parent.find('.dropdown-toggle');

        // Arrow Down - move to next item
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (currentIndex < items.length - 1) {
                items.eq(currentIndex + 1).focus();
            } else {
                items.first().focus(); // Loop to first
            }
        }

        // Arrow Up - move to previous item
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (currentIndex > 0) {
                items.eq(currentIndex - 1).focus();
            } else {
                toggle.focus(); // Go back to toggle
            }
        }

        // Escape - close dropdown and focus toggle
        if (e.key === 'Escape') {
            e.preventDefault();
            var menu = $(this).closest('.dropdown-menu');
            if ($(window).width() <= 1199) {
                menu.removeClass('show').slideUp(300);
            } else {
                menu.removeClass('show');
            }
            parent.removeClass('show');
            toggle.attr('aria-expanded', 'false');
            toggle.focus();
        }

        // Tab - close dropdown when tabbing out
        if (e.key === 'Tab' && !e.shiftKey) {
            if (currentIndex === items.length - 1) {
                var menu = $(this).closest('.dropdown-menu');
                if ($(window).width() <= 1199) {
                    menu.removeClass('show').slideUp(300);
                } else {
                    menu.removeClass('show');
                }
                parent.removeClass('show');
                toggle.attr('aria-expanded', 'false');
            }
        }
    });

    // Mobile dropdown - click to toggle
    $('.dropdown-toggle').click(function (e) {
        if ($(window).width() <= 1199) {
            e.preventDefault();
            e.stopPropagation();

            var parent = $(this).parent();
            var menu = $(this).next('.dropdown-menu');

            $('.dropdown-menu').not(menu).removeClass('show').slideUp(300);
            $('.dropdown').not(parent).removeClass('show');

            menu.toggleClass('show');
            if (menu.hasClass('show')) {
                menu.slideDown(300);
            } else {
                menu.slideUp(300);
            }

            parent.toggleClass('show');
            var isExpanded = parent.hasClass('show');
            $(this).attr('aria-expanded', isExpanded);
        }
    });

    // Prevent dropdown from closing when clicking inside on mobile
    $('.dropdown-menu').click(function (e) {
        if ($(window).width() <= 1199) {
            e.stopPropagation();
        }
    });

    // Close dropdowns when clicking dropdown items
    $('.dropdown-item').click(function (e) {
        var parent = $(this).closest('.dropdown');
        var menu = $(this).closest('.dropdown-menu');
        var toggle = parent.find('.dropdown-toggle');

        if ($(window).width() <= 1199) {
            menu.removeClass('show').slideUp(300);
            parent.removeClass('show');
            toggle.attr('aria-expanded', 'false');
            $('.navbar-toggler').removeClass('active');
            $('.navbar-toggler').attr('aria-expanded', 'false');
            $('#navbarNav').removeClass('show');
        } else {
            menu.removeClass('show');
            parent.removeClass('show');
            toggle.attr('aria-expanded', 'false');
        }
    });

    // Handle window resize
    $(window).resize(function () {
        if ($(window).width() > 1199) {
            $('.dropdown-menu').removeAttr('style').removeClass('show');
            $('.dropdown').removeClass('show');
            $('.dropdown-toggle').attr('aria-expanded', 'false');
            $('#navbarNav').removeClass('show');
            $('.navbar-toggler').removeClass('active');
            $('.navbar-toggler').attr('aria-expanded', 'false');
        }
    });

    // Keyboard accessibility for scroll to top
    $('.scroll-top').keydown(function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            $(this).click();
        }
    });

    // Search functionality
    $('#searchIcon').click(function () {
        $('#searchOverlay').addClass('active');
        $('body').css('overflow', 'hidden');
        setTimeout(function () {
            $('#searchInput').focus();
        }, 300);
    });

    $('#searchClose').click(function () {
        $('#searchOverlay').removeClass('active');
        $('body').css('overflow', '');
        $('#searchIcon').focus();
    });

    // Close search with Escape key
    $(document).keydown(function (e) {
        if (e.key === 'Escape' && $('#searchOverlay').hasClass('active')) {
            $('#searchOverlay').removeClass('active');
            $('body').css('overflow', '');
            $('#searchIcon').focus();
        }
    });

    // Close search when clicking outside search container
    $('#searchOverlay').click(function (e) {
        if ($(e.target).is('#searchOverlay')) {
            $('#searchOverlay').removeClass('active');
            $('body').css('overflow', '');
            $('#searchIcon').focus();
        }
    });

    // Search form submission
    $('.search-input-wrapper').submit(function (e) {
        e.preventDefault();
        var searchQuery = $('#searchInput').val();
        if (searchQuery.trim() !== '') {
            console.log('Searching for:', searchQuery);
            // Add your search logic here
            alert('Searching for: ' + searchQuery);
        }
    });

    // Trap focus within search overlay when active
    $('#searchOverlay').on('keydown', function (e) {
        if (!$(this).hasClass('active')) return;

        if (e.key === 'Tab') {
            var focusableElements = $('#searchOverlay').find('input, button');
            var firstElement = focusableElements.first();
            var lastElement = focusableElements.last();

            if (e.shiftKey) {
                if (document.activeElement === firstElement[0]) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement[0]) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    });


      $(function () {
    var $searchItem = $('#searchNavItem');
    var $navList = $searchItem.parent(); // original <ul>

    function moveSearchIcon() {
        if ($(window).width() <= 1199) {
            $('body').append($searchItem);
        } else {
            $navList.append($searchItem);
        }
    }

    moveSearchIcon();
    $(window).on('resize', moveSearchIcon);
});




});
