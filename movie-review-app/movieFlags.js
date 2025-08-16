/* =================================================================
   CINEFLAG - MOVIE FLAGS JAVASCRIPT
   LaunchDarkly Feature Flag Integration for Movie Review Demo
   ================================================================= */

// LaunchDarkly Client-side ID - connects this app to your LaunchDarkly project
// This key identifies your specific LaunchDarkly environment (Test environment)
// IMPORTANT: Replace this key if you recreate the LaunchDarkly project
const LAUNCHDARKLY_CLIENT_ID = '689fad12b1c0dd098ae7fd25';

// Global LaunchDarkly client variable - will be initialized when app loads
let ldClient;

// Current user context - starts as basic user, can be changed for targeting demo
//note: individual targeting would be good for testing and special cases,less scalable in comparison to rule based
let currentUser = { //this is where if we want to target an individual or a group we would use their key right now this key is spencer13wirght's email
    kind: 'user',
    key: 'spencer13wright@gmail.com',
    name: 'Spencer Wright',
    subscription: 'basic',  // This attribute controls premium feature targeting
    preferredGenre: 'action' // This attribute can be used for content targeting
};

// Movie database - your selected films with poster URLs and ratings
const movies = [
    {
        title: 'Past Lives',
        year: 2023,
        poster: 'https://cdn.printerval.com/unsafe/960x960/assets.printerval.com/2024/06/24/66792e5866f322.42813479.webp',
        alternativePosters: [

            'https://cdn.printerval.com/unsafe/960x960/assets.printerval.com/2024/06/24/66792e5866f322.42813479.webp',
            'https://preview.redd.it/poster-design-i-made-for-past-lives-v0-9kz0isyjg4lc1.jpeg?width=1080&crop=smart&auto=webp&s=4f849f49e603c3a7f3fdadb7b834e265d5654d70',
            'https://posterspy.com/wp-content/uploads/2024/01/Past-Lives-Smaller.jpg'
                        
            ],


        rating: 5,
        genre: 'drama'
    },
    {
        title: 'Creed II',
        year: 2018,
        poster: 'https://m.media-amazon.com/images/I/81wAkoRZhuL._AC_SY300_SX300_QL70_FMwebp_.jpg',
        alternativePosters : [

            'https://m.media-amazon.com/images/I/81wAkoRZhuL._AC_SY300_SX300_QL70_FMwebp_.jpg',
            'https://m.media-amazon.com/images/I/71R2h2-qUEL._AC_SY300_SX300_QL70_FMwebp_.jpg',
            'https://i.ebayimg.com/images/g/5hQAAOSwsqxb~2ag/s-l1600.webp',
        ],


        rating: 5.0,
        genre: 'action'
    },

    {
        title: 'Spider-Man: No Way Home',
        year: 2021,
        poster: 'https://m.media-amazon.com/images/M/MV5BZWMyYzFjYTYtNTRjYi00OGExLWE2YzgtOGRmYjAxZTU3NzBiXkEyXkFqcGdeQXVyMzQ0MzA0NTM@._V1_.jpg',
        alternativePosters: [

            'https://m.media-amazon.com/images/M/MV5BZWMyYzFjYTYtNTRjYi00OGExLWE2YzgtOGRmYjAxZTU3NzBiXkEyXkFqcGdeQXVyMzQ0MzA0NTM@._V1_.jpg',
            'https://posterspy.com/wp-content/uploads/2022/01/Spiderman-no-way-home-SD.jpg',
            'https://m.media-amazon.com/images/I/71gx5DiQa-L._AC_SY300_SX300_QL70_FMwebp_.jpg',



        ],
        rating: 5,
        genre: 'action'
    },
    {
        title: 'The Fall Guy',
        year: 2024,
        poster: 'https://m.media-amazon.com/images/I/71ic9Y0ECYL._AC_SY879_.jpg',
        alternativePosters: [

            'https://m.media-amazon.com/images/I/71ic9Y0ECYL._AC_SY879_.jpg',
            'https://pbs.twimg.com/media/GAI1GaFWEAEG83y.jpg:large',
            'https://s.yimg.com/ny/api/res/1.2/y0z9CO3VdrbrUaM0UnjErQ--/YXBwaWQ9aGlnaGxhbmRlcjt3PTk2MDtoPTEyMDA7Y2Y9d2VicA--/https://media.zenfs.com/en/creative_bloq_161/594d1b5a609eb84fe14b83d90316b1ce',


        ],
        rating: 3,
        genre: 'action'
    },
    {
        title: 'The Secret Life of Walter Mitty',
        year: 2013,
        poster: 'https://m.media-amazon.com/images/I/61DEdH0DQ9L._AC_SY300_SX300_QL70_FMwebp_.jpg',
        alternativePosters: [

            'https://m.media-amazon.com/images/I/61DEdH0DQ9L._AC_SY300_SX300_QL70_FMwebp_.jpg',
            'https://s.movieinsider.com/images/p/141524_m1377314741.jpg',
            'https://i.pinimg.com/736x/1a/3e/84/1a3e84bd7e1aa758a03c2b2d66304b3b.jpg',

        ],
        rating: 2,
        genre: 'drama'
    },
    {
        title: 'Good Will Hunting',
        year: 1997,
        poster: 'https://m.media-amazon.com/images/M/MV5BOTI0MzcxMTYtZDVkMy00NjY1LTgyMTYtZmUxN2M3NmQ2NWJhXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg',
        alternativePosters: [

            'https://m.media-amazon.com/images/M/MV5BOTI0MzcxMTYtZDVkMy00NjY1LTgyMTYtZmUxN2M3NmQ2NWJhXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg',
            'https://ih1.redbubble.net/image.2785192337.5833/fposter,small,wall_texture,square_product,600x600.jpg',
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTm8v2hFqvKp6aXlZDqE2riPiEgbN67ONXpZA&s',


        ],
        rating: 4.7,
        genre: 'drama'
    },
    {
        title: 'The Holdovers',
        year: 2023,
        poster: 'https://m.media-amazon.com/images/I/61lmosvvXlL._AC_SY300_SX300_QL70_FMwebp_.jpg',
        alternativePosters: [

            'https://m.media-amazon.com/images/I/61lmosvvXlL._AC_SY300_SX300_QL70_FMwebp_.jpg',
            'https://posterspy.com/wp-content/uploads/2025/03/Holdovers-poster.jpg',
            'https://i.ebayimg.com/00/s/MTYwMFgxMDY2/z/-lYAAOSwyOllr9-S/$_57.JPG?set_id=880000500F',

        ],
        rating: 4.3,
        genre: 'drama'
    },
    {
        title: 'Stronger',
        year: 2017,
        poster: 'https://m.media-amazon.com/images/I/71h23zeABgL._AC_SY300_SX300_QL70_FMwebp_.jpg',
        alternativePosters: [

            'https://m.media-amazon.com/images/I/71h23zeABgL._AC_SY300_SX300_QL70_FMwebp_.jpg',
            'https://lh5.googleusercontent.com/proxy/Tj9nbiXT5Qho8qp_5wlq23c41nXRT03wYXUKxsYssh9jw22S_UZ9J_hNLkGvFAmwwRGA6PjI_hJC5a1koeuxUKpgud__ZfaLQLc',
            'https://m.media-amazon.com/images/M/MV5BOTc2MGZjZTQtODBlZi00NDQ4LTg1M2YtMmI2NWIxNGU3YzA2XkEyXkFqcGc@._V1_.jpg',

        ],
        rating: 4.0,
        genre: 'drama'
    },
    {
        title: 'Coach Carter',
        year: 2005,
        poster: 'https://m.media-amazon.com/images/I/512igbbJVyL._AC_SY300_SX300_QL70_FMwebp_.jpg',
        alternativePosters: [

            'https://m.media-amazon.com/images/I/512igbbJVyL._AC_SY300_SX300_QL70_FMwebp_.jpg',
            'https://media-cache.cinematerial.com/p/500x/fqrxydvk/coach-carter-movie-cover.jpg?v=1456190587', 
            'https://lh4.googleusercontent.com/proxy/pAtpe-EfVMkRf0BGvAJ_GN70uBeE9gBXG1KuElG0OpWNPY498_6ZL4WyGVWe3vZfMMqII9ssR5M2pRvS3r99YJ00fnCBRLBkNCXx8T51',


        ],
        rating: 4.2,
        genre: 'drama'
    },
    {
        title: 'Creed',
        year: 2015,
        poster: 'https://m.media-amazon.com/images/I/61F7-FA+2JL._AC_SY300_SX300_QL70_FMwebp_.jpg',
        alternativePosters: [

            'https://m.media-amazon.com/images/I/61F7-FA+2JL._AC_SY300_SX300_QL70_FMwebp_.jpg',
            'https://posterspy.com/wp-content/uploads/2018/10/Creed-Poster-web.jpg',
            'https://i.pinimg.com/736x/0e/8e/27/0e8e27a2eb85825dff6fe272ddd2f648.jpg',

        ],
        rating: 4.4,
        genre: 'action'
    }
];

/* =================================================================
   LAUNCHDARKLY INITIALIZATION
   This section handles connecting to LaunchDarkly and setting up
   real-time feature flag updates
   ================================================================= */

/**
 * Initialize LaunchDarkly client and set up feature flag listeners
 * This function runs when the page loads
 */
async function initializeLaunchDarkly() {
    try {
        console.log('🚀 Initializing LaunchDarkly client...');
        
        // Initialize the LaunchDarkly client with our project key and user context
        // The user context tells LaunchDarkly who is using the app for targeting
        ldClient = LDClient.initialize(LAUNCHDARKLY_CLIENT_ID, currentUser);
        
        // Wait for the client to be ready before evaluating flags
        // This ensures we have the latest flag values from LaunchDarkly's servers
        await ldClient.waitForInitialization();
        
        console.log('✅ LaunchDarkly client initialized successfully');
        
        // Set up real-time listeners for each feature flag
        // These listeners enable instant updates when flags change in the dashboard
        setupFlagListeners();
        
        // Render the initial state of the application
        renderMovies();
        updateUIBasedOnFlags();
        
    } catch (error) {
        console.error('❌ Error initializing LaunchDarkly:', error);
        // Fallback: render movies with default settings if LaunchDarkly fails
        renderMovies();
    }
}

/**
 * Set up real-time listeners for all feature flags
 * These listeners trigger UI updates instantly when flags change
 */
function setupFlagListeners() {
    console.log('🔄 Setting up real-time flag listeners...');
    
    // Listener for layout switching (grid vs list view)
    // Fires instantly when 'movie-layout-style' flag changes in LaunchDarkly dashboard
    ldClient.on('change:movie-layout-style2', () => {
        console.log('📱 Layout flag changed - updating view');
        updateLayoutView();
    });
    
    // Listener for rating system switching (stars vs points)
    // Fires instantly when 'rating-system' flag changes in LaunchDarkly dashboard
    ldClient.on('change:rating-system', () => {
        console.log('⭐ Rating system flag changed - updating ratings');
        updateRatingSystem();
    });
    
    // Listener for poster selection feature (premium vs basic)
    // Fires instantly when 'poster-selection' flag changes
    ldClient.on('change:poster-selection', () => {
        console.log('🖼️ Poster selection flag changed - updating premium features');
        renderMovies();
    });
}

/* =================================================================
   FEATURE FLAG EVALUATION FUNCTIONS
   These functions check current flag values and update the UI
   ================================================================= */

/**
 * Update all UI elements based on current feature flag values
 */
function updateUIBasedOnFlags() {
    updateLayoutView();
    updateRatingSystem();
    updatePosterSelection();
}

/**
 * Update the movie layout based on the layout feature flag
 * Flag: 'movie-layout-style' - controls grid vs list view
 */
function updateLayoutView() {
    if (!ldClient) return;
    
    // Evaluate the layout flag - returns 'grid' or 'list'
    const layoutStyle = ldClient.variation('movie-layout-style2', 'grid');
    console.log(`📐 Current layout: ${layoutStyle}`);
    
    const container = document.getElementById('movie-container');
    const gridBtn = document.getElementById('grid-view');
    const listBtn = document.getElementById('list-view');
    
    // Update CSS classes and button states based on flag value
    if (layoutStyle === 'list') {
        container.className = 'movie-list';
        gridBtn.classList.remove('active');
        listBtn.classList.add('active');
    } else {
        container.className = 'movie-grid';
        gridBtn.classList.add('active');
        listBtn.classList.remove('active');
    }
}

/**
 * Update rating display based on rating system feature flag
 * Flag: 'rating-system' - controls star vs point ratings
 */
function updateRatingSystem() {
    if (!ldClient) return;
    
    // Evaluate the rating system flag - returns 'stars' or 'points'
    const ratingSystem = ldClient.variation('rating-system', 'stars');
    console.log(`⭐ Current rating system: ${ratingSystem}`);
    
    // Re-render movies to apply new rating system
    renderMovies();
}

/**
 * Update poster selection feature based on premium feature flag
 * Flag: 'poster-selection' - controls premium poster selection
 */
function updatePosterSelection() {
    if (!ldClient) return;
    
    // Evaluate the poster selection flag - returns true/false
    const posterSelectionEnabled = ldClient.variation('poster-selection', false);
    console.log(`🖼️ Poster selection enabled: ${posterSelectionEnabled}`);
    
    // Show/hide poster selection based on flag AND user subscription
    const showPosterSelection = posterSelectionEnabled;
    
    // Update all poster selection elements
    const posterSelections = document.querySelectorAll('.poster-selection');
    posterSelections.forEach(selection => {
        selection.style.display = showPosterSelection ? 'block' : 'none';
    });
}

/* =================================================================
   MOVIE RENDERING FUNCTIONS
   These functions generate the HTML for movie cards
   ================================================================= */

/**
 * Render all movies in the container
 */
function renderMovies() {
    const container = document.getElementById('movie-container');
    
    // Generate HTML for all movie cards
    const moviesHTML = movies.map(movie => createMovieCard(movie)).join('');
    container.innerHTML = moviesHTML;
    
    // Update poster selection after rendering
    updatePosterSelection();
}

/**
 * Create HTML for a single movie card
 * Content varies based on active feature flags
 */
function createMovieCard(movie) {
    // Get current rating system from feature flag
    const ratingSystem = ldClient ? ldClient.variation('rating-system', 'stars') : 'stars';
    
    // Generate rating HTML based on current flag value
    const ratingHTML = generateRatingHTML(movie.rating, ratingSystem);
    
    // Check if poster selection should be shown
    const showPosterSelection = ldClient && 
                               ldClient.variation('poster-selection', false);
 
    // Get experiment variant for A/B testing - ADD THIS FOR EXPERIMENTATION
    const experimentVariant = ldClient ? ldClient.variation('poster-experiment', 'small') : 'small';
    //check and see what LD is using/giving by defaullt, and then also if anything crashes we go back to small
    
    // Generate poster selection HTML for premium users
    const posterSelectionHTML = showPosterSelection && movie.alternativePosters ? `
    <div class="poster-selection">
        <h4>Choose Poster <span class="premium-badge">PREMIUM</span></h4>
        <div class="poster-options ${experimentVariant === 'large' ? 'large-posters' : ''}"> 
            <img src="${movie.alternativePosters[0]}" alt="Poster 1" class="poster-option selected" onclick="selectPoster(this)">
            <img src="${movie.alternativePosters[1]}" alt="Poster 2" class="poster-option" onclick="selectPoster(this)">
            <img src="${movie.alternativePosters[2]}" alt="Poster 3" class="poster-option" onclick="selectPoster(this)">
        </div>
    </div>
` : '';

// above adding ${experimentVariant === 'larged' ? 'large-posters' : ''}"> for experiementation, remove if any issues 
//if the experiement is saying large then add the large posters css) class
    
    return `
        <div class="movie-card">
            <img src="${movie.poster}" alt="${movie.title}" class="movie-poster">
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <p class="movie-year">${movie.year}</p>
                <div class="movie-rating">
                    ${ratingHTML}
                </div>
                ${posterSelectionHTML}
            </div>
        </div>
    `;
}

/**
 * Generate rating HTML based on the current rating system flag
 */
function generateRatingHTML(rating, system) {
    if (system === 'points') {
        // Points system: show rating out of 10
        const pointRating = Math.round(rating); // Convert 4.5 to 9/10
        return `<span class="point-rating">${pointRating}/5</span>`;
    } else {
        // Star system: show filled and empty stars
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        let starsHTML = '<div class="star-rating">';
        
        // Add full stars
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<span class="star">★</span>';
        }
        
        // Add half star if needed
        if (hasHalfStar && fullStars < 5) {
            starsHTML += '<span class="star">☆</span>';
        }
        
        // Add empty stars to complete 5 stars
        for (let i = fullStars + (hasHalfStar ? 1 : 0); i < 5; i++) {
            starsHTML += '<span class="star" style="color: #ddd;">☆</span>';
        }
        
        starsHTML += '</div>';
        return starsHTML;
    }
}

/* =================================================================
   USER INTERACTION HANDLERS
   These functions handle button clicks and user context changes
   ================================================================= */

/**
 * Handle poster selection clicks (premium feature)
 */
function selectPoster(selectedPoster) {
    // Remove selection from all posters in this card
    const posterOptions = selectedPoster.parentElement.querySelectorAll('.poster-option');
    posterOptions.forEach(option => option.classList.remove('selected'));
    
    // Add selection to clicked poster
    selectedPoster.classList.add('selected');
    
    // Update the main poster image
    const movieCard = selectedPoster.closest('.movie-card');
    const mainPoster = movieCard.querySelector('.movie-poster');
    mainPoster.src = selectedPoster.src;
    
    console.log('🖼️ Poster selection changed');

    if (ldClient) {

        ldClient.track('poster-clicked', currentUser);
        console.log('Poster click tracked for experiment');

    }
}

/**
 * Toggle user subscription between basic and premium
 * This demonstrates LaunchDarkly's user targeting capabilities
 */
function toggleUser() {
    // Switch user subscription status
    if (currentUser.subscription === 'basic') {
        currentUser.subscription = 'premium';
        document.getElementById('user-status').textContent = 'Premium User';
        document.getElementById('toggle-user').textContent = 'Switch to Basic';
    } else {
        currentUser.subscription = 'basic';
        document.getElementById('user-status').textContent = 'Basic User';
        document.getElementById('toggle-user').textContent = 'Switch to Premium';
    }
    
    console.log(`👤 User subscription updated: ${currentUser.subscription}`);
    
    // Update LaunchDarkly with new user context for targeting
    if (ldClient) {
        ldClient.identify(currentUser);
    }
    
    // Update UI based on new user context
    // updatePosterSelection();
    renderMovies();
}

/**
 * Handle view button clicks (for manual testing)
 * Note: In real demo, these views are controlled by feature flags
 */
function setGridView() {
    console.log('📱 Manual grid view selected');
    // In a real scenario, this would update the flag in LaunchDarkly
    // For demo purposes, we can manually trigger the layout change
}

function setListView() {
    console.log('📱 Manual list view selected');
    // In a real scenario, this would update the flag in LaunchDarkly
    // For demo purposes, we can manually trigger the layout change
}

/* =================================================================
   APPLICATION INITIALIZATION
   Set up event listeners and start the application
   ================================================================= */

// Wait for the DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎬 CineFlag Movie Demo Starting...');
    
    // Set up event listeners for user interactions
    document.getElementById('toggle-user').addEventListener('click', toggleUser);
    document.getElementById('grid-view').addEventListener('click', setGridView);
    document.getElementById('list-view').addEventListener('click', setListView);
    
    // Initialize LaunchDarkly and start the application
    initializeLaunchDarkly();
});

// Log successful script loading
console.log('📄 movieFlags.js loaded successfully');