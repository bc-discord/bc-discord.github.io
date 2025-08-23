---
layout: page
title: For Contributors
nav_order: 7
---

# For Contributors
If you would like to contribute:

1. Request access from [the repository owner](mailto:balisongcommunity.discord@gmail.com) by emailing.
2. Head to the [repository](https://github.com/bc-discord/bc-discord.github.io).
3. Create a new branch based on `main`.
4. Make your edits.
5. Submit your pull request.
6. If your edits look fine, they will be accepted with your changes reflected in the website.

## Github Usage
Github is the place that stores code and information for the website, with some infrastructure to manage it. The project area is called a **repository**, which is [this page](https://github.com/bc-discord/bc-discord.github.io); the repository is made up of different **branches**, different copies of your code different people can manage. The `main` branch is the deployment branch the website is based on. To organize your changes, make your own branch, most likely from the `main` branch. Making a change requires a **commit** that represents the change. You can edit files directly in Github, then commit your changes; a **push** publishes your commit. You can commit several times for a given branch, with commits that pertain to different files. To merge your changes into the `main` branch, make a **pull request** that goes from `your branch → main`. There are Github rules inplace that require reviews from other contributers for a pull request to be approved.

## Branch Usage
...

## Balisong Page
If you would like to create a balisong page, 

1. Copy the template `_template.yml.example` in `/_data/balisongs/` and fill it out. Place it in `/_data/balisong/*name*.yml` when you are done. The filename should be the balisong name but all lower case and spaces replaced with underscores. Instructions for fillout out the form are written in the template. You **must** make the yaml file so that your balisong page can be filtered and is programmatically searchable. 
2. Make a stub page in `/pages/_balisongs/`.  There are a few options for making the page:
    - **Recommended**: Using the `balisong.html` layout by adding `layout: balisong` to the frontmatter section. Easiest way.
    - Copying the `balisong.html` file and turning it into a markdown file with manual edits. When you want the general layout but with different organization or content.
    - Completely by hand.
3. Link your page in `/pages/catalogs/makers.md` under the appropriate maker for your page to be accessible.



