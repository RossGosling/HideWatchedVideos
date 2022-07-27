(async() => {
    try {

        //////////////////////////////////////////////////////

        // Methods

        const addClassesToWatchedVideos = () => {
            try {

                // REMOVE 'watched' classes from elements

                const elementsWithClass = Array.from(document.getElementsByClassName(UNIQUE_ID));
                for (elementWithClass of elementsWithClass.reverse()) {

                    elementWithClass.classList.remove(UNIQUE_ID);
                }

                // Add classes to expired videos

                const playbackElements = Array.from(document.getElementsByClassName('ytd-thumbnail-overlay-resume-playback-renderer'));
                const videoElements = playbackElements.map((playbackElement) => playbackElement.parentNode.parentNode.parentNode.parentNode.parentNode)

                for (videoElement of videoElements) {

                    videoElement.classList.add(UNIQUE_ID);
                }

            } catch (error) {
                console.error(error);
            }
        }

        const addCSS = () => {
            try {

                addClassesToWatchedVideos();

                // ADD stylesheet to the page

                const element = document.createElement("link");

                element.setAttribute("id", UNIQUE_ID);
                element.setAttribute("type", "text/css");
                element.setAttribute("rel", "stylesheet");
                element.setAttribute("href", browser.runtime.getURL(`/style/${siteName}.css`));

                document.body.appendChild(element);

            } catch (error) {
                console.error(error);
            }
        }

        const removeCSS = () => {
            try {

                const element = document.getElementById(UNIQUE_ID);

                if (element) {

                    element.parentNode.removeChild(element);
                }

                // Error handling if there were more elements for some reason
                if (document.getElementById(UNIQUE_ID)) {

                    return removeCSS();
                }

            } catch (error) {
                console.error(error);
            }
        }

        //////////////////////////////////////////////////////

        const siteName = window.location.hostname.split('.').reduce((result, string) => {

            if (typeof result !== 'undefined') {
                return  result;
            }

            return Object.keys(config).find(
                (supportedSiteName) => string
                    .toLowerCase()
                    .includes(
                        supportedSiteName.toLowerCase()
                    )
            );

        }, undefined);

        if (typeof siteName !== 'undefined') {

            //////////////////////////////////////////////////////

            if (await setting.isHidden()) {

                addCSS();

            } else {

                removeCSS();
            }

            console.log(`Instantiated ${siteName} document!`);

            //////////////////////////////////////////////////////

            // Register Listener for Background Messages

            browser.runtime.onMessage.addListener(
                (message) => {
                    try {

                        //console.log('message', message);

                        switch(message.type) {

                            case MESSAGE_ADD_CSS:
                                return addCSS();

                            case MESSAGE_REMOVE_CSS:
                                return removeCSS();

                            default:
                                console.error('Error message.type', message.type);
                        }

                    } catch (error) {
                        console.error(error);
                    }
                }
            );
        }

        //////////////////////////////////////////////////////

    } catch (error) {
        console.error(error);
    }
})();