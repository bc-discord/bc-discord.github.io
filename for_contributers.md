---
layout: page
title: For Contributers
nav_order: 7
---

# For Contributers
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

## Balisong Frontmatter
If you are contributing a page for a balisong, you must have this frontmatter subsection to make it programmatically searchable. Here is the frontmatter subsection for the Replicant.

```
start_year: 
end_year: 
active_status: Available
retail: 350
production: CNC
handle_construction: Liners and Scales
handle_material: Mixed
liner_material: Titanium
scale_material: G10
stop_system: Screwed Zen Pins
weight_oz: 4.90
does_ring: false
```

| Tag| Description | Range / Possible Values |
|-|-|-|
| start_year | Release year | Non-negative whole number |
| end_year| Discontinuation year | Non-negative whole number  |
| active_status| Current availability | Available · Discontinued · Hiatus |
| retail| Price in USD | Non-negative whole number |
| production | How it was made | CNC · Midtech · Handmade |
| handle_construction | Handle build type | Liners and Scales · Sandwich · Channel · Chanwich |
| handle_material| Handle material | Titanium · Steel · G10 · CF · Mixed |
| liner_material | Material for liners (blank if not Liners/Scales) | Titanium · Steel · G10 · CF |
| scale_material | Material for scales (blank if not Liners/Scales) | Titanium · Steel · G10 · CF |
| stop_system | Blade stop system | Pressed Tang Pins · Screwed Tang Pins · Pressed Zen Pins · Screwed Zen Pins · Hidden Zen Pins · Pinless |
| weight_oz| Weight in ounces (if inconsistent, write 'Varies') | Decimal, two decimal points |
| does_ring | Rings when flipping | true · false |