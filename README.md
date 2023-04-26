Floating Text Ad
================

An Ad Unit for beautifully displaying Text Ads, introduce an image url, a title and a little description to go!

<a href="http://hakim.ma/labs/floating-text-ad/"><b>Demo</b></a>

<h3>Usage</h3>

``` javascript
	// image width, image height, image url
	floatingTextAd.setImage(180, 135, "http://hakim.ma/labs/floating-text-ad/thumb.jpg");
	// title, description
	floatingTextAd.setText("Flying Dodo", "Get as far as you can before you run out of fuel.");
	// click url, open target
	floatingTextAd.setClickUrl("http://www.doubleduck.co/games/flying-dodo/", "_blank");
	// show Ad
	floatingTextAd.init();
```

<h3>Options</h3>
<p>Show the Ad after a time delay (milliseconds) (default: "1000")</p>
``` javascript
	// 2 seconds delay
	floatingTextAd.init(2000);
```
<p>Description text length</p>
``` javascript
	// description length is 15 words
	floatingTextAd.setText("Flying Dodo", "Get as far as you can before you run out of fuel.", 15);
```
<p>Ad Unit theme color</p>
```javascript
	floatingTextAd.setColor("#808000");
```
<p>Change the call-to-action button text (default: "Play Now")</p>
``` javascript
	// "Watch Now", "Jouez", "Spielen", "إلعب الآن"…
	floatingTextAd.setCTA("Watch Now");
```
<p>Label text (default: "HOT!")</p>
``` javascript
	// "NEW!", "SALE"…
	floatingTextAd.setLabel("NEW!");
```
<p>Frequency capping (hours) (Default: "None")<br />
Set a number of hours this Ad Unit should not appear again when the user hits the Close button.
</p>
``` javascript
	// The Ad shows once per 12 hours
	floatingTextAd.setCapping(12);
```

