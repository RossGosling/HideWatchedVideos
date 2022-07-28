(async() => {
    try {

        //////////////////////////////////////////////////////

        // Methods

        const addClassesToWatchedVideos = () => {
            try {

                // Add classes to expired videos

                const playbackElements = Array.from(document.getElementsByClassName('ytd-thumbnail-overlay-resume-playback-renderer'));
                const videoElementsMissingClass = playbackElements
                    .reduce((result, playbackElement) => {
                        const parent = playbackElement.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
                        if (Array.from(parent.classList).includes(UNIQUE_ID) === false) {
                            result.push(parent);
                        }
                        return result;
                    }, []);

                for (videoElementMissingClass of videoElementsMissingClass) {
                    videoElementMissingClass.classList.add(UNIQUE_ID);
                }

            } catch (error) {
                console.error(error);
            }
        }

        const setHidden = () => {
            try {

                // Remove old stylesheet

                const oldElement = document.getElementById(UNIQUE_ID);

                if (oldElement) {

                    oldElement.parentNode.removeChild(oldElement);
                }

                // Error handling if there were more elements for some reason
                if (document.getElementById(UNIQUE_ID)) {

                    return setObscured();
                }

                // Add new stylesheet

                const element = document.createElement("link");

                element.setAttribute("id", UNIQUE_ID);
                element.setAttribute("type", "text/css");
                element.setAttribute("rel", "stylesheet");
                element.setAttribute("href", browser.runtime.getURL(`/style/Hidden.css`));

                document.body.appendChild(element);

            } catch (error) {
                console.error(error);
            }
        }

        const setObscured = () => {
            try {

                // Remove old stylesheet

                const oldElement = document.getElementById(UNIQUE_ID);

                if (oldElement) {

                    oldElement.parentNode.removeChild(oldElement);
                }

                // Error handling if there were more elements for some reason
                if (document.getElementById(UNIQUE_ID)) {

                    return setObscured();
                }

                // Add new stylesheet

                const element = document.createElement("link");

                element.setAttribute("id", UNIQUE_ID);
                element.setAttribute("type", "text/css");
                element.setAttribute("rel", "stylesheet");
                element.setAttribute("href", browser.runtime.getURL(`/style/Obscured.css`));

                document.body.appendChild(element);

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

                setHidden();

            } else {

                setObscured();
            }

            console.log(`Instantiated ${siteName} document!`);

            //////////////////////////////////////////////////////

            // Register DOM mutation observer

            const observer = new MutationObserver(
                (mutations) => {

                    const isTriggered = mutations.some((mutation) => {
                        return Array.from(mutation.target.classList).includes('ytd-grid-video-renderer');
                    })

                    if (isTriggered) {
                        addClassesToWatchedVideos();
                    }
                }
            );
            observer.observe(document.documentElement, { subtree: true, childList: true, attributes: true });

            //////////////////////////////////////////////////////

            // Register Listener for Background Messages

            browser.runtime.onMessage.addListener(
                (message) => {
                    try {

                        //console.log('message', message);

                        switch(message.type) {

                            case MESSAGE_ADD_CSS:
                                return setHidden();

                            case MESSAGE_REMOVE_CSS:
                                return setObscured();

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