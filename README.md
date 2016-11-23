# imageChallenge
This image search challenge was built using native JavaScript with ECMAScript 6 syntax and CSS3. It uses the Google Custom Search API, while specifying for only images with a custom search preference for images found on www.patreon.com. You can see it working live at https://karomancer.github.io/imageChallenge/.

I would recommend searching for your favorite people on Patreon, my favorites being <b>Jazza</b>, <b>SexualLobster</b>, <b>Lindsey Stirling</b>, and <b>Scott Bradlee</b>. 

The API has a maximum number of searches of 25 per day on a free account, so if it runs out, I have a pre-selected set of hard-coded images to still test UI functionality. To be perfectly honest, I'm not entirely sure it will work; I didn't want to use up all my quota just to test it. The free API also limits searches for up to 10 results at a time, hence why only 10 results are shown.


<b>V2 considerations:</b>
- Pagination support
- Load query params from url
- Improve lightbox animation
- Organize stylesheets and code into smaller modules
- Clean HTML up to use fewer IDs and tag references
- Loading for individual images, too
- Obviously, hide the custom search key somewhere on a server...
- Better error handling; I only throw errors now, but someday it would be nice to do something with that


## Takeaways
I found this project to be very fun. I haven't written in only "native" JavaScript probably since high school, so having to reset and try to remember how was refreshing. The challenge took me much longer than I had expected, though mostly because I had trouble selecting an API (just making accounts and playing with those suggested took about 2-3 hours). I don't have an Instagram, a Flickr, or mostly any other accounts needed for the APIs listed, so I decided to go with the Google Custom Search API just because I already had a Google account. However, I found it to be quite cumbersome; they limit the max results to 10 and there's a daily limit (as noted above), which meant I had to break up this project into several days to overcome the daily usage limit. 

I almost went with Pinterest, but they provide an SDK which I thought would not do a good job representing that I know how to make XHRs.

Lastly, I would have loved to write a python server to hide the key from public eye, but just didnt get around to it. I guess I'll just deal with the grossness of an exposed key for now (ew!)
