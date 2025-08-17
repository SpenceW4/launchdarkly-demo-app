//store ld client id - get this from the project settings 
//key is like a pw that connects directly to project on LD
//IMPORTANT TODO - if you are recreating the LauncDarkly Project please replace this key

const LAUNCHDARKLY_CLIENT_ID = '689fad12b1c0dd098ae7fd25';


//this is what is going hold my LD connection 
let ldClient;

//create user object , starts as basic user, can be changed for targeting demo
//LD note: individual targeting would be good for testing and special cases,less scalable in comparison to rule based

let currentUser = { //this is where if we want to target an individual or a group we would use their key right now this key is spencer13wirght's email
    kind: 'user',
    key: 'spencer13wright@gmail.com',
    name: 'Spencer Wright',
    subscription: 'basic',  //this attribute controls premium feature targeting
    preferredGenre: 'action' //this attribute can be used for content targeting - ended up not using this with the feature flags i created 
};

//create arrays of my movies to use 
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


        rating: 5,
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
        rating: 4,
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
        rating: 4,
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
        rating: 4,
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
        rating: 4,
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
        rating: 4,
        genre: 'action'
    }
];


//this section is going to handle connecting to LD and setting up real-time flag updates


async function initializeLaunchDarkly() { //create a function that will wait for things to finish (connecting to LD server)
    
    try {

        console.log('Starting/Initializing LaunchDarkly client...');
        
        //takes our vb from earlier and fill it with the actual connection using our key and the user
        //this is what actaully connects our project (in LD) to our code
        ldClient = LDClient.initialize(LAUNCHDARKLY_CLIENT_ID, currentUser);

        //pause and wait until LD fully connects and then download all flag settings before continuing
        //this runs everytime page is refreshed to make sure all flags and content are up to date
        await ldClient.waitForInitialization();
        
        console.log('LaunchDarkly client connected successfully');//reaches here then we're good to move forward
        
        //this is what is listenting for the toggle switch in LD dashboard 
        setupFlagListeners();
        
        //display all the movies on the page when app first loads
        renderMovies();

        //update all UI elements based on the  current flag values
        updateUIBasedOnFlags();
        
    } catch (error) {
        console.error('Error connecting to LaunchDarkly:', error);
        
        //if ld connection fails still show the movies with default settings so that the app doesnt just break
        //ran into this a few tiems, easier to just reload the page
        renderMovies();
    }
}


//setting up functions to update the ui when a flag changes, NOTE: the instant real time is a feature of LD's system
function setupFlagListeners() {

    console.log('Setting up real-time flag listeners...'); //console msg
    
    
    //listen for when this flag changes, we're gonna change the layout,, do this for each flag
    ldClient.on('change:movie-layout-style2', () => {

        console.log('Layout flag changed - updating view!');

        updateLayoutView(); //call update function to actual update the view 
    });
    
    //listen for when the rating system change 

    ldClient.on('change:rating-system', () => {

        console.log('Rating system flag changed - updating ratings!'); //msg

        updateRatingSystem(); //call func to change the system
    });
    
    
    //listen for when poster selection flag changes
    ldClient.on('change:poster-selection', () => {

        console.log('Poster selection flag changed - updating poster feature!');

        renderMovies(); //reload all movies so we can show/hide the poster selection feature
    });
}



//update all ui elements based on current flag values 
//these functions check current flag values and update the UI

function updateUIBasedOnFlags() { //big update to call all those functions at once
    //used for when app first loads, to make sure everything is set up correctly

    updateLayoutView();
    updateRatingSystem();
    updatePosterSelection();
}

//updating the movie layout view 

function updateLayoutView() {

    if (!ldClient) return; //if LD isnt connected just stop here but DO NOT crash
    
    
    const layoutStyle = ldClient.variation('movie-layout-style2', 'grid');
    //if it cant connect use grid as the backup otherwise ask for the layout style from the flag
    //variation built in LD to ask what a flags value should be for the current user

    console.log(`Current layout: ${layoutStyle}`); //show layout in console
    
    const container = document.getElementById('movie-container'); //grab the html that holds all the movies

    const gridBtn = document.getElementById('grid-view'); 
    const listBtn = document.getElementById('list-view'); 
    //grab the grid and list buttons from the webpage, buttons dont actually do anything but this is for display
    //we'll just update the appearance 

    //now we pdate css classes and button states based on the flag's value

    if (layoutStyle === 'list') { //if value from LD is list - this is in the LD variations section for the flag, to check the value 

        container.className = 'movie-list'; //grab the movie list layout from css
        gridBtn.classList.remove('active'); //make it gray and 'unclickable'
        listBtn.classList.add('active'); //make it look active/clickable

    } else { //could also add different layouts and make this if else === grid

        container.className = 'movie-grid'; //grab the movie grid layout from css
        gridBtn.classList.add('active');
        listBtn.classList.remove('active');
    }
}

//update rating system

function updateRatingSystem() {

    if (!ldClient) return; //if LD isnt connected then just stop here and dont crash
    
    const ratingSystem = ldClient.variation('rating-system', 'stars'); //check flag value for rating system
    //defauly if things crash and go wrong, then make it stars

    console.log(`Current rating system: ${ratingSystem}`); //console msg
    
   
    renderMovies(); //reload the iages to apply the new rating system
}

//update poster selection feature

function updatePosterSelection() {

    if (!ldClient) return; //if LD doesnt connect then return and dont crash
    
    const posterSelectionEnabled = ldClient.variation('poster-selection', false); //check the flag value for poster selection
    //make default false meaning dont show the feature to select posters

    console.log(`Poster selection enabled: ${posterSelectionEnabled}`); //console msg
    
    const showPosterSelection = posterSelectionEnabled; //copy flag name
    
    const posterSelections = document.querySelectorAll('.poster-selection'); //grab all elements on the page that have poster selection
    //this is my choose poster sections

    posterSelections.forEach(selection => { //each item if the flag is true show it if its not dont

        selection.style.display = showPosterSelection ? 'block' : 'none';

    });
}

//update/reload movie posters in its container

function renderMovies() {

    const container = document.getElementById('movie-container'); //grab the html element where all the movies will be displayed
    
    const moviesHTML = movies.map(movie => createMovieCard(movie)).join(''); //go through each movie in movie array and create html for each one w createmoviecard func
    container.innerHTML = moviesHTML;
    //then combine all html into one big string, take the string and replace whatever was there before
    
    updatePosterSelection(); //update the poster selection after the movies are displayed, check the poster selectoin flag and show/hide
    //accordingly, therefore all movies appear on webpage with current flag settings applied 
}


//create html for movie card 

function createMovieCard(movie) {
    
    const ratingSystem = ldClient ? ldClient.variation('rating-system', 'stars') : 'stars';
    //grab the current flag value (starts or numbers for rating system) , if anyhting happens put stars as default
    
    //whatever flag value is, create the html with that type of rating 
    const ratingHTML = generateRatingHTML(movie.rating, ratingSystem);
    
    //check flag and if flag is true then show but the default is false
    const showPosterSelection = ldClient && 
                               ldClient.variation('poster-selection', false); //client must be connected and flag is on
                               //poster selection is whatever the variation value is, false is safety net
 
    //check poster size from LD flag, small defualy
    const experimentVariant = ldClient ? ldClient.variation('poster-experiment', 'small') : 'small';
    
    //ff poster selection is enabled AND movie has alteranative posters create the html for poster selection
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

//select poster based on if clicked

// above adding ${experimentVariant === 'larged' ? 'large-posters' : ''}"> for experiementation, remove if any issues 
//if the experiement is saying large then add the large posters css) class
    //below combine everything into a presentable movie card
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

//generate rating html based on system flag

function generateRatingHTML(rating, system) {

    if (system === 'points') { //if flag value is point system
        
        const pointRating = Math.round(rating); // convert to whole number

        return `<span class="point-rating">${pointRating}/5</span>`; //input the rating into the display

    } else {

        // Star system: show filled and empty stars
        const fullStars = Math.floor(rating); //changed these so not super necessary to have
        const hasHalfStar = rating % 1 >= 0.5; //same with this
        
        let starsHTML = '<div class="star-rating">'; //start building the HTML string 
        
        //adding stars
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<span class="star">★</span>'; //loopfor howeery many stars there are
        }
        
        //tried to add haflt star, didnt work , come back to this?
        if (hasHalfStar && fullStars < 5) {
            starsHTML += '<span class="star">☆</span>';
        }
        
        starsHTML += '</div>'; //close dive tag to complete html
        return starsHTML;
    }
}


//handle poster selction functions

function selectPoster(selectedPoster) {
    
    const posterOptions = selectedPoster.parentElement.querySelectorAll('.poster-option');//grab all the poster options in the same movie card as the one that got clicked

    posterOptions.forEach(option => option.classList.remove('selected')); //remove the higihlight from all posers
    
    selectedPoster.classList.add('selected'); //but then add it back to whichever poster was selected
    
    const movieCard = selectedPoster.closest('.movie-card'); //grab the movie card that contains this posetr
    
    const mainPoster = movieCard.querySelector('.movie-poster'); //find the main poster image for this movie
    
    mainPoster.src = selectedPoster.src; //set the main poster to show the same image as the option selected
    
    console.log('Poster selection has been changed');

    if (ldClient) { //if connexted

        ldClient.track('poster-clicked', currentUser); //track and tell LD this user clicked a poster - for experimentation 
        
        console.log('Poster click tracked for experiment');

    }
}


//toggle between basic and premium
function toggleUser() { 

    if (currentUser.subscription === 'basic') { //if user is basic

        currentUser.subscription = 'premium'; //set it to premium 

        document.getElementById('user-status').textContent = 'Premium User'; //update ui text for premium

        document.getElementById('toggle-user').textContent = 'Switch to Basic'; //update ui
    
    } else { //if premium

        currentUser.subscription = 'basic'; //switch to basic 

        document.getElementById('user-status').textContent = 'Basic User'; //update both ui to match basic sub ui
        document.getElementById('toggle-user').textContent = 'Switch to Premium';
    }
    
    console.log(` User subscription updated: ${currentUser.subscription}`);
    
    

    if (ldClient) { //if still connected let LD 

        ldClient.identify(currentUser); //tell LD user info is updated , ake sure target rules still algin
    }

    //reload the movies to keep up w immediate change
    renderMovies();
}

//empty placeholders for the grid buttons
function setGridView() { //func to call when someone clicks the grid button

    console.log('Manual grid view selected');
    // THESE dont do anything but show that these would be used to change the layout if we werent using flags
    //started with these but its better to show that the flags will control instead of buttons in a different way 

}

function setListView() {

    console.log('Manual list view selected');
    //same as above
}

//this is to start the app

document.addEventListener('DOMContentLoaded', function() { //wait until webpage is fully loaded before runnnig code, 

    console.log('ReelBook Loading...');
    
    
    document.getElementById('toggle-user').addEventListener('click', toggleUser); //whens omeone clicks toggle user call function to switch users
    document.getElementById('grid-view').addEventListener('click', setGridView); //when someoe clicks grid view run grid view function technically just a msg but to know it works 
    document.getElementById('list-view').addEventListener('click', setListView); //same but for list view
    
    initializeLaunchDarkly(); //start up LD and connect to projext
});

console.log('movieFlags.js loaded successfully');