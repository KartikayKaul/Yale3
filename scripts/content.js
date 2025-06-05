/*
    Apparently ES3 imports were causing issues
    and I tried all troubleshooting methods
    but was not able to trace why chrome was not 
    recognizing this file as a module.

    So instead of using imports I am just adding the
    files in the content_scripts array in manifest file
*/


// showpageaction 
const todoresp = {todo: "showPageAction"};
chrome.runtime.sendMessage(todoresp);

function loadSlider() {
    //check if slider already injected
    //if (document.getElementById("yale3_slider")) return;
    const sliderContainer = document.createElement("div");
    sliderContainer.id = "yale3_slider";

    fetch(chrome.runtime.getURL("views/slider.html"))
        .then(response => response.text())
        .then(sliderHTML => {
        // THIS IS WHERE WE PUT ALL OUR WORK  //

            // prepending all of html
            sliderContainer.innerHTML += sliderHTML;
            document.body.prepend(sliderContainer);

            // deepscan listener 
            // setupDeepscanListener();

            //Simple delay (3 seconds) before running extraction // will change with an observer
            setTimeout( () => {

                // ADD ANY CODE IN THIS BLOCK THAT DEPENDS ON THE LINKEDIN SITE DOM CHANGES

                //basic profile data
                var basicProfileData = getBasicProfileSection();
                //console.log(basicProfileData);
                //experience section data
                var expData = getExperienceSection();
                //console.log(expData);
                //education section data
                var eduData = getEducationSection();
                //console.log(eduData);

                // INJECT INTO TEXT FIELDS
                injectDataintoTextArea("basicprofile", basicProfileData);
                injectDataintoTextArea("experiencetext", expData);
                injectDataintoTextArea("educationtext", eduData);


                // SAVE PROFILE DATA LISTENER
                const saveButton = document.getElementById("save_profile_data_button");
                if(saveButton) {
                    saveButton.addEventListener("click", () => {
                        saveProfileData(basicProfileData, expData, eduData);
                    })
                }
                

                // REFRESH PROFILE DATA
                const refreshBtn = document.getElementById("refresh_profile_data_button");
                const refreshIcon = document.getElementById("refresh_icon");
                if(refreshBtn && refreshIcon) {
                    refreshBtn.addEventListener("click", async () => {
                
                        refreshIcon.classList.add("spin-once");
                        refreshIcon.addEventListener("animationend", () => {
                            refreshIcon.classList.remove("spin-once");
                        }, {once: true}); 

                        // existing refresh logic
                        basicProfileData = getBasicProfileSection();
                        expData = getExperienceSection();
                        eduData = getEducationSection();
                        //inject into text fields
                        injectDataintoTextArea("basicprofile", basicProfileData);
                        injectDataintoTextArea("experiencetext", expData);
                        injectDataintoTextArea("educationtext", eduData);
                    });
                }
                // REFRESH PROFILE DATA ENDS //

            }, 3000);//adjust delay here // TIMEOUT ENDS HERE //


            // AUTOMATIC DATA REFRESHER LOGIC //
            let lastUrl = location.href;
            setInterval( () => {
                if(location.href !== lastUrl) {
                    setTimeout( () => {
                        basicProfileData = getBasicProfileSection();
                        expData = getExperienceSection();
                        eduData = getEducationSection();

                        injectDataintoTextArea("basicprofile", basicProfileData);
                        injectDataintoTextArea("experiencetext", expData);
                        injectDataintoTextArea("educationtext", eduData);
                        lastUrl = location.href;
                    }, 3000); // Timeout set to let the page refresh first
                }
            }, 1000); // Interval - check every 1 second
            // AUTOMATIC DATA REFRESHER LOGIC ENDS //
            
        // SLIDER WORK ENDS HERE  -------------- //
        }).catch(error => console.error("Error injecting `slider.html`: ", error));
} // loadSlider function definition ends here

loadSlider();


// TOGGLE SLIDER LISTENER
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if(msg.todo == "toggle") {
       toggleSlider(); 
    }
});


// CSS STYLE CHANGE LOGIC ON TOGGLE TRIGGER
function toggleSlider() {
    const slider = document.getElementById("yale3_slider");
    //if(!slider) return;
    const styler = slider.style;

    if (styler.width === "0px") {
        styler.width = "400px";
    } else {
        styler.width = "0px";
    }
}

// // deepscan listener - DISABLED RIGHT NOW
// function setupDeepscanListener() {
//     const deepscanBtn = document.getElementById("deepscan_toggle_button");
//     if(deepscanBtn) {
//         deepscanBtn.addEventListener("click", () => {
//             // Toggle enabled/disabled state
//             if (deepscanBtn.textContent === "Deepscan enabled") {
//                 deepscanBtn.textContent = "Deepscan disabled";
//                 // You can add additional logic here if needed
//             } else {
//                 deepscanBtn.textContent = "Deepscan enabled";
//                 // Add logic to enable deepscan
//             }
//         });
//     }
// }

// Validate the `selector` group from selectors object
function validateSelector(selectorGroup, baseNode=document) {
    const results = {};
    for( const [key, selector] of Object.entries(selectorGroup)) {
        const element = baseNode.querySelector(selector);
        results[key] = element ? true : false;
    }
    return results;
}

// get NodeList of all sections
function getSectionsList() {
    // returns a NodeList of all sections
    return document.querySelectorAll("section[data-view-name='profile-card']");
}

// find section node with id
function getSectionWithId(list, sectionId) {
    /*
        list - NodeList containing all the sections
        sectionId - string that contains the sectionId to be checked
        returns the node or null value
    */
   return Array.from(list).find(sec => sec.children[0]?.id === sectionId) || null;
}


//get basicp profile data
function getBasicProfileSection() {
    const data = {};

    const validationResults = validateSelector(window.selectors.basicProfile);
    
    for(const [key, isValid] of Object.entries(validationResults)) {
        if(isValid) {
            const element = document.querySelector(window.selectors.basicProfile[key]);
            data[key] = element?.textContent.trim();
        } else {
            data[key] = "";
        }
    }

    return data;
}


// get EXPERIENCE SECTION Node and also perform validations
function getExperienceSection() {
    const sections = getSectionsList();
    const expNode = getSectionWithId(sections, "experience");
    if(expNode) { //check if expNode section exists or not
        const ul = expNode.children[2]?.querySelector("div > ul") || null;
        if(ul) {
            allLi = Array.from(ul.querySelectorAll("li"));
            topLi = allLi.filter(li => li.parentElement === ul); // getting all top level li

            // now we loop through topLi experience items
            const validationResults = {};
            
            topLi.forEach((li, index) => {
                const key = `li_${index}`;
                const validation = validateSelector(window.selectors.experience, li);
                validationResults[key] = {
                    node: li,
                    result: validation
                };
            });
            
            return getExperienceData(validationResults);
        } // if ul exists condn ends
        else {
            return {}; //return empty object
        }
    } // if expNode exists condn ends
    else {
        return {}; //return empty object
    }
}

// get EXPERIENCE SECTION data
function getExperienceData(results) {
    const items = [];
    for (const [key, {node, result}] of Object.entries(results)) {
        // only process if all selectors are valid
        const requiredFields = ['jobTitle', 'companyAndType', 'duration'];
        const allValid = requiredFields.every(field => result[field]);
        if(!allValid) continue;

        const data = {};
        for (const [field, selector] of Object.entries(window.selectors.experience)) {
            const el = node.querySelector(selector);
            data[field] = el ? el.textContent.trim() : "";
        }

        items.push({key, data});
    }
    return items;
}


// get EDUCATION SECTION Node and also perform validations
function getEducationSection() {
    const sections = getSectionsList();
    const eduNode = getSectionWithId(sections, "education");
    if(eduNode) { //if eduNode exists or not
        const ul = eduNode.children[2]?.querySelector("ul") || null;
        if(ul) {
            allLi = Array.from(ul.querySelectorAll("li"));
            topLi = allLi.filter(li => li.parentElement === ul); // getting all top level li

            // we loop through topLi items and validate using selectors object
            const validationResults = {};

            topLi.forEach((li, index) => {
                const key = `li_${index}`;
                const validation = validateSelector(window.selectors.education, li);
                validationResults[key] = {
                    node: li,
                    result: validation
                };
            });
            
            return getEducationData(validationResults);
        } // if ul exists condn ends 
        else {
            return {}; //return empty object if ul is null
        }
    } // if eduNode exists condn ends 
    else {
        return {}; //return empty object if eduNode is null
    }
}

// get EDUCATION SECTION data
function getEducationData(results) {
    const items = [];
    for (const [key, {node, result}] of Object.entries(results)) {
        // only process if all selectors are valid

        const requiredFields = ['name', 'degree'];
        const allValid = requiredFields.every(field => result[field]);
        if(!allValid) continue;

        const data = {};
        for (const [field, selector] of Object.entries(window.selectors.education)) {
            const el = node.querySelector(selector);
            if(field === "schoolUrl") {
                data[field] = el ? el.getAttribute("href") : "";
            } else {
                data[field] = el ? el.textContent.trim() : "";
            }
        }
        items.push({key, data});
    }
    return items;
}

// inject data into text boxes in the slider.html
function injectDataintoTextArea(nodeId, data) {
    const textarea = document.getElementById(nodeId);
    if(!textarea) {
        console.error('Text area node with id `${nodeId}` not found.');
        return;
    }

    textarea.innerText = typeof data === 'object'
        ? JSON.stringify(data, null, 2)
        : String(data);   
}

// save profile data extracted so far
function saveProfileData(basicData, expData, eduData) {

    const fullData = {
        id: window.location.href,
        savedDate: new Date().toISOString(),
        basicProfile: basicData,
        experience: expData,
        education: eduData
    };


    const name = basicData?.name?.replace(/\s+/g, "_") || window.location.href;
    const date = new Date().toISOString().split("T")[0];
    const filename = `${name}_${date}.json`;

    chrome.runtime.sendMessage({
        type: "downloadProfile",
        filename,
        content: JSON.stringify(fullData, null, 2)
    });
}