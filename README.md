# LaunchDarkly Movie App Demo - Solutions Engineer Technical Exercise

A movie review demo app to showcase LaunchDarkly's feature flags, targeting, and experimentation features for my SE technical interview homework.

## Description

This app demonstrates how LaunchDarkly can help a movie review company safely release new features, target specific user groups, and run metric comparison experiments. I built a movie review app interface where you can toggle between different layouts, rating systems, and premium features in real time with no page refresh needed. The app includes everything from basic feature flags to metric experimentation with click tracking.

Perfect for demonstrating the LaunchDarkly platform to customers.


## Getting Started

This app will run entirely in your own browser. You will just need to recreate the LaunchDarkly flags and add your SDK key that is within the project that you create on LD.

### Dependencies

* Web browser (Chrome, Firefox, Safari, Edge - whatever you prefer)
* LaunchDarkly account (You can get a 14 day free trial that will include everything that you need for this app to work)
* LaunchDarkly JavaScript SDK (already included in HTML file though)

### Installing

* Download or clone this repository
* No additional installations needed - it's all just basic HTML/CSS/JavaScript


### Executing program

1. **Set up LaunchDarkly project** (detailed instructions below)
2. **Add your SDK key** to the `movieFlags.js` file - this will be found in the project that you create on LD's site - there is also a comment in the movie flag.js where you need to put your sdk key (around line 9
4. **Open `index.html`** in your web browser
5. **Test the features** - toggle flags in LaunchDarkly dashboard to see instant changes!

## LaunchDarkly Setup Guide

### Step 1: Create Your Project
1. Sign up for LaunchDarkly at https://launchdarkly.com/start-trial/
2. Create a new project (whatever name you want)
3. Copy your **Client-side ID** from the settings within the project section

### Step 2: Add Your SDK Key
1. Open `movieFlags.js` in a text editor
2. Find this line: `const client = LDClient.initialize('YOUR_CLIENT_SIDE_ID_HERE', context);`
3. Replace `'YOUR_CLIENT_SIDE_ID_HERE'` with your actual Client-side ID

### Step 3: Create these Feature Flags
NOTES: *The key's must be the same as they are labeled below
*Flags are **NOT** temporary.
*Variations must have same name as labeled below
*Serve when on and off can be interchanged and experimented with

Create these exact feature flags in your LaunchDarkly account:
#### Flag 1: 
Name: Movie Layout (or whatever you want to name it)
key: movie-layout-style2 (must stay the same)
- Type: String
- Variations:
  - `grid` (default)
  - `list`
- Purpose: Controls the movie display layout

#### Flag 2: 
Name: Rating System
key: rating-system  
- Type: String
- Variations (value) - Names are optional (choose what you want):
  - `stars` (default variation)
  - `points`
- Purpose: Controls the rating display format

#### Flag 3: 
Name: Poster Selection
key: poster-selection
- Type: Boolean
- Variations:
  - `true` 
  - `false` (default variation)
- Purpose: Shows/hides the premium poster selection feature based on whether a user is a premium or basic user

#### Flag 4: 
Name: Poster Experiment
key: poster-experiment
- Type: String  
- Variations:
  - `small` (default variation)
  - `large`
- Purpose: Comparison test for different poster sizes (poster selection feature)

### Step 4: User Targeting Setup
#### Create User Attributes/Context
This app uses these user attributes:

```javascript
currentUser = {
    kind: 'user',
    key: 'spencer13wright@gmail.com',
    name: 'Spencer Wright', 
    subscription: 'basic',  // changes to 'premium'
    preferredGenre: 'action'
}
```

### Set Up Targeting Rules
Select poster-selection flag:

**Go to the Targeting section/tab:**

Add individual targeting: spencer13wright@gmail.com (serve true so that this user will see new feature, to target you use the user's key)

Add rule-based targeting: "If subscription equals premium" (serve true so that premium users will see the feature)

Default rule: serve false

## Demo Scenarios

### Test Feature Flags
1. **Toggle Movie Layout**: Turn on flag (should say: serving
variations based on rules and you can toggle the rule between 'list' and 'grid' view)


2. **Rating System**: Do the same as step 1 and Toggle `rating system` between `stars` and `points` - see ratings change format in real-time no refresh needed  

3. **Emergency Rollback**: Turn any flag OFF to instantly disable features - the default feauture will display when flag is turned off.

### Test User Targeting
1. **Basic User**: Set subscription to `basic` in js code - this will make the poster selection feature hidden from the user

2. **Premium User**: Change subscription to `premium` - this will make the poster selection appear instantly to the user

3. **Individual Targeting**: Target your email (key) specifically in LaunchDarkly - this feature is within the saem section as the flag (you will see a little + and then select target individuals and input your target information - context key, kind, and variation)

### Step 5: Experimentation Setup

1. **Create Metric**: In LaunchDarkly, go to Metrics on lefthand side

2. Select Create Metric
   - Name: "Poster Clicks" 
   - Event key: `poster-clicked`
   - Type: Count
     
3. **Create Experiment**: Go to Experiments

   Create Experiment
   - Use `poster-experiment` flag
   - Add your "Poster Clicks" metric
   - Set variation traffic split to 50/50
  

### Test Metric Experimentation 

1. **Poster Experiment**: Toggle `poster-experiment` between `small` and `large`

2. **Click Tracking**: You will click the movie posters to track and log metrics (ie, as a premium member you will either have the smaller or the larger posters and you will click whichever version you have and it will track the clicks)

3. **View Results**: Check LaunchDarkly for this click data - it will be under metrics tab on lefthand side - click your metric you just created (NOTE you need 100+ clicks for each version to be able to show the difference and essentially which one is better) and view the activity/results.


## Help

**Common Issues that I ran into:**

* **If flags aren't working?** Double-check that your Client-side ID is correct in `movieFlags.js`
* Also make sure that when creating a flag the Client ID checkbox is marked (its default is unmarked)
  
* **Features not appearing?** Make sure flags are turned on in LaunchDarkly  and make sure to review and save after turning on a flag, an option will pop up to review and save
* 
* **Targeting not working?** Make sure to double check that the user key matches exactly within th js code: `spencer13wright@gmail.com` NOTE you can change this if you'd like just change in code AND LaunchDarkly
* **Experiment not tracking?** Ensure you're clicking as a premium user (subscription: 'premium')

**Any extra help** Checkout LaunchDarkly documentation: https://docs.launchdarkly.com/

## Authors

Spencer Wright - Solutions Engineer Technical Exercise
* Email: spencer13wright@gmail.com
* LinkedIn: https://www.linkedin.com/in/spencerwright4/
