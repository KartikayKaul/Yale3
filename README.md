
# Yale3
 Updated and simplified version of Rekrut (Linkedin scraper for extracting profile data)

Yal§ or Yale3 (pronounced as Yal-crow) is a simplified version of [Rekrut](https://github.com/DrakenWan/Rekrut). Just enable developer mode in your `chrome://extensions` tab and click on `load unpacked` button and browse to the cloned folder. Run it on linkedin website profiles. Raw JSON profile data will be displayed on a sidebar that will appear when you click on the extension icon.


Before clicking***saving profile data***, it's recommended to click "Refresh Profile Data" to refresh data for good measure.

 All update logs to the code/logic of the extension can be seen in the [Updates](#update-timeline) section.

You are free to do anything with the code on the repo. Read the [license](https://github.com/DrakenWan/Yale3/blob/main/LICENSE)

## Atlas Integration – Cloud Saving to MongoDB Atlas
Added support for saving extracted LinkedIn profile data directly to a MongoDB Atlas cloud database using a Vercel-hosted serverless API. It includes a deployment script ([deploy_vercel_function.sh](https://github.com/KartikayKaul/Yale3/blob/atlas_int/deploy_vercel_function.sh) that configures the serverless function, securely connects to MongoDB Atlas using credentials from the local config.json, and updates the extension to support a Save Option dropdown (Local or Cloud). Ideal for users who want persistent, centralized storage of profile data. Full setup guide available in the [wiki](https://github.com/KartikayKaul/Yale3/wiki/MongoDB-Atlas-Integration-Guide).

### Key Features
- Send extracted profile data from the Chrome extension to a **MongoDB Atlas database**.
- Uses a Vercel serverless endpoint (`/api/save`) to receive and store data securely.
- No local backend needed — the cloud function does all the work.

### Updated Project Structure
- `vercel/` folder created dynamically via shell script.
- `config.json` updated with `MONGO_API_ENDPOINT`.

### How to Use
1. Ensure you’ve created a MongoDB Atlas cluster.
2. Sign up at [vercel.com](https://vercel.com) and link your GitHub account (or any account you have).
3. Run the provided `deploy_vercel_function.sh` script to:
   - Generate the serverless function.
   - Deploy it to Vercel.
   - Automatically update `config.json` with your API endpoint.
4. Choose `save to MongoDB` in your Chrome extension UI.
5. Data will be POSTed to your MongoDB Atlas cluster in real-time.

## Extraction

Below table shows what can be extracted and if the data is clean.

Section Name       |      Can Extract?      | Clean?              | Deepscan Extraction? (**disabled**)
:----------------- | :-----------------     | :-----------------  | :------------------
*basic profile data*    |     :heavy_check_mark: | :heavy_check_mark:   |  :x:
*experience section*|     :heavy_check_mark: | :x: |  :x:
*education section*|     :heavy_check_mark: | :x: | :x:
*certifications* |     :heavy_check_mark: | :x: | :x:
*skills section*  |     :heavy_check_mark: | :x: | :x:

The data that is extracted is clean but some simple string methods can be used to split the text and get the relevant data. Below sample JSON object list will give an idea of what the output looks like:-
```json
[
  {
    "key": "li_0",
    "data": {
      "jobTitle": "Python Developer",
      "companyAndType": "Tech Mahindra · Internship",
      "duration": "Apr 2025 - Present · 4 mos",
      "location": "Plano, Texas, United States · Remote"
    }
  },
  {
    "key": "li_1",
    "data": {
      "jobTitle": "Computer Programmer (Data and Automation)",
      "companyAndType": "Pro-Tek Consulting · Full-time",
      "duration": "Nov 2024 - May 2025 · 7 mos",
      "location": "Woodland, California, United States · Hybrid"
    }
  },
  {
    "key": "li_2",
    "data": {
      "jobTitle": "Data Scientist",
      "companyAndType": "Radiance Technologies · Internship",
      "duration": "Aug 2024 - Oct 2024 · 3 mos",
      "location": "Sheridan, Wyoming, United States · Remote"
    }
  },
  {
    "key": "li_3_sub_0",
    "data": {
      "companyName": "Zummit Infolabs",
      "location": "Bengaluru, Karnataka, India · Remote",
      "jobTitle": "Technical Lead",
      "duration": "Feb 2022 - Jun 2022 · 5 mos"
    }
  },
  {
    "key": "li_3_sub_1",
    "data": {
      "companyName": "Zummit Infolabs",
      "location": "Bengaluru, Karnataka, India · Remote",
      "jobTitle": "Data Science Intern",
      "duration": "Jan 2022 - Jun 2022 · 6 mos"
    }
  },
  {
    "key": "li_4",
    "data": {
      "jobTitle": "Software Development Intern",
      "companyAndType": "Darwinbox · Internship",
      "duration": "May 2019 - Jul 2019 · 3 mos",
      "location": "Hyderabad, Telangana, India · On-site"
    }
  }
]
```

This is the list of experiences scraped from my own linkedin profile page. You can clearly see that on some attributes we can perform splits using separators like `·`.

## Bug reporting
I strive to make the code as general as possible but the extractor tool may not be perfect. If you find any bug on any profile please let me know in [issues](https://github.com/DrakenWan/Yale3/issues) section.

Note**: If the chrome extension hangs due to some error or bug, go to `chrome://extensions` and `update` the `Yale3` extension and referh to a new linkedin profile. THis will resolve the issue. If possible you can screenshot the error you find in the `chrome://extensions` page and report it in the issue section.


## Update Timeline

I will keep posting timed updates here. In future will shift these somewhere else if I have time

#### Update(dated: 1st January 2026)
- I have merged `atlas_int` branch into the main branch. Resolved all conflicts. You can still run the repository without running deployment script for mongoDB atlas connection but calling cloud save option to dump profile data will lead to error message.

#### Update(dated: 21st July 2025)
- I have added logic to scrape skills section as well.
- Fixed a few bugs
- Added `atlas_int` branch that allows for integrating the mongoDB atlas connection to save data in atlas cloud db cluster ( the free tier )

#### Update(dated: 16th July 2025)
- Added logic to extract the certifications section
- fixed a bug in last commit on saveProfileAPI
#### Update(dated: 4th July 2025)
- Added logic to scrape the multi-role experiences properly. Earlier they were getting extracted into wrong attributes. The attributes for multi-role objects differ from single-role experience objects. One way to differentiate multi-role from single-role is to look at the `key` attribute for each object which, for instance, looks like `li_2_sub_0`, if `sub` substring is present in the `key` attribute's value then that means it is a multi-role entry in the list.
- This data is not "clean" so that means you still need to perform some "trimming" and extra "data cleaning" steps after to get the exact data which can be done in two or three lines of code.
- As of now, we can scrape, `basic profile data`, `education section` and `experience section`. Off to generate logic for `skills` and `certification` sections. 

#### Update(dated: 5th June 2025)
- Overhauled entire code for scraping the data
- Heavily modularized the extraction logic
- Added selectors for extraction of data to improve validation checks using selectors object in [selectors.js](./scripts/selectors.js) file. Also helps to observe the changes in the DOM and CSS style changes with much ease
- Changed CSS styles (it is bit better now :D). Manual extraction buttons are not needed.
- Currently able to extract `basic profile data`, `experiences` and `education` section.
- `Deepscan` feature is **disabled**. Working on a better method to get detailed data.
- The data that comes out in the JSON objects are not exactly clean.


#### Update(dated: 12th March, 2023)

- The deepscan is not working for experience section. I am looking into it. won't take much time to fix it.

#### Update(dated: 20th February, 2023)

- Completed the code for education section extraction. I have tested it only on one profile. Need to test on other profiles too. You may notice the code has been recycled from the `extractCert` method. LinkedIn has made their HTML document very consistent in last update. Most of the anchor part of the code can be simply copied from any of the other sections. Can make some of these common variables common for these different manual extraction methods but it will be cumbersome.


#### Update(dated: 29th December, 2022)

- I have fixed the extraction of `experience section`. It is working fine for 30 LinkedIn profile pages I verified it with.
- I have added a `clear text` button to clear textbox content.
- Removed the old, redundant code with new code or deleted it entirely.
- Will start working on writing code for scraping other sections that are left.

  (second update)
- Added a save profile data button that consolidates profile data textboxes' values into a text file. Prompts user to name the file.

#### Update(dated: 27th December, 2022)

Apparently, the HTML code for `experience section` has been changed by a slight. But that is huge since experience section was hardest to generalize for me. It will take time to make further correction to it. The deepscan extraction still works for this section since the HTML document for all of them new pages is same and not changed.

I am going to start working on extracting the other sections of the linkedin profile. I noticed that a lot of redundant code has been left by me and which might mislead some of you (who dive into the code) into thinking some of this redundant code is being used which is not the case. I will start in removing some of this redundant code with small minor updates. Some of that code might be useful so I will take my time in removing it. Most of the old Yale3 code has been replaced by new one in commits I believe I made around mid-August of 2022. It was when I migrated the extension from manifest v2 to v3.

#### Update(dated: 12th November, 2022)

Some minor error fixing due to HTML changes. Currently not able to conceive extraction codes for remaining sections due to heavy school schedule. Feel free to contribute if anyone wants to. I will try to create codes for them asap

#### Update(dated: 16th August, 2022)

Added experience extraction through manual selection. Look for bugs if any. Only test on five profiles on LinkedIn. Still looking for errors by testing it on various LinkedIn profile. If I find any errors, I will fix them asap.

#### Update (dated: 15th August, 2022)

Added skills extraction. Changed the UI a bit. The UI is still ugly. If someone wants to help with it they are more than welcome.

#### Update (dated: 14th August, 2022)

I have added a button to manually extract certifications. I have not been able to get any errors using this `manual feature` on the 10 standard reference LinkedIn profiles while coding it. The manual extraction utility includes a **deepscan** feature. If a section has more than three items in its list then the user can click on *deepscan checkbox* and click on the _show more arrow_ to open the new page with the entire list of items of the section and then press the `extract {section name}` button. Experiment around with the feature and you will understand how it works. I will add this feature one-by-one for all sections for easier scraping of profile data.


#### Update (dated: 30th July, 2022)

I have migrated the manifest version from 2 to 3 for the extension. The version of Yalcrow has been changed to 2.0.0 starting from this readme commit. There are some errors that occured in doing so that I have mentioned in the description of last [commit](https://github.com/DrakenWan/Yale3/commit/af96ff1b5589b70a246e5112a0ebc4aa57cae443). But these errors do not jeopardise the extraction tool and it will still work on a linkedin profile page to extract the sections that are tickmarked in the aforementioned section.


I am going to start working on adding a few extensible features and I am going to completely change the way the extraction tool works as well. Currently, the extraction tool is initiated by scrolling the profile page but I will add buttons for each separate section to perform the extraction separately and manually at the click of a button. For now that seems to be the only possible solution in my mind to perform scraping with no conflicts.



#### Update (dated: 9th January, 2022)

LinkedIn has made drastic changes to the way profile data is loaded. I have been quite busy with work lately. Not all sections can be extracted due to major document tag changes as well as the way the profile now interacts with user actions. Clicking on  'Show More *' buttons takes you away to an entirely different document. I will try to amend this asap.
