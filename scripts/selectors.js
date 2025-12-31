// Section contains the profile selectors


// declaring selectors object as global variable
window.selectors = {
    basicProfile: {
        name: "h1",
        headline: "div.text-body-medium.break-words",
        location: "span.text-body-small.inline.t-black--light.break-words",
        about: "section[data-view-name='profile-card'] div.inline-show-more-text--is-collapsed > span[aria-hidden='true']",
        photo_url: "div.pv-top-card__non-self-photo-wrapper img"
    },
    experience: {
        jobTitle: "div.t-bold span[aria-hidden='true']",
        companyAndType: "span.t-14.t-normal > span[aria-hidden='true']",
        duration: "span.pvs-entity__caption-wrapper[aria-hidden='true']",
        location: "span.t-14.t-normal.t-black--light:not(:has(.pvs-entity__caption-wrapper)) > span[aria-hidden='true']",
        multiRole: {
            companyName: "div > a.optional-action-target-wrapper span[aria-hidden='true']",
            location: "span.t-14.t-normal.t-black--light > span[aria-hidden='true']",
            subli: {
                jobTitle: "div.t-bold span[aria-hidden='true']",
                duration: "span.t-14.t-normal.t-black--light span[aria-hidden='true']"
            }
        }
    },
    education: {
        name: "span[aria-hidden='true']:first-of-type",
        degree: ".t-14.t-normal:not(.t-black--light) > span[aria-hidden='true']",
        duration: ".t-14.t-normal.t-black--light span[aria-hidden='true']",
        grade: "div[dir='ltr'] > div[style*='-webkit-line-clamp'] span[aria-hidden='true']",
        schoolUrl: "a.optional-action-target-wrapper"
    },
    certifications: {
        name: ".t-bold span[aria-hidden='true']",
        issuer: "span.t-14.t-normal span[aria-hidden='true']",
        validity_duration: ".t-black--light span",
        credential_id : ".t-black--light + .t-black--light span",
        credential_url: "div.pvs-entity__sub-components a", 
    },
    skills: {
        name: 'a[data-field="skill_card_skill_topic"] span[aria-hidden="true"]',
        endorsements: 'a[href*="/endorsers"] span[aria-hidden="true"]',
        experience: 'div.pvs-entity__sub-components li span[aria-hidden="true"] + li span[aria-hidden="true"]'
    }
};