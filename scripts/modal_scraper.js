(function () {
    const sectionMap = {
        "certifications": "certifications",
        "skills": "skills",
        "experience": "experience",
        "education": "education"
    };

    function extractData() {
        const pathname = location.pathname.toLowerCase(); // e.g., /in/username/details/certifications/

        let section = "unknown";
        for (const key in sectionMap) {
            if (pathname.includes(key)) {
                section = sectionMap[key];
                break;
            }
        }

        const selectors = window.selectors?.[section];
        if (!selectors) {
            chrome.runtime.sendMessage({
                type: "deepscanResult",
                section,
                content: "No selector config found for this section"
            });
            return;
        }

        const nodes = document.querySelector("div > ul").children;

        const extractedData = Array.from(nodes).map((node) => {
            const item = {};

            for( const [field, selector] of Object.entries(selectors.fields)) {
                const el = node.querySelector(selector);
                item[field] = el ? el.innerText.trim() : null;
            }

            return item;
        });


        chrome.runtime.sendMessage({
            type: "deepscanResult",
            section,
            content: extractedData // send as structured data
        });
    }

    if (document.readyStatet === "complete") {
        extractData();
    } else {
        window.addEventListener("load", extractData);
    }

})();
