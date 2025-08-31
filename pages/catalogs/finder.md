---
layout: default
title: Balisong Finder 🔎
parent: Catalog
permalink: /search/
nav_order: 1
---
<link rel="stylesheet" href="{{ '/assets/css/bali.css' | relative_url }}">

<template id="maker-tpl">
  <div class="maker-block">
    <h3 class="maker-name"></h3>
    <ul class="maker-list"></ul>
  </div>
</template>

<template id="item-tpl">
  <li class="balisong-list">
    <div>
      <a class="item-link"></a> 
      <span id="status-divider"> • </span>
      <span class="status"></span>
      <span class="item-info"></span> 
    </div>
    <div class="muted item-meta"></div>
  </li>
</template>

# Balisong Finder

You can use this page to filter for balisongs with specific qualities. Only the balisongs with individual pages will show up here.

---

<form id="filters" data-json="{{ '/balisongs.json' | relative_url }}">

  <fieldset class="input-frame">
    <legend class="input-frame-text">Status</legend>  
    <label>
      <select id="status">
        <option value="">Any</option>
        <option>Available</option>
        <option>Discontinued</option>
        <option>Hiatus</option>
      </select>
    </label>
  </fieldset>
  
  <fieldset class="input-frame">
    <legend class="input-frame-text">Retail</legend>  
      <label class="retail">
        <div class="pair-input">
          <input type="number" id="minPrice" min="0" step="1" placeholder="Min (e.g., 200)">
          <input type="number" id="maxPrice" min="0" step="1" placeholder="Max (e.g., 500)">
        </div>
      </label>
  </fieldset>

  <fieldset class="input-frame">
  <legend class="input-frame-text">Weight (oz)</legend>  
    <label class="overall-weight">
      <div class="pair-input">
        <input type="number" id="minWeight" min="0" step=".1" placeholder="Min (e.g., 3.10)">
        <input type="number" id="maxWeight" min="0" step=".1" placeholder="Max (e.g., 4.90)">
      </div>
    </label>
  </fieldset>

  <fieldset class="input-frame">
  <legend class="input-frame-text">Stop System</legend>  
    <label>
      <select id="stopSystem">
        <option value="">Any</option>
        <option value="zen">Zen Pins</option>
        <option value="tang">Tang Pins</option>
        <option value="pinless">Pinless</option>
      </select>
    </label>
  </fieldset>

  <fieldset class="input-frame">
    <legend class="input-frame-text">Handle</legend>  
    <div>
      <label for="handleConstruction">Construction</label>
      <select id="handleConstruction">
        <option value="">Any</option>
        <option value="channel">Channel</option>
        <option value="channel;scales">Channel and Scales</option>
        <option value="sandwich">Sandwich</option>
        <option value="liner;scale">Liners and Scales</option>
        <option value="chanwich">Chanwich</option>
      </select>
    </div>
    <div>
      <label for="handleMaterial">Material</label>
      <input type="text" id="handleMaterial" placeholder="e.g. Titanium">
    </div>
  </fieldset>

  <div class="actions">
    <button type="button" id="searchBtn" class="search-btn">Search</button>
    <button type="button" id="resetBtn" class="reset-btn">Reset</button>
    <span id="count" class="muted"></span>
  </div>
</form>

---

## Search Results

<div id="results" aria-live="polite"></div>

<script defer src="{{ '/assets/js/bali-search.js' | relative_url }}"></script>
