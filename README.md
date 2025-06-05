# Yale3
 Updated and simplified version of Rekrut (Linkedin scraper for extracting profile data)

Yal§ or Yale3 (pronounced as Yal-crow) is a simplified version of [Rekrut](https://github.com/DrakenWan/Rekrut). Just enable developer mode in your `chrome://extensions` tab and click on `load unpacked` button and browse to the cloned folder. Run it on linkedin website profiles. Raw JSON profile data will be displayed on a sidebar that will appear when you click on the extension icon.

 Remember to scroll down slowly and click on all ["show more"](#) buttons, if any, to correctly extract data.

 All update logs to the code/logic of the extension can be seen in the [Updates](#update-timeline) section.


You are free to do anything with the code on the repo. Read the [license](https://github.com/DrakenWan/Yale3/blob/main/LICENSE)

## What is Deepscan?

Deepscan feature is disabled for now. Working on improving this feature.

## Extraction

Below table shows what can be extracted and if the data is clean

Section Name       |      Can Extract?      | Clean?              | Deepscan Extraction? (**disabled**)
:----------------- | :-----------------     | :-----------------  | :------------------
*basic profile data*    |     :heavy_check_mark: | :x:   |  :x:
*experience section*|     :heavy_check_mark: | :x: |  :x:
*education section*|     :heavy_check_mark: | :x: | :x:
*certifications* |     :x: | :x: | :x:
*skills section*  |     :x: | :x: | :x:


## Bug reporting
I strive to make the code as general as possible but the extractor tool may not be perfect. If you find any bug on any profile please let me know in [issues](https://github.com/DrakenWan/Yale3/issues) section.

Note**: If the chrome extension hangs due to some error or bug, go to `chrome://extensions` and `update` the `Yale3` extension and referh to a new linkedin profile. THis will resolve the issue. If possible you can screenshot the error you find in the `chrome://extensions` page and report it in the issue section.
## Update Timeline

I will keep posting timed updates here. In future will shift these somewhere else if I have time

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

