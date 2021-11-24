# Instarteo

## Requiremetns
* Node v14.16.1+
* Go v1.16.3+

## Installation
1. `git clone https://github.com/Chillaso/instarteo`
2. `cd instarteo/bot && npm install`

## Usage

### Get followers list
First, do you have to download HTML after finishing your followers or following user list on Instagram. You've to go to your Instagram profile and click on followers, scroll down until finish the list, then save the HTML using F12 or Ctrl+S.

When you've the HTML downloaded, you've to create your followers.txt list, to do this g to extractor folder and run this: 

`go run main.go path/to/your/html/file.html`

This will create a file in the parent folder. Now, you can execute the bot, but first you've to configure some env variables

### Prepare environment
Export 
 `export GOOGLE_CHROME_DIR=/your/google/chrome/local/storage/folder`
 `export GOOGLE_CHROME_BIN=/usr/bin/google-chrome`

You've to know which is the post URL you want to comment and define in:

 `export INSTAGRAM_POST_URL=<url>`

Now, you should open the post url, press F12, go to network tab and post a comment, you've to get a similar URL, like this:

 `export INSTAGRAM_POST_URL=https://www.instagram.com/web/comments/2713194883881065833/add/`

### Run the bot
With everything prepared, now you can run the bot:

`node bot.js ../followers.txt`

