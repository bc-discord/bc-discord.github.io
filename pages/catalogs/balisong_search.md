---
layout: default
title: Balisong Search
permalink: /search/
---

# Balisong Search

<link rel="stylesheet" href="{{ '/assets/css/bali.css' | relative_url }}">

<form id="filters" data-json="{{ '/balisongs.json' | relative_url }}">
  <label class="retail">
    <span>Retail:</span>
    <input type="number" id="minPrice" min="0" step="1" placeholder="Min (e.g., 200)">
    <span>–</span>
    <input type="number" id="maxPrice" min="0" step="1" placeholder="Max (e.g., 500)">
  </label>

  <label>
    <span>Status: </span>
    <select id="status">
      <option value="">Any</option>
      <option>Available</option>
      <option>Discontinued</option>
      <option>Hiatus</option>
    </select>
  </label>

  <label>
    <span>Material (contains)</span>
    <input type="text" id="material" placeholder="e.g. titanium">
  </label>

  <div class="actions">
    <button type="button" id="searchBtn">Search</button>
    <button type="button" id="resetBtn">Reset</button>
    <span id="count" class="muted"></span>
  </div>
</form>

<ul id="results" aria-live="polite"></ul>

<script defer src="{{ '/assets/js/bali-search.js' | relative_url }}"></script>
