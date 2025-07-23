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
                var certData = getCertificationSection();
                var skillData = getSkillsSection();

                // INJECT INTO TEXT FIELDS
                injectDataintoTextArea("name_title", basicProfileData.name);
                injectDataintoTextArea("basicprofile", basicProfileData);
                injectDataintoTextArea("experiencetext", expData);
                injectDataintoTextArea("educationtext", eduData);
                injectDataintoTextArea("certificationstext", certData);
                injectDataintoTextArea("skillstext", skillData);

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
                        certData = getCertificationSection();
                        skillData = getSkillsSection();
                        //inject into text fields
                        injectDataintoTextArea("name_title", basicProfileData.name);
                        injectDataintoTextArea("basicprofile", basicProfileData);
                        injectDataintoTextArea("experiencetext", expData);
                        injectDataintoTextArea("educationtext", eduData);
                        injectDataintoTextArea("certificationstext", certData);
                        injectDataintoTextArea("skillstext", skillData);
                    });
                }
                // REFRESH PROFILE DATA ENDS //

                 // SAVE PROFILE DATA LISTENER
                var saveButton = document.getElementById("save_profile_data_button");
                if(saveButton) {
                    saveButton.addEventListener("click", () => {
                        
                        // existing refresh logic
                        basicProfileData = getBasicProfileSection();
                        expData = getExperienceSection();
                        eduData = getEducationSection();
                        certData = getCertificationSection();
                        skillData = getSkillsSection();
                        //inject into text fields
                        injectDataintoTextArea("name_title", basicProfileData.name);
                        injectDataintoTextArea("basicprofile", basicProfileData);
                        injectDataintoTextArea("experiencetext", expData);
                        injectDataintoTextArea("educationtext", eduData);
                        injectDataintoTextArea("certificationstext", certData);
                        injectDataintoTextArea("skillstext", skillData);
                        
                        saveProfileData(basicProfileData, expData, eduData, certData, skillData);
                    })
                }
                
                /* deepscan feature work */
                const sectionKeywordToIdMap = {
                    "education": "educationtext",
                    "experience": "experiencetext",
                    "skills": "skillstext",
                    "licenses & certifications": "certificationstext"
                };

                const sectionArrays = [
                    ["show all", "licenses & certifications"],
                    ["show all", "experience"],
                    ["show all", "skills"],
                    ["show all", "education"]
                ];

                const candidates = document.querySelectorAll(".pvs-list__footer-wrapper");
                const filteredNodes = Array.from(candidates).filter(node => {
                    const text = node.textContent.trim().toLowerCase();
                    return sectionArrays.some(sectionArray =>
                        sectionArray.every(keyword => text.includes(keyword))
                    );
                });

                filteredNodes.forEach(node => {
                    const text = node.textContent.trim().toLowerCase();
                    const matchedSection = Object.keys(sectionKeywordToIdMap).find(section =>
                        text.includes(section)
                    );

                    if (matchedSection) {
                        const textareaId = sectionKeywordToIdMap[matchedSection];
                        const textarea = document.getElementById(textareaId);

                        if (textarea) {
                            // Create checkbox
                            const checkbox = document.createElement("input");
                            checkbox.type = "checkbox";
                            checkbox.id = `deepscan_enable_${matchedSection.replace(/\s/g, '_')}`;
                            checkbox.style.marginTop = "5px";
                            checkbox.style.marginRight = "6px";
                            checkbox.style.color = "white";

                            // Create label
                            const label = document.createElement("label");
                            label.htmlFor = checkbox.id;
                            label.innerText = "Enable DeepScan";
                            label.style.color = "white";

                            // Create button
                            const button = document.createElement("button");
                            button.innerText = "DeepScan";
                            button.style.marginLeft = "10px";
                            button.style.padding = "4px 8px";
                            button.style.fontSize = "14px";
                            button.style.cursor = "pointer";
                            button.className = "internal_button";

                            // Attach button click logic
                            button.addEventListener("click", () => {
                                if (!checkbox.checked) {
                                    alert("Enable DeepScan first.");
                                    return;
                                }

                                const href = node.querySelector("a")?.href;
                                if (href) {
                                    chrome.runtime.sendMessage({
                                        type: "triggerDeepScan",
                                        section: matchedSection,
                                        sectionHref: href
                                    });
                                } else {
                                    alert("No modal href found.");
                                }
                            });

                            // Wrap UI in container div
                            const container = textarea.parentElement;
                            container.appendChild(checkbox);
                            container.appendChild(label);
                            container.appendChild(button);
                        }
                    }
                });
                /* deepscan feature work  ENDS */

            }, 2000);//adjust delay here // TIMEOUT ENDS HERE //


            // AUTOMATIC DATA REFRESHER LOGIC //
            let lastUrl = location.href;
            setInterval( () => {
                if(location.href !== lastUrl) {
                    setTimeout( () => {
                        basicProfileData = getBasicProfileSection();
                        expData = getExperienceSection();
                        eduData = getEducationSection();
                        certData = getCertificationSection();
                        skillData = getSkillsSection();

                        injectDataintoTextArea("name_title", basicProfileData.name);
                        injectDataintoTextArea("basicprofile", basicProfileData);
                        injectDataintoTextArea("experiencetext", expData);
                        injectDataintoTextArea("educationtext", eduData);
                        injectDataintoTextArea("certificationstext", certData);
                        injectDataintoTextArea("skillstext", skillData);
                        lastUrl = location.href;
                    }, 1000); // Timeout set to let the page refresh first


                    /* deepscan feature work */
                const sectionKeywordToIdMap = {
                    "education": "educationtext",
                    "experience": "experiencetext",
                    "skills": "skillstext",
                    "licenses & certifications": "certificationstext"
                };

                const sectionArrays = [
                    ["show all", "licenses & certifications"],
                    ["show all", "experience"],
                    ["show all", "skills"],
                    ["show all", "education"]
                ];

                const candidates = document.querySelectorAll(".pvs-list__footer-wrapper");
                const filteredNodes = Array.from(candidates).filter(node => {
                    const text = node.textContent.trim().toLowerCase();
                    return sectionArrays.some(sectionArray =>
                        sectionArray.every(keyword => text.includes(keyword))
                    );
                });

                filteredNodes.forEach(node => {
                    const text = node.textContent.trim().toLowerCase();
                    const matchedSection = Object.keys(sectionKeywordToIdMap).find(section =>
                        text.includes(section)
                    );

                    if (matchedSection) {
                        const textareaId = sectionKeywordToIdMap[matchedSection];
                        const textarea = document.getElementById(textareaId);

                        if (textarea) {
                            // Create checkbox
                            const checkbox = document.createElement("input");
                            checkbox.type = "checkbox";
                            checkbox.id = `deepscan_enable_${matchedSection.replace(/\s/g, '_')}`;
                            checkbox.style.marginTop = "5px";
                            checkbox.style.marginRight = "6px";
                            checkbox.style.color = "white";

                            // Create label
                            const label = document.createElement("label");
                            label.htmlFor = checkbox.id;
                            label.innerText = "Enable DeepScan";
                            label.style.color = "white";

                            // Create button
                            const button = document.createElement("button");
                            button.innerText = "DeepScan";
                            button.style.marginLeft = "10px";
                            button.style.padding = "4px 8px";
                            button.style.fontSize = "14px";
                            button.style.cursor = "pointer";
                            button.className = "internal_button";

                            // Attach button click logic
                            button.addEventListener("click", () => {
                                if (!checkbox.checked) {
                                    alert("Enable DeepScan first.");
                                    return;
                                }

                                const href = node.querySelector("a")?.href;
                                if (href) {
                                    chrome.runtime.sendMessage({
                                        type: "triggerDeepScan",
                                        section: matchedSection,
                                        sectionHref: href
                                    });
                                } else {
                                    alert("No modal href found.");
                                }
                            });

                            // Wrap UI in container div
                            const container = textarea.parentElement;
                            container.appendChild(checkbox);
                            container.appendChild(label);
                            container.appendChild(button);
                        }
                    }
                });
                /* deepscan feature work  ENDS */
                }
            }, 500); // Interval - check every 1 second
            // AUTOMATIC DATA REFRESHER LOGIC ENDS //


        // SLIDER WORK ENDS HERE  -------------- //
        }).catch(error => console.error("Error injecting slider.html: ", error));
} // loadSlider function definition ends here

loadSlider();


// TOGGLE SLIDER LISTENER
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if(msg.todo && msg.todo == "toggle") {
       toggleSlider(); 
    }

    // deepscan feature
    if (msg.type === "injectDeepscanData") {
        const section = msg.section;
        const content = msg.content;

        const textareaId = {
            "education": "educationtext",
            "experience": "experiencetext",
            "skills": "skillstext",
            "certifications": "certificationstext"
        }[section];

        const textarea = document.getElementById(textareaId);
        if (textarea) {
            textarea.value = JSON.stringify(content, null, 2);
        }
    }
});



// CSS STYLE CHANGE LOGIC ON TOGGLE TRIGGER
function toggleSlider() {
    const slider = document.getElementById("yale3_slider");
    //if(!slider) return;
    const styler = slider.style;

    if (styler.width === "0px") {
        styler.width = "450px";
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

// Validate the selector group from selectors object
function validateSelector(selectorGroup, baseNode=document) {
    const results = {};
    for( const [key, selector] of Object.entries(selectorGroup)) {
        if (typeof selector !== "string") {
            // skip nested objects like 'multiRole' in experience section of selectors
            continue;
        }
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
            if(element.tagName === "IMG") {
                data[key] = element?.src || "";
            } else { // else normal extraction
                data[key] = element?.textContent.trim();
            }
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
    if (!expNode) return {};

    const ul = expNode.children[2]?.querySelector("div > ul");
    if (!ul) return {};

    const allLi = Array.from(ul.querySelectorAll("li"));
    const topLi = allLi.filter(li => li.parentElement === ul);

    const validationResults = {};

    topLi.forEach((li, index) => {
        const key = `li_${index}`;
        const nestedUL = li.querySelector("ul");
        const nestedLIs = nestedUL ? Array.from(nestedUL.querySelectorAll(":scope > li")) : [];

        const isMultiRole = nestedLIs.some(nestedLi =>
            nestedLi.querySelector(window.selectors.experience.multiRole.subli.jobTitle)
        );

        if (isMultiRole) {
            // Validate outer topLi with company-level multiRole selectors
            const outerValidation = validateSelector(window.selectors.experience.multiRole, li);

            // For each sub-role
            nestedLIs.forEach((subLi, subIndex) => {
                const subKey = `${key}_sub_${subIndex}`;
                const subValidation = validateSelector(window.selectors.experience.multiRole.subli, subLi);

                // Combine results as one structure
                validationResults[subKey] = {
                    node: subLi,
                    parent: li, // needed for company-level data
                    result: {
                        outer: outerValidation,
                        inner: subValidation
                    },
                    isMultiRole: true
                };
            });
        } else {
            const validation = validateSelector(window.selectors.experience, li);

            validationResults[key] = {
                node: li,
                result: validation,
                isMultiRole: false
            };
        }
    });

    return getExperienceData(validationResults);
}


// get EXPERIENCE SECTION data
function getExperienceData(results) {
    const items = [];

    for (const [key, { node, result, isMultiRole, parent }] of Object.entries(results)) {
        const data = {};

        if (isMultiRole) {
            const { outer, inner } = result;

            const outerRequired = ['companyName', 'location'];
            const innerRequired = ['jobTitle', 'duration'];

            const outerValid = outerRequired.every(f => outer[f]);
            const innerValid = innerRequired.every(f => inner[f]);
            if (!outerValid || !innerValid) continue;

            // Extract company-level data
            for (const [field, selector] of Object.entries(window.selectors.experience.multiRole)) {
                if (field === "subli") continue;
                if (typeof selector !== "string") continue;

                const el = parent.querySelector(selector);
                data[field] = el ? el.textContent.trim() : "";
            }

            // Extract role-level data
            for (const [field, selector] of Object.entries(window.selectors.experience.multiRole.subli)) {
                if (typeof selector !== "string") continue;

                const el = node.querySelector(selector);
                data[field] = el ? el.textContent.trim() : "";
            }

        } else {
            const requiredFields = ['jobTitle', 'companyAndType', 'duration'];
            const allValid = requiredFields.every(f => result[f]);
            if (!allValid) continue;

            for (const [field, selector] of Object.entries(window.selectors.experience)) {
                if (typeof selector !== "string") continue;

                const el = node.querySelector(selector);
                data[field] = el ? el.textContent.trim() : "";
            }
        }

        items.push({ key, data });
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


// get Certifications SECTION
function getCertificationSection() {
    const sections = getSectionsList();
    const certNode = getSectionWithId(sections, "licenses_and_certifications");

    if(certNode) {//if certNode exists
       const ul = certNode.children[2]?.querySelector("ul") || null;
        if(ul) {
            allLi = Array.from(ul.querySelectorAll("li"));
            topLi = allLi.filter(li => li.parentElement === ul); // getting all top level li

            // we loop through topLi items and validate using selectors object
            const validationResults = {};

            topLi.forEach((li, index) => {
                const key = `li_${index}`;
                const validation = validateSelector(window.selectors.certifications, li);
                validationResults[key] = {
                    node: li,
                    result: validation
                };
            });
            
            return getCertificationData(validationResults);
        } // if ul exists condn ends 
        else {
            return {}; //return empty object if ul is null
        }
    } // if eduNode exists condn ends 
    else {
        return {}; //return empty object if eduNode is null
    }
}

//get certifications Data
function getCertificationData(results) {
    const items = [];
    for (const [key, {node, result}] of Object.entries(results)) {
        // only process if all selectors are valid

        const requiredFields = ['name', 'issuer'];
        const allValid = requiredFields.every(field => result[field]);
        if(!allValid) continue;

        const data = {};
        for (const [field, selector] of Object.entries(window.selectors.certifications)) {
            const el = node.querySelector(selector);
            if(field === "credential_url") {
                data[field] = el ? el.getAttribute("href") : "";
            } else {
                data[field] = el ? el.textContent.trim() : "";
            }
        }
        items.push({key, data});
    }
    return items;
}

// get skills SECTION
function getSkillsSection() {
const sections = getSectionsList();
    const skillNode = getSectionWithId(sections, "skills");

    if(skillNode) {//if certNode exists
       const ul = skillNode.children[2]?.querySelector("ul") || null;
        if(ul) {
            allLi = Array.from(ul.querySelectorAll("li"));
            topLi = allLi.filter(li => li.parentElement === ul); // getting all top level li

            // we loop through topLi items and validate using selectors object
            const validationResults = {};

            topLi.forEach((li, index) => {
                const key = `li_${index}`;
                const validation = validateSelector(window.selectors.skills, li);
                validationResults[key] = {
                    node: li,
                    result: validation
                };
            });
            
            return getSkillsData(validationResults);
        } // if ul exists condn ends 
        else {
            return {}; //return empty object if ul is null
        }
    } // if eduNode exists condn ends 
    else {
        return {}; //return empty object if eduNode is null
    }
}

// get skills Data
function getSkillsData(results) {
    const items = [];
    for (const [key, {node, result}] of Object.entries(results)) {
        // only process if all selectors are valid
        const requiredFields = ['name'];
        const allValid = requiredFields.every(field => result[field]);
        if(!allValid) continue;

        const data = {};
        for (const [field, selector] of Object.entries(window.selectors.skills)) {
            const el = node.querySelector(selector);
            data[field] = el ? el.textContent.trim() : "";
        }
        items.push({key, data});
    }
    return items;
}

// inject data into text boxes in the slider.html
function injectDataintoTextArea(nodeId, data) {
    const textarea = document.getElementById(nodeId);
    if(!textarea) {
        console.error(`Text area node with id ${nodeId} not found.`);
        return;
    }

    textarea.innerText = typeof data === 'object'
        ? JSON.stringify(data, null, 2)
        : String(data);   
}

// save profile data extracted so far
function saveProfileData(basicData, expData, eduData, certData, skillData) {

    const fullData = {
        id: window.location.href,
        savedDate: new Date().toISOString(),
        basicProfile: basicData,
        experience: expData,
        education: eduData,
        certification: certData,
        skills: skillData
    };


    const name = basicData?.name?.replace(/\s+/g, "_") || window.location.href;
    const date = new Date().getTime();
    const filename =    `${name}_${date}.json`  ;

    chrome.runtime.sendMessage({
        type: "downloadProfile",
        filename,
        content: JSON.stringify(fullData, null, 2)
    });
}
