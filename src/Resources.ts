/* Resources.js
 * This is simply an image loading utility. It eases the process of loading
 * image files so that they can be used within your game. It also includes
 * a simple "caching" layer so it will reuse cached images if you attempt
 * to load the same image multiple times.
 */

interface TCallbackParams {
    func: Function;
    thisRef: any;
    args: Array<any>;
}

class Resources {
    window: Window;
    resourceCache: any;
    loading: Array<any>;
    readyCallbacks: Array<TCallbackParams>;

    constructor(global: any) {
        this.window = global;
        this.resourceCache = {};
        this.loading = [];
        this.readyCallbacks = [];

        window['Resources'] = this;
    }

    /* This is the publicly accessible image loading function. It accepts
     * an array of strings pointing to image files or a string for a single
     * image. It will then call our private image loading function accordingly.
     */
    public load(urlOrArr: string | Array<string>): void {
        let self = this;
        if (urlOrArr instanceof Array) {
            /* If the developer passed in an array of images
             * loop through each value and call our image
             * loader on that image file
             */
            urlOrArr.forEach(function (url) {
                self._load(url);
            });
        } else {
            /* The developer did not pass an array to this function,
             * assume the value is a string and call our image loader
             * directly.
             */
            self._load(urlOrArr);
        }
    }

    /* This is our private image loader function, it is
     * called by the public image loader function.
     */
    private _load(url: string) {
        var self = this;
        if (self.resourceCache[url]) {
            /* If this URL has been previously loaded it will exist within
             * our resourceCache array. Just return that image rather
             * re-loading the image.
             */
            return self.resourceCache[url];
        } else {
            /* This URL has not been previously loaded and is not present
             * within our cache; we'll need to load this image.
             */
            var img = new Image();
            img.onload = function () {
                /* Once our image has properly loaded, add it to our cache
                 * so that we can simply return this image if the developer
                 * attempts to load this file in the future.
                 */
                self.resourceCache[url] = img;

                /* Once the image is actually loaded and properly cached,
                 * call all of the onReady() callbacks we have defined.
                 */
                if (self.isReady()) {
                    self.readyCallbacks.forEach(function (callback) {
                        callback.func.call(callback.thisRef);
                    });
                }
            };

            /* Set the initial cache value to false, this will change when
             * the image's onload event handler is called. Finally, point
             * the image's src attribute to the passed in URL.
             */
            self.resourceCache[url] = false;
            img.src = url;
        }
    }

    /* This is used by developers to grab references to images they know
     * have been previously loaded. If an image is cached, this functions
     * the same as calling load() on that URL.
     */
    public get(url: string) {
        return this.resourceCache[url];
    }

    /* This function determines if all of the images that have been requested
     * for loading have in fact been properly loaded.
     */
    public isReady(): boolean {
        var ready = true;
        for (var k in this.resourceCache) {
            if (this.resourceCache.hasOwnProperty(k) &&
                !this.resourceCache[k]) {
                ready = false;
            }
        }
        return ready;
    }

    /* This function will add a function to the callback stack that is called
     * when all requested images are properly loaded.
     */
    public onReady(callback: Function, thisRef: any, args?: Array<any>) : void {
        
        let callbackParams : TCallbackParams = {
            func: callback,
            thisRef: thisRef,
            args: args || [] 
        };
        this.readyCallbacks.push(callbackParams);
    }
}