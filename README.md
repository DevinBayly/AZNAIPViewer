# Instructions for Kiri

Overall you don't have too many things to do assuming the leaflet code is all set.

## Modification to the `/js` directory

In order for the directory to work as a github webpage you'll have to add an `index.html` in the `/js` directory. 
I took a peek at the javascript file in the directory and it has some html mixed in, so you're like halfway done already.

### Creating the `index.html`

the bare bones of an html doc are
```
<html>
<head></head>
<body></body>
</html>
```
all the things from your `naipviewer.js` that are above the leaflet `<script>` where your code lives should go in between the `<head>` and `</head>` tags. You also look like you're using jquery so you should toss in a 
```
<script
			  src="https://code.jquery.com/jquery-3.6.0.min.js"
			  integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4="
			  crossorigin="anonymous"></script>

``` 
to the head section also. 

Next you want to put the `<div>` that holds your map and the `<script>` with all your leaflet code under in between the `<body>` and its close tag `</body>`. Essentially the order you wrote them in the js file was correct, its just that was html in a javascript file. 

## Making the repo a github page
This is the same process that you did the last time we talked about turning that nice markdown doc you had into a website. 
In the settings select the pages tab on the left hand side, click on the branch main, and then `/root` as the base folder. 

## Getting the right src for the iframe element to use on the imagery libguide page
At this point you should have a website link something like `https://kcarini.github.io/AZNAIPViewer` if you add `/js` to the end of that you will get the page that is built from your `/js/index.html` where your leaflet code is.

This means the iframe tag you need for your library webpage is `<iframe src="https://kcarini.github.io/AZNAIPViewer>` or something like that. I might have spelled some part wrong but that's the general idea. 
